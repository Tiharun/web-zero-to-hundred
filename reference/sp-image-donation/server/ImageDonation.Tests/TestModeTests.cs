using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ImageDonation.Tests;

public class TestModeTests
{
    [Fact]
    public async Task TestDonation_MatchesAwaitingCheese()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("cheese-streamer");
        await ApiFactory.UpdateSettingsAsync(streamer, s => s with { Mode = DonationMode.Cheese, MinCheese = 1000 });

        // 1) 시청자가 이미지를 보내면 코드가 발급되고 치즈를 기다린다
        var response = await app.CreateClient().PostAsync("/api/public/streamers/cheese-streamer/donations", ApiFactory.DonationForm(TestImages.Png()));
        var created = (await response.Content.ReadFromJsonAsync<CreateDonationResponse>(ApiFactory.Json))!;
        Assert.Equal(DonationStatus.AwaitingCheese, created.Status);
        Assert.Matches("^#[A-Z0-9]{4}$", created.Code);

        // 2) 금액이 모자란 가짜 후원은 매칭되지 않는다
        await PostTestDonation(streamer, 500, $"코드 {created.Code}");
        Assert.Empty(await ListAsync(streamer, "Pending"));

        // 3) 코드를 소문자로 넣은 가짜 치즈 후원(1000치즈) → 검수 대기로 바뀐다
        await PostTestDonation(streamer, 1000, $"이미지 부탁해요 {created.Code!.ToLowerInvariant()}");
        var pending = Assert.Single(await ListAsync(streamer, "Pending"));
        Assert.Equal(created.Id, pending.Id);
        Assert.Equal(1000, pending.CheeseAmount);
        Assert.Empty(await ListAsync(streamer, "AwaitingCheese"));
    }

    [Fact]
    public async Task CheeseEvents_StoreOnlyWhatMatchingNeeds()
    {
        await using var app = new ApiFactory();
        var free = await app.CreateStreamerClientAsync("free-events");
        var cheese = await app.CreateStreamerClientAsync("cheese-events");
        await ApiFactory.UpdateSettingsAsync(cheese, s => s with { Mode = DonationMode.Cheese });

        // 무료 모드: 이벤트를 아예 저장하지 않는다 / 치즈 모드: 코드가 없어도 금액·시각만 남긴다
        await PostTestDonation(free, 1000, "아무 메시지");
        await PostTestDonation(cheese, 1000, "코드 없는 메시지");

        using var scope = app.Services.CreateScope();
        var events = await scope.ServiceProvider.GetRequiredService<AppDbContext>().DonationEvents.AsNoTracking().ToListAsync();
        var only = Assert.Single(events);
        Assert.Equal((1000, "test", (int?)null), (only.PayAmount, only.Source, only.MatchedDonationId));
        // DonationEvent에는 후원자 닉네임·메시지 열 자체가 없다 (엔티티 정의 참고)
    }

    [Fact]
    public async Task TestDonation_RequiresLogin()
    {
        await using var app = new ApiFactory();

        var response = await app.CreateClient().PostAsJsonAsync("/api/dashboard/test-donation", new { amount = 1000, message = "#AB12" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private static async Task PostTestDonation(HttpClient streamer, int amount, string message)
    {
        var response = await streamer.PostAsJsonAsync("/api/dashboard/test-donation", new { amount, message, nickname = "테스트 후원자" });
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);
    }

    private static async Task<List<DonationDto>> ListAsync(HttpClient streamer, string status) =>
        (await streamer.GetFromJsonAsync<List<DonationDto>>($"/api/dashboard/donations?status={status}", ApiFactory.Json))!;
}
