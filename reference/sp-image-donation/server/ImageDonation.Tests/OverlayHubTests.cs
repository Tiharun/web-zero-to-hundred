using System.Net;
using System.Net.Http.Json;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services.Storage;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

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
        await ApiFactory.StartOverlayAsync(overlayA);
        await ApiFactory.StartOverlayAsync(overlayB);

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

    private static async Task<DonationDto> FindAsync(HttpClient streamer, int id) =>
        (await streamer.GetFromJsonAsync<List<DonationDto>>("/api/dashboard/donations", ApiFactory.Json))!.Single(d => d.Id == id);

    [Fact]
    public async Task Overlay_ConnectingLater_ReceivesApprovedBacklog()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("late-obs");

        // OBS를 켜기 전에 승인했다 (이때는 받을 오버레이가 없다)
        var id = await DonateAsync(app, "late-obs");
        (await streamer.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();

        // 나중에 오버레이가 연결되면 아직 보여 주지 못한 승인 후원을 받는다
        await using var overlay = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamer));
        var shown = new TaskCompletionSource<OverlayDonationDto>();
        overlay.On<OverlayDonationDto>("ShowDonation", d => shown.TrySetResult(d));
        await ApiFactory.StartOverlayAsync(overlay);

        Assert.Equal(id, (await shown.Task.WaitAsync(TimeSpan.FromSeconds(10))).Id);
    }

    [Fact]
    public async Task EmergencyStop_MarksCleared_AndIsNotResentOnReconnect()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("panic");
        var token = await ApiFactory.GetOverlayTokenAsync(streamer);

        var id = await DonateAsync(app, "panic");
        (await streamer.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();
        var imageUrl = (await FindAsync(streamer, id)).ImageUrl!;

        // 긴급 정지: 승인 후원이 Cleared가 되고 이미지도 지워진다
        Assert.Equal(HttpStatusCode.NoContent, (await streamer.PostAsync("/api/dashboard/overlay/clear", null)).StatusCode);
        var cleared = await FindAsync(streamer, id);
        Assert.Equal(DonationStatus.Cleared, cleared.Status);
        Assert.Null(cleared.ImageUrl);
        Assert.Equal(HttpStatusCode.NotFound, (await app.CreateClient().GetAsync(imageUrl)).StatusCode);

        // 오버레이를 다시 연결해도 내린 후원은 오지 않는다. 확인용으로 새 후원을 승인하면 그것이 "처음" 받는 후원이어야 한다
        await using var overlay = app.CreateOverlayConnection(token);
        var first = new TaskCompletionSource<int>();
        overlay.On<OverlayDonationDto>("ShowDonation", d => first.TrySetResult(d.Id));
        await ApiFactory.StartOverlayAsync(overlay);
        var next = await DonateAsync(app, "panic");
        (await streamer.PostAsync($"/api/dashboard/donations/{next}/approve", null)).EnsureSuccessStatusCode();

        Assert.Equal(next, await first.Task.WaitAsync(TimeSpan.FromSeconds(10)));
        // 내린 뒤에는 다 보여 줬다는 신호(MarkShown)가 와도 Shown으로 되살아나지 않는다
        await overlay.InvokeAsync("MarkShown", id);
        Assert.Equal(DonationStatus.Cleared, (await FindAsync(streamer, id)).Status);
    }

    [Fact]
    public async Task EmergencyStop_ClearsOverlayFirst_EvenIfFileDeleteFails()
    {
        await using var app = new ApiFactory(replaceServices: services => services.AddSingleton<IImageStorage>(sp =>
            new FailingDeleteStorage(ActivatorUtilities.CreateInstance<LocalImageStorage>(sp))));
        var streamer = await app.CreateStreamerClientAsync("locked-files");
        await using var overlay = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamer));
        var cleared = new TaskCompletionSource();
        overlay.On("Clear", () => cleared.TrySetResult());
        await ApiFactory.StartOverlayAsync(overlay);

        var first = await DonateAsync(app, "locked-files");
        var second = await DonateAsync(app, "locked-files");
        (await streamer.PostAsync($"/api/dashboard/donations/{first}/approve", null)).EnsureSuccessStatusCode();
        (await streamer.PostAsync($"/api/dashboard/donations/{second}/approve", null)).EnsureSuccessStatusCode();
        var imageUrl = (await FindAsync(streamer, first)).ImageUrl!;

        // 파일 지우기가 매번 실패해도: 화면은 반드시 비워지고, 두 후원 모두 Cleared가 된다
        Assert.Equal(HttpStatusCode.NoContent, (await streamer.PostAsync("/api/dashboard/overlay/clear", null)).StatusCode);
        await cleared.Task.WaitAsync(TimeSpan.FromSeconds(10));
        Assert.Equal(DonationStatus.Cleared, (await FindAsync(streamer, first)).Status);
        Assert.Equal(DonationStatus.Cleared, (await FindAsync(streamer, second)).Status);
        Assert.Equal(HttpStatusCode.NotFound, (await app.CreateClient().GetAsync(imageUrl)).StatusCode); // 파일은 남았지만 내보내지 않는다
    }

    [Fact]
    public async Task OverlayClear_OnlyReachesThatStreamersOverlay()
    {
        await using var app = new ApiFactory();
        var streamerA = await app.CreateStreamerClientAsync("clear-a");
        var streamerB = await app.CreateStreamerClientAsync("clear-b");
        await using var overlayA = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamerA));
        await using var overlayB = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamerB));
        var clearedA = new TaskCompletionSource();
        var clearsOnB = 0;
        var shownOnB = new TaskCompletionSource<int>();
        overlayA.On("Clear", () => clearedA.TrySetResult());
        overlayB.On("Clear", () => Interlocked.Increment(ref clearsOnB));
        overlayB.On<OverlayDonationDto>("ShowDonation", d => shownOnB.TrySetResult(d.Id));
        await ApiFactory.StartOverlayAsync(overlayA);
        await ApiFactory.StartOverlayAsync(overlayB);

        (await streamerA.PostAsync("/api/dashboard/overlay/clear", null)).EnsureSuccessStatusCode();
        await clearedA.Task.WaitAsync(TimeSpan.FromSeconds(10));

        // B에게 메시지를 하나 더 보내서, 그 전에 Clear가 오지 않았음을 확인한다 (한 연결의 메시지는 순서대로 온다)
        var id = await DonateAsync(app, "clear-b");
        (await streamerB.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();
        Assert.Equal(id, await shownOnB.Task.WaitAsync(TimeSpan.FromSeconds(10)));
        Assert.Equal(0, clearsOnB);
    }

    [Fact]
    public async Task RotateToken_OldConnectionIsAbortedOnMarkShown()
    {
        await using var app = new ApiFactory();
        var streamer = await app.CreateStreamerClientAsync("leaked");
        await using var oldOverlay = app.CreateOverlayConnection(await ApiFactory.GetOverlayTokenAsync(streamer));
        var shown = new TaskCompletionSource<int>();
        var closed = new TaskCompletionSource();
        oldOverlay.On<OverlayDonationDto>("ShowDonation", d => shown.TrySetResult(d.Id));
        oldOverlay.Closed += _ =>
        {
            closed.TrySetResult();
            return Task.CompletedTask;
        };
        await ApiFactory.StartOverlayAsync(oldOverlay);

        var id = await DonateAsync(app, "leaked");
        (await streamer.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();
        Assert.Equal(id, await shown.Task.WaitAsync(TimeSpan.FromSeconds(10)));

        // 주소가 새어 나가 재발급했다. 옛 주소로 열려 있던 연결이 서버를 부르면 그 자리에서 끊긴다
        (await streamer.PostAsync("/api/dashboard/overlay-token/rotate", null)).EnsureSuccessStatusCode();
        await Assert.ThrowsAnyAsync<Exception>(() => oldOverlay.InvokeAsync("MarkShown", id));
        await closed.Task.WaitAsync(TimeSpan.FromSeconds(10));
        Assert.Equal(DonationStatus.Approved, (await FindAsync(streamer, id)).Status); // 옛 연결의 신호는 반영되지 않는다
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
        await ApiFactory.StartOverlayAsync(oldOverlay);

        var rotate = await streamer.PostAsync("/api/dashboard/overlay-token/rotate", null);
        var newToken = (await rotate.Content.ReadFromJsonAsync<OverlayTokenResponse>(ApiFactory.Json))!.OverlayToken;
        Assert.NotEqual(oldToken, newToken);
        Assert.True(newToken.Length >= 22); // 128비트 이상

        await using var newOverlay = app.CreateOverlayConnection(newToken);
        var shownOnNew = new TaskCompletionSource<int>();
        newOverlay.On<OverlayDonationDto>("ShowDonation", d => shownOnNew.TrySetResult(d.Id));
        await ApiFactory.StartOverlayAsync(newOverlay);

        var id = await DonateAsync(app, "rotator");
        (await streamer.PostAsync($"/api/dashboard/donations/{id}/approve", null)).EnsureSuccessStatusCode();

        Assert.Equal(id, await shownOnNew.Task.WaitAsync(TimeSpan.FromSeconds(10)));
        Assert.Empty(received); // 옛 주소(유출된 주소)로 열린 오버레이는 더 이상 받지 못한다
        await using var again = app.CreateOverlayConnection(oldToken);
        await Assert.ThrowsAnyAsync<Exception>(() => again.StartAsync());
    }
}
