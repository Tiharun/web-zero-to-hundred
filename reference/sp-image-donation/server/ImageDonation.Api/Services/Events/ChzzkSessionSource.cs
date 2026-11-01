using System.Collections.Concurrent;
using System.Collections.Specialized;
using System.Globalization;
using System.Text.Json;
using System.Web;
using ImageDonation.Api.Data;
using ImageDonation.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SocketIOClient;
using SocketIOClient.Common; // EngineIO, TransportProtocol (SocketIOClient.Transport라는 네임스페이스는 없다)

namespace ImageDonation.Api.Services.Events;

// 진짜 치지직 후원 수신기: 치즈 모드 + 치지직 연결된 스트리머마다 세션 소켓(Socket.IO 2.x, EIO=3)을 하나씩 연다.
// 흐름: 세션 URL 받기(1회용) → 소켓 연결 → SYSTEM(connected)의 sessionKey로 후원 구독 → DONATION 수신
// 소켓이 끊기면 다음 점검 때 새 세션 URL로 다시 연결한다.
public sealed class ChzzkSessionSource(
    IServiceScopeFactory scopes,
    IOptions<ChzzkOptions> options,
    ILogger<ChzzkSessionSource> logger,
    TimeProvider time) : BackgroundService, IDonationEventSource
{
    private readonly ConcurrentDictionary<int, SocketIO> _sockets = new(); // 스트리머 ID → 연결된 소켓

    public event Func<CheeseDonationEvent, Task>? DonationReceived;

    public bool IsConnected(int streamerId) => _sockets.ContainsKey(streamerId);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!options.Value.IsConfigured)
        {
            logger.LogInformation("치지직 ClientId/ClientSecret이 없어 세션 수신기를 끕니다. 테스트 모드는 그대로 쓸 수 있어요.");
            return;
        }

        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(options.Value.SessionCheckSeconds), time);
        do
        {
            try
            {
                await SyncConnectionsAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "치지직 세션 점검 실패. 다음 점검 때 다시 시도합니다.");
            }
        }
        while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    // 연결이 필요한 스트리머는 연결하고, 더는 필요 없는(무료 모드로 바꾼) 스트리머는 끊는다
    private async Task SyncConnectionsAsync(CancellationToken ct)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var api = scope.ServiceProvider.GetRequiredService<ChzzkApiClient>();

        var targets = await (
            from s in db.Streamers
            join t in db.ChzzkTokens on s.UserId equals t.UserId
            where s.Settings.Mode == DonationMode.Cheese
            select new { StreamerId = s.Id, Token = t }).ToListAsync(ct);

        foreach (var streamerId in _sockets.Keys.Except(targets.Select(t => t.StreamerId)))
        {
            await DisconnectAsync(streamerId);
        }

        foreach (var target in targets.Where(t => !IsConnected(t.StreamerId)))
        {
            try
            {
                var accessToken = await api.GetValidAccessTokenAsync(target.Token, ct);
                await db.SaveChangesAsync(ct); // 갱신됐다면 새 토큰 쌍을 저장
                var sessionUrl = await api.GetSessionUrlAsync(accessToken, ct);
                await ConnectAsync(target.StreamerId, sessionUrl, key => SubscribeAsync(target.StreamerId, key), ct);
                logger.LogInformation("스트리머 {StreamerId}의 치지직 세션에 연결했습니다.", target.StreamerId);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "스트리머 {StreamerId}의 치지직 세션 연결 실패", target.StreamerId);
            }
        }
    }

    // sessionKey로 후원 이벤트 구독 (소켓 처리기 안에서 불리므로 새 스코프를 만든다)
    private async Task SubscribeAsync(int streamerId, string sessionKey)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var api = scope.ServiceProvider.GetRequiredService<ChzzkApiClient>();
        var token = await (
            from s in db.Streamers
            join t in db.ChzzkTokens on s.UserId equals t.UserId
            where s.Id == streamerId
            select t).SingleAsync();

        var accessToken = await api.GetValidAccessTokenAsync(token);
        await db.SaveChangesAsync();
        await api.SubscribeDonationAsync(accessToken, sessionKey);
    }

    // 세션 URL 하나로 소켓을 연다 (조사 문서 부록 C.1). 테스트는 로컬 에뮬레이터 주소로 이 메서드를 직접 부른다
    public async Task ConnectAsync(int streamerId, string sessionUrl, Func<string, Task> onSessionKey, CancellationToken ct = default)
    {
        // 함정: Uri에 ?auth=를 붙여 두면 서버로 전달되지 않는다 → origin과 auth를 나눠 Query 옵션으로 보낸다
        var (origin, auth) = SplitSessionUrl(sessionUrl);
        var client = new SocketIO(origin, new SocketIOOptions
        {
            EIO = EngineIO.V3,                      // 치지직은 Socket.IO 2.x(EIO=3)만 지원
            Transport = TransportProtocol.WebSocket,
            Reconnection = false,                   // 세션 URL이 1회용이라 같은 주소로 재연결하지 않는다
            ConnectionTimeout = TimeSpan.FromSeconds(3),
            Query = new NameValueCollection { ["auth"] = auth }, // EIO=3에서는 Auth 옵션이 동작하지 않는다
        });

        client.On("SYSTEM", async ctx =>
        {
            var message = ToObject(ctx.GetValue<JsonElement>(0));
            var type = message.GetProperty("type").GetString();
            logger.LogInformation("치지직 SYSTEM 메시지: {Type}", type);
            if (type == "connected")
            {
                await onSessionKey(message.GetProperty("data").GetProperty("sessionKey").GetString()!);
            }
        });

        client.On("DONATION", async ctx =>
        {
            var donation = ParseDonation(streamerId, ctx.GetValue<JsonElement>(0), "chzzk", time.GetUtcNow());
            if (donation is not null && DonationReceived is { } handler)
            {
                await handler(donation); // 구독자는 Program.cs에서 연결한 1개(DonationService)
            }
        });

        client.OnDisconnected += (_, reason) =>
        {
            logger.LogInformation("스트리머 {StreamerId}의 치지직 세션이 끊겼습니다: {Reason}", streamerId, reason);
            _sockets.TryRemove(streamerId, out var _);
        };

        try
        {
            await client.ConnectAsync(ct);
        }
        catch
        {
            client.Dispose(); // 연결에 실패한 소켓은 정리하고, 다음 점검 때 새 세션으로 다시 시도한다
            throw;
        }
        _sockets[streamerId] = client;
    }

    public async Task DisconnectAllAsync()
    {
        foreach (var streamerId in _sockets.Keys)
        {
            await DisconnectAsync(streamerId);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await DisconnectAllAsync();
        await base.StopAsync(cancellationToken);
    }

    private async Task DisconnectAsync(int streamerId)
    {
        if (_sockets.TryRemove(streamerId, out var client))
        {
            await client.DisconnectAsync();
            client.Dispose();
        }
    }

    // "https://ssio08.nchat.naver.com:443?auth=TOKEN" → (https://ssio08.nchat.naver.com:443, "TOKEN")
    public static (Uri Origin, string Auth) SplitSessionUrl(string sessionUrl)
    {
        var uri = new Uri(sessionUrl);
        var auth = HttpUtility.ParseQueryString(uri.Query)["auth"] ?? "";
        return (new Uri(uri.GetLeftPart(UriPartial.Authority)), auth);
    }

    // DONATION 페이로드 → CheeseDonationEvent. 이벤트가 JSON 문자열이든 객체든, payAmount가 문자열이든 숫자든 받는다
    public static CheeseDonationEvent? ParseDonation(int streamerId, JsonElement payload, string source, DateTimeOffset receivedAt)
    {
        var d = ToObject(payload);
        if (d.ValueKind != JsonValueKind.Object) return null;

        return new CheeseDonationEvent(
            streamerId,
            source,
            ReadString(d, "donationType"),
            ReadString(d, "donatorNickname"),
            d.TryGetProperty("payAmount", out var amount) ? (int)ToAmount(amount) : 0,
            ReadString(d, "donationText"),
            receivedAt);
    }

    private static JsonElement ToObject(JsonElement e) =>
        e.ValueKind == JsonValueKind.String ? JsonDocument.Parse(e.GetString()!).RootElement.Clone() : e;

    private static decimal ToAmount(JsonElement e) => e.ValueKind switch
    {
        JsonValueKind.Number => e.GetDecimal(),
        JsonValueKind.String when decimal.TryParse(e.GetString(), NumberStyles.Number, CultureInfo.InvariantCulture, out var v) => v,
        _ => 0m,
    };

    private static string ReadString(JsonElement e, string name) =>
        e.TryGetProperty(name, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString()! : "";
}
