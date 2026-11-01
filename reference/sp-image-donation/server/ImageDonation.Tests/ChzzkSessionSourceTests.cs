using System.Text.Json;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Events;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace ImageDonation.Tests;

public class ChzzkSessionSourceTests
{
    private static ChzzkSessionSource CreateSource() => new(
        new ServiceCollection().BuildServiceProvider().GetRequiredService<IServiceScopeFactory>(),
        Options.Create(new ChzzkOptions()),
        NullLogger<ChzzkSessionSource>.Instance,
        TimeProvider.System);

    private static string Url(ChzzkEmulator emulator) => $"http://127.0.0.1:{emulator.Port}?auth=test-auth-token";

    private static Task Subscribed(string _) => Task.CompletedTask; // 실제 서비스는 이 자리에서 후원 구독 API를 부른다

    // 조건이 참이 될 때까지 기다린다 (최대 10초)
    private static async Task WaitUntilAsync(Func<bool> condition)
    {
        for (var i = 0; i < 100 && !condition(); i++) await Task.Delay(100);
        Assert.True(condition(), "10초 안에 조건이 참이 되지 않았어요.");
    }

    [Fact]
    public void ParseDonation_AcceptsStringOrObjectPayload()
    {
        // 치지직이 JSON 문자열로 보낼 때와 객체로 보낼 때, payAmount가 문자열·숫자일 때 모두 받는다
        var asString = JsonSerializer.SerializeToElement(
            """{"donationType":"CHAT","donatorNickname":"가","payAmount":"1000","donationText":"#AB12"}""");
        var asObject = JsonSerializer.SerializeToElement(
            new { donationType = "CHAT", donatorNickname = "나", payAmount = 2500, donationText = "hi" });

        var a = ChzzkSessionSource.ParseDonation(3, asString, "chzzk", DateTimeOffset.UtcNow);
        var b = ChzzkSessionSource.ParseDonation(3, asObject, "chzzk", DateTimeOffset.UtcNow);

        Assert.Equal((3, "가", 1000, "#AB12"), (a!.StreamerId, a.DonatorNickname, a.PayAmount, a.DonationText));
        Assert.Equal(("나", 2500), (b!.DonatorNickname, b.PayAmount));
    }

    [Fact]
    public void ParseDonation_ReturnsNullForBrokenPayloads()
    {
        Assert.Null(ChzzkSessionSource.ParseDonation(1, JsonSerializer.SerializeToElement("{깨진 JSON"), "chzzk", DateTimeOffset.UtcNow));
        Assert.Null(ChzzkSessionSource.ParseDonation(1, JsonSerializer.SerializeToElement(new { payAmount = "99999999999" }), "chzzk", DateTimeOffset.UtcNow));
        Assert.Null(ChzzkSessionSource.ParseDonation(1, JsonSerializer.SerializeToElement(new { payAmount = -5 }), "chzzk", DateTimeOffset.UtcNow));
    }

    [Fact]
    public void SplitSessionUrl_MovesAuthToQueryOption()
    {
        // URL에 붙은 ?auth= 는 SocketIOClient가 서버로 전달하지 않으므로 따로 떼어 낸다
        var (origin, auth) = ChzzkSessionSource.SplitSessionUrl("https://ssio08.nchat.naver.com:443?auth=TOKEN");

        Assert.Equal(new Uri("https://ssio08.nchat.naver.com:443"), origin);
        Assert.Equal("TOKEN", auth);
    }

