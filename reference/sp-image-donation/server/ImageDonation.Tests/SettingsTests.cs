using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Dtos;

namespace ImageDonation.Tests;

public class SettingsTests
{
    [Fact]
    public async Task Settings_OutOfRange_400()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("ranger");
        var current = (await streamer.GetFromJsonAsync<SettingsDto>("/api/dashboard/settings", ApiFactory.Json))!;

        // [Range]를 벗어나면 AddValidation()이 400을 돌려준다 (public record라서 검사가 켜진다)
        var tooLong = await streamer.PutAsJsonAsync("/api/dashboard/settings", current with { DisplaySeconds = 31 }, ApiFactory.Json);
        var tooBig = await streamer.PutAsJsonAsync("/api/dashboard/settings", current with { MaxFileMb = 11 }, ApiFactory.Json);
        var longWord = await streamer.PutAsJsonAsync("/api/dashboard/settings", current with { BannedWords = [new string('가', 31)] }, ApiFactory.Json);

        Assert.Equal(HttpStatusCode.BadRequest, tooLong.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, tooBig.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, longWord.StatusCode);
        var after = (await streamer.GetFromJsonAsync<SettingsDto>("/api/dashboard/settings", ApiFactory.Json))!;
        Assert.Equal((current.DisplaySeconds, current.MaxFileMb), (after.DisplaySeconds, after.MaxFileMb)); // 바뀌지 않았다
        Assert.Empty(after.BannedWords);
    }

    [Fact]
    public async Task Settings_NullBannedWord_400()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("nuller");

        var body = new
        {
            mode = "Free", minCheese = 1000, autoApprove = false, displaySeconds = 8,
            minIntervalSeconds = 2, maxFileMb = 5, bannedWords = new[] { "a", null },
        };
        var response = await streamer.PutAsJsonAsync("/api/dashboard/settings", body);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode); // 서버 오류(500)가 아니라 400
    }
}
