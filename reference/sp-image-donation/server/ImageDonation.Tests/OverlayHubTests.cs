using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using Microsoft.AspNetCore.SignalR.Client;

namespace ImageDonation.Tests;

public class OverlayHubTests
{
    private static async Task<int> DonateAsync(ApiFactory app, string slug)
    {
        var response = await app.CreateClient().PostAsync($"/api/public/streamers/{slug}/donations", ApiFactory.DonationForm(TestImages.Png()));
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CreateDonationResponse>(ApiFactory.Json))!.Id;
    }

    [Fact]
    public async Task Approve_SendsShowDonation_ToOverlayGroup()
    {
        await using var app = new ApiFactory();
        var streamerA = await app.CreateStreamerClientAsync("streamer-a");
        var streamerB = await app.CreateStreamerClientAsync("streamer-b");

        await using var overlayA = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamerA));
        await using var overlayB = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamerB));
        var shownOnA = new TaskCompletionSource<OverlayDonationDto>();
        var shownOnB = new List<OverlayDonationDto>();
        overlayA.On<OverlayDonationDto>("ShowDonation", d => shownOnA.TrySetResult(d));
        overlayB.On<OverlayDonationDto>("ShowDonation", d => shownOnB.Add(d));
        await overlayA.StartAsync();
        await overlayB.StartAsync();

        var id = await DonateAsync(app, "streamer-a");
        var approve = await streamerA.PostAsync($"/api/dashboard/donations/{id}/approve", null);
        Assert.Equal(HttpStatusCode.OK, approve.StatusCode);

        var shown = await shownOnA.Task.WaitAsync(TimeSpan.FromSeconds(10));
        Assert.Equal(id, shown.Id);
        Assert.StartsWith("/media/", shown.ImageUrl);
        Assert.Equal(8, shown.DisplaySeconds); // 기본 설정값
        Assert.Empty(shownOnB); // 다른 스트리머의 오버레이에는 가지 않는다

        // 두 번 승인할 수는 없다 (Pending일 때만 Approved로 바뀐다)
        Assert.Equal(HttpStatusCode.Conflict, (await streamerA.PostAsync($"/api/dashboard/donations/{id}/approve", null)).StatusCode);

        // 오버레이가 다 보여 주면 Shown으로 바뀐다
        await overlayA.InvokeAsync("MarkShown", id);
        var all = await streamerA.GetFromJsonAsync<List<DonationDto>>("/api/dashboard/donations", ApiFactory.Json);
        Assert.Equal(DonationStatus.Shown, Assert.Single(all!).Status);
    }

    [Fact]
    public async Task OverlayHub_RejectsBadToken()
    {
        await using var app = new ApiFactory();
        await app.CreateStreamerClientAsync("guarded");

        await using var overlay = app.CreateOverlayConnection("not-a-real-token");

        var error = await Assert.ThrowsAnyAsync<Exception>(() => overlay.StartAsync());
        Assert.Contains("401", error.Message);
        Assert.Equal(HubConnectionState.Disconnected, overlay.State);
    }

    [Fact]
    public async Task RotateToken_OldOverlayStopsReceiving()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("rotator");
        var oldToken = await ApiFactory.GetOverlayTokenAsync(streamer);

        await using var oldOverlay = app.CreateOverlayConnection(oldToken);
        var received = new List<int>();
        oldOverlay.On<OverlayDonationDto>("ShowDonation", d => received.Add(d.Id));
        await oldOverlay.StartAsync();

        var rotate = await streamer.PostAsync("/api/dashboard/overlay-token/rotate", null);
        var newToken = (await rotate.Content.ReadFromJsonAsync<OverlayTokenResponse>(ApiFactory.Json))!.OverlayToken;
        Assert.NotEqual(oldToken, newToken);
        Assert.True(newToken.Length >= 22); // 128비트 이상

        await using var newOverlay = app.CreateOverlayConnection(newToken);
        var shownOnNew = new TaskCompletionSource<int>();
        newOverlay.On<OverlayDonationDto>("ShowDonation", d => shownOnNew.TrySetResult(d.Id));
        await newOverlay.StartAsync();

        var id = await DonateAsync(app, "rotator");
        (await streamer.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();

        Assert.Equal(id, await shownOnNew.Task.WaitAsync(TimeSpan.FromSeconds(10)));
        Assert.Empty(received); // 옛 주소(유출된 주소)로 열린 오버레이는 더 이상 받지 못한다
        await using var again = app.CreateOverlayConnection(oldToken);
        await Assert.ThrowsAnyAsync<Exception>(() => again.StartAsync());
    }
}
