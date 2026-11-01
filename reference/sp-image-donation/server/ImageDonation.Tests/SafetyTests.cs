using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ImageDonation.Tests;

// 안전 장치: 거절, 차단, 신고, 다른 스트리머의 후원 건드리기
public class SafetyTests
{
    private static async Task<(int Id, string ImageUrl)> DonateAsync(ApiFactory app, HttpClient streamer, string slug)
    {
        var response = await app.CreateClient().PostAsync($"/api/public/streamers/{slug}/donations", ApiFactory.DonationForm(TestImages.Png()));
        response.EnsureSuccessStatusCode();
        var id = (await response.Content.ReadFromJsonAsync<CreateDonationResponse>(ApiFactory.Json))!.Id;
        var list = await streamer.GetFromJsonAsync<List<DonationDto>>("/api/dashboard/donations", ApiFactory.Json);
        return (id, list!.Single(d => d.Id == id).ImageUrl!);
    }

    [Fact]
    public async Task Reject_DeletesImageFile()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("rejecter");
        var (id, imageUrl) = await DonateAsync(app, streamer, "rejecter");
        Assert.Equal(HttpStatusCode.OK, (await app.CreateClient().GetAsync(imageUrl)).StatusCode);

        (await streamer.PostAsync($"/api/dashboard/donations/{id}/reject", null)).EnsureSuccessStatusCode();

        Assert.Equal(HttpStatusCode.NotFound, (await app.CreateClient().GetAsync(imageUrl)).StatusCode);
        Assert.False(File.Exists(Path.Combine(app.MediaPath, imageUrl["/media/".Length..])));
    }

    [Fact]
    public async Task Block_ThenNextUploadIsForbidden()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("blocker");
        var (id, _) = await DonateAsync(app, streamer, "blocker");

        var block = await streamer.PostAsync($"/api/dashboard/donations/{id}/block", null);
        Assert.Equal(DonationStatus.Rejected, (await block.Content.ReadFromJsonAsync<DonationDto>(ApiFactory.Json))!.Status);

        // 같은 곳(테스트 서버에서는 IP를 모르므로 모두 같은 "unknown")에서 다시 보내면 403
        var again = await app.CreateClient().PostAsync("/api/public/streamers/blocker/donations", ApiFactory.DonationForm(TestImages.Png()));
        Assert.Equal(HttpStatusCode.Forbidden, again.StatusCode);
    }

    [Fact]
    public async Task Report_StoresReport_RejectsAndBlocks()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("reporter");
        var (id, imageUrl) = await DonateAsync(app, streamer, "reporter");

        var response = await streamer.PostAsJsonAsync($"/api/dashboard/donations/{id}/report", new { reason = "부적절한 이미지" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(DonationStatus.Rejected, (await response.Content.ReadFromJsonAsync<DonationDto>(ApiFactory.Json))!.Status);
        Assert.Equal(HttpStatusCode.NotFound, (await app.CreateClient().GetAsync(imageUrl)).StatusCode); // 누구에게도 제공하지 않는다

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var report = await db.Reports.SingleAsync();          // 운영자가 SQL로 볼 신고 기록
            Assert.Equal((id, "부적절한 이미지"), (report.DonationId, report.Reason));
            Assert.Equal(1, await db.BlockEntries.CountAsync());
        }

        var again = await app.CreateClient().PostAsync("/api/public/streamers/reporter/donations", ApiFactory.DonationForm(TestImages.Png()));
        Assert.Equal(HttpStatusCode.Forbidden, again.StatusCode);
    }

    [Fact]
    public async Task Report_KeepsImageAsEvidence_UntilRetention()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("evidence");
        var (id, imageUrl) = await DonateAsync(app, streamer, "evidence");
        var file = imageUrl["/media/".Length..];
        using var scope = app.Services.CreateScope();
        var storage = scope.ServiceProvider.GetRequiredService<IImageStorage>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        (await streamer.PostAsJsonAsync($"/api/dashboard/donations/{id}/report", new { reason = "증거로 남겨 주세요" })).EnsureSuccessStatusCode();

        // 신고된 이미지는 운영자가 볼 증거라 저장소에 남지만(격리), /media로는 누구에게도 제공하지 않는다
        Assert.True(storage.Exists(file));
        Assert.Equal(HttpStatusCode.NotFound, (await app.CreateClient().GetAsync(imageUrl)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await streamer.GetAsync(imageUrl)).StatusCode); // 로그인한 스트리머에게도

        // 7일 보관 기간이 지나면 정리 작업이 지운다 (후원이 8일 전에 만들어진 것으로 바꿔서 확인)
        var eightDaysAgo = DateTimeOffset.UtcNow.AddDays(-8);
        await db.Donations.Where(d => d.Id == id).ExecuteUpdateAsync(s => s.SetProperty(d => d.CreatedAt, eightDaysAgo));
        await app.Services.GetRequiredService<RetentionService>().RunOnceAsync();

        Assert.False(storage.Exists(file));
        Assert.Equal(1, await db.Reports.CountAsync()); // 신고 기록(후원 ID·사유)은 남는다
    }

    [Fact]
    public async Task Report_ReasonIsRequiredAndLimited()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("strict-report");
        var (id, _) = await DonateAsync(app, streamer, "strict-report");

        var empty = await streamer.PostAsJsonAsync($"/api/dashboard/donations/{id}/report", new { reason = "" });
        var tooLong = await streamer.PostAsJsonAsync($"/api/dashboard/donations/{id}/report", new { reason = new string('가', 201) });

        Assert.Equal(HttpStatusCode.BadRequest, empty.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, tooLong.StatusCode);
    }

    [Fact]
    public async Task OtherStreamersDonation_Is404()
    {
        await using var app = new ApiFactory();
        var owner = await app.CreateStreamerClientAsync("owner");
        var intruder = await app.CreateStreamerClientAsync("intruder");
        var (id, _) = await DonateAsync(app, owner, "owner");

        // 다른 스트리머의 후원은 "없는 것"과 같다: 승인·거절·차단·신고 모두 404
        Assert.Equal(HttpStatusCode.NotFound, (await intruder.PostAsync($"/api/dashboard/donations/{id}/approve", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await intruder.PostAsync($"/api/dashboard/donations/{id}/reject", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await intruder.PostAsync($"/api/dashboard/donations/{id}/block", null)).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound,
            (await intruder.PostAsJsonAsync($"/api/dashboard/donations/{id}/report", new { reason = "남의 것" })).StatusCode);

        var list = await owner.GetFromJsonAsync<List<DonationDto>>("/api/dashboard/donations", ApiFactory.Json);
        Assert.Equal(DonationStatus.Pending, list!.Single().Status); // 그대로다
    }
}