    [Fact]
    public async Task ChzzkSessionSource_ReceivesDonations_FromSocketIo2Emulator()
    {
        // 로컬 Socket.IO 2.5.0(EIO=3) 에뮬레이터: 실제 치지직 서버가 아니다
        await using var emulator = await ChzzkEmulator.StartAsync();
        var source = CreateSource();

        var received = new List<CheeseDonationEvent>();
        var gotTwo = new TaskCompletionSource();
        source.DonationReceived += evt =>
        {
            lock (received)
            {
                received.Add(evt);
                if (received.Count == 2) gotTwo.TrySetResult();
            }
            return Task.CompletedTask;
        };

        string? sessionKey = null;
        await source.ConnectAsync(7, Url(emulator), key =>
        {
            sessionKey = key; // 실제 서비스는 이 키로 후원 이벤트 구독 API를 부른다
            return Task.CompletedTask;
        });
        await gotTwo.Task.WaitAsync(TimeSpan.FromSeconds(15));

        Assert.Equal("sess-123", sessionKey);
        Assert.Contains("CONNECTED auth=test-auth-token EIO=3", emulator.Output);
        Assert.Equal([1000, 2500], received.Select(e => e.PayAmount).Order());
        Assert.All(received, e =>
        {
            Assert.Equal(7, e.StreamerId);
            Assert.Equal("chzzk", e.Source);
            Assert.Equal("테스터", e.DonatorNickname);
            Assert.Equal("안녕 #TEST", e.DonationText);
        });
        Assert.True(source.IsConnected(7));

        await source.DisconnectAllAsync();
        Assert.False(source.IsConnected(7));
    }

    [Fact]
    public async Task SubscribeFailure_DisconnectsSoNextCheckRetries()
    {
        await using var emulator = await ChzzkEmulator.StartAsync();
        var source = CreateSource();

        // 구독 API가 실패하면(예: 403 Scope 없음) "연결만 된" 소켓을 남기지 않는다
        await source.ConnectAsync(7, Url(emulator), _ => throw new ChzzkApiException(403, "FORBIDDEN"));

        await WaitUntilAsync(() => !source.IsConnected(7));
        await WaitUntilAsync(() => emulator.Output.Contains("DISCONNECTED"));
    }

    [Fact]
    public async Task Revoked_Disconnects()
    {
        await using var emulator = await ChzzkEmulator.StartAsync("revoked");
        var source = CreateSource();

        await source.ConnectAsync(7, Url(emulator), Subscribed);

        await WaitUntilAsync(() => !source.IsConnected(7)); // SYSTEM(revoked)를 받으면 끊고 정리한다
        await WaitUntilAsync(() => emulator.Output.Contains("DISCONNECTED"));
    }

    [Fact]
    public async Task ServerDisconnect_RemovesSocket()
    {
        await using var emulator = await ChzzkEmulator.StartAsync("kick");
        var source = CreateSource();

        await source.ConnectAsync(7, Url(emulator), Subscribed);

        await WaitUntilAsync(() => !source.IsConnected(7)); // 서버가 끊으면 목록에서 빠져서 다음 점검 때 다시 연결된다
    }

    [Fact]
    public async Task MalformedDonations_AreSkipped_SocketKeepsWorking()
    {
        await using var emulator = await ChzzkEmulator.StartAsync("malformed");
        var source = CreateSource();
        var received = new TaskCompletionSource<CheeseDonationEvent>();
        var count = 0;
        source.DonationReceived += evt =>
        {
            Interlocked.Increment(ref count);
            received.TrySetResult(evt);
            return Task.CompletedTask;
        };

        await source.ConnectAsync(7, Url(emulator), Subscribed);

        // 깨진 JSON과 int 범위를 넘는 금액은 건너뛰고, 그다음 정상 후원은 받는다
        var evt = await received.Task.WaitAsync(TimeSpan.FromSeconds(10));
        Assert.Equal(3000, evt.PayAmount);
        await Task.Delay(300);
        Assert.Equal(1, count);
        Assert.True(source.IsConnected(7));
        await source.DisconnectAllAsync();
    }

    [Fact]
    public async Task HandlerException_IsCaught_SocketKeepsWorking()
    {
        await using var emulator = await ChzzkEmulator.StartAsync();
        var source = CreateSource();
        var calls = 0;
        var second = new TaskCompletionSource();
        source.DonationReceived += _ =>
        {
            // 첫 번째 후원 처리에서 DB 오류가 났다고 치자
            if (Interlocked.Increment(ref calls) == 1) throw new InvalidOperationException("DB 오류 흉내");
            second.TrySetResult();
            return Task.CompletedTask;
        };

        await source.ConnectAsync(7, Url(emulator), Subscribed);

        await second.Task.WaitAsync(TimeSpan.FromSeconds(10)); // 예외가 나도 다음 후원을 계속 받는다
        Assert.True(source.IsConnected(7));
        await source.DisconnectAllAsync();
    }
}
