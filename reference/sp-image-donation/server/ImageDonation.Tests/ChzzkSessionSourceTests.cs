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
        await source.ConnectAsync(7, $"http://127.0.0.1:{emulator.Port}?auth=test-auth-token", key =>
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
}
