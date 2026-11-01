using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;

namespace ImageDonation.Tests;

public class PublicDonationTests
{
    [Fact]
    public async Task PublicDonation_FreeMode_CreatesPending()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("free-streamer");
        var viewer = app.CreateClient(); // 로그인하지 않은 시청자

        var info = await viewer.GetFromJsonAsync<PublicStreamerDto>("/api/public/streamers/free-streamer", ApiFactory.Json);
        Assert.Equal(DonationMode.Free, info!.Mode);

        var response = await viewer.PostAsync("/api/public/streamers/free-streamer/donations",
            ApiFactory.DonationForm(TestImages.Png(), nickname: "<b>시청자</b>", message: "첫 후원!"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<CreateDonationResponse>(ApiFactory.Json);
        Assert.Equal(DonationStatus.Pending, created!.Status);
        Assert.Null(created.Code); // 무료 모드에는 코드가 없다

        // 대시보드 대기열에 나타나고, 이미지는 /media/{GUID}.webp 로 제공된다
        var queue = await streamer.GetFromJsonAsync<List<DonationDto>>("/api/dashboard/donations?status=Pending", ApiFactory.Json);
        var item = Assert.Single(queue!);
        Assert.Equal(created.Id, item.Id);
        Assert.Equal("<b>시청자</b>", item.Nickname); // 그대로 저장하고, 화면(React)이 글자로 출력한다
        Assert.Matches("^/media/[0-9a-f]{32}\\.webp$", item.ImageUrl);

        var media = await viewer.GetAsync(item.ImageUrl);
        Assert.Equal(HttpStatusCode.OK, media.StatusCode);
        Assert.Equal("image/webp", media.Content.Headers.ContentType?.MediaType);
        Assert.Equal("nosniff", media.Headers.GetValues("X-Content-Type-Options").Single());
    }

    [Fact]
    public async Task PublicDonation_RejectsNonImageAndBannedWords()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("strict");
        await ApiFactory.UpdateSettingsAsync(streamer, s => s with { BannedWords = ["금지"] });
        var viewer = app.CreateClient();

        var notImage = await viewer.PostAsync("/api/public/streamers/strict/donations",
            ApiFactory.DonationForm("hello, I am text"u8.ToArray(), fileName: "photo.jpg"));
        var banned = await viewer.PostAsync("/api/public/streamers/strict/donations",
            ApiFactory.DonationForm(TestImages.Png(), message: "이건 금지어"));
        var tooLongNickname = await viewer.PostAsync("/api/public/streamers/strict/donations",
            ApiFactory.DonationForm(TestImages.Png(), nickname: new string('가', 21)));
        var unknown = await viewer.GetAsync("/api/public/streamers/nobody");

        Assert.Equal(HttpStatusCode.BadRequest, notImage.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, banned.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, tooLongNickname.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, unknown.StatusCode);
    }

    [Fact]
    public async Task Upload_TooLarge_413()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("small-limit");
        await ApiFactory.UpdateSettingsAsync(streamer, s => s with { MaxFileMb = 1 });

        // 1.5MB: PNG 머리글 + 아무 바이트 (크기 검사는 이미지 처리보다 먼저 한다)
        var big = new byte[1_500_000];
        TestImages.Png().AsSpan(0, 8).CopyTo(big);

        var response = await app.CreateClient().PostAsync("/api/public/streamers/small-limit/donations", ApiFactory.DonationForm(big));

        Assert.Equal(HttpStatusCode.RequestEntityTooLarge, response.StatusCode);
    }

    [Fact]
    public async Task RateLimit_429()
    {
        await using var app = new ApiFactory(donationsPerMinute: 2);
        await app.CreateStreamerClientAsync("busy");
        var viewer = app.CreateClient();

        var codes = new List<HttpStatusCode>();
        for (var i = 0; i < 3; i++)
        {
            var response = await viewer.PostAsync("/api/public/streamers/busy/donations", ApiFactory.DonationForm(TestImages.Png()));
            codes.Add(response.StatusCode);
        }

        Assert.Equal([HttpStatusCode.Created, HttpStatusCode.Created, HttpStatusCode.TooManyRequests], codes);
    }
}
