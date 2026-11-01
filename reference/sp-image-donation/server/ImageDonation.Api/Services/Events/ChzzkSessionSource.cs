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
// 구독에 실패하거나, 권한이 회수되거나(SYSTEM revoked), 소켓이 끊기면 소켓을 정리하고 다음 점검 때 새 세션으로 다시 연결한다.
public sealed class ChzzkSessionSource(
    IServiceScopeFactory scopes,
    IOptions<ChzzkOptions> options,
    ILogger<ChzzkSessionSource> logger,
    TimeProvider time) : BackgroundService, IDonationEventSource
{
    private readonly ConcurrentDictionary<int, SocketIO> _sockets = new(); // 스트리머 ID → 연결된(또는 연결 중인) 소켓

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
            select new { StreamerId = s.Id, s.UserId }).ToListAsync(ct);

        foreach (var (streamerId, client) in _sockets.Where(p => targets.All(t => t.StreamerId != p.Key)).ToList())
        {
            await DisconnectAsync(streamerId, client);
        }

        foreach (var target in targets.Where(t => !IsConnected(t.StreamerId)))
        {
            try
            {
                var accessToken = await api.GetValidAccessTokenAsync(db, target.UserId, ct);
                var sessionUrl = await api.GetSessionUrlAsync(accessToken, ct);
                await ConnectAsync(target.StreamerId, sessionUrl, key => SubscribeAsync(target.UserId, key), ct);
                logger.LogInformation("스트리머 {StreamerId}의 치지직 세션에 연결했습니다.", target.StreamerId);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogWarning(ex, "스트리머 {StreamerId}의 치지직 세션 연결 실패", target.StreamerId);
            }
        }
    }

    // sessionKey로 후원 이벤트 구독 (소켓 처리기 안에서 불리므로 새 스코프를 만든다)
    private async Task SubscribeAsync(string userId, string sessionKey)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var api = scope.ServiceProvider.GetRequiredService<ChzzkApiClient>();
        var accessToken = await api.GetValidAccessTokenAsync(db, userId);
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

        // 처리기 안의 예외는 반드시 잡아서 기록한다 (잡지 않으면 조용히 사라져 원인을 알 수 없다)
        client.On("SYSTEM", async ctx =>
        {
            try
            {
                var message = ToObject(ctx.GetValue<JsonElement>(0));
                var type = ReadString(message, "type");
                logger.LogInformation("치지직 SYSTEM 메시지: {Type}", type);
                if (type == "connected")
                {
                    await onSessionKey(message.GetProperty("data").GetProperty("sessionKey").GetString()!);
                }
                else if (type == "revoked")
                {
                    // 동의 철회·스코프 변경 등으로 권한이 회수됐다 → 이 소켓으로는 더 받을 수 없다
                    logger.LogWarning("스트리머 {StreamerId}의 치지직 권한이 회수됐습니다.", streamerId);
                    await DisconnectAsync(streamerId, client);
                }
            }
            catch (Exception ex)
            {
                // 구독 실패 등: "연결은 됐지만 후원은 못 받는" 소켓을 남기지 않는다 → 끊고 다음 점검 때 다시 연결
                logger.LogWarning(ex, "스트리머 {StreamerId}의 치지직 세션 준비 실패. 연결을 끊습니다.", streamerId);
                await DisconnectAsync(streamerId, client);
            }
        });

        client.On("DONATION", async ctx =>
        {
            try
            {
                var donation = ParseDonation(streamerId, ctx.GetValue<JsonElement>(0), "chzzk", time.GetUtcNow());
                if (donation is null)
                {
                    logger.LogWarning("스트리머 {StreamerId}: 읽을 수 없는 DONATION 페이로드를 건너뜁니다.", streamerId);
                }
                else if (DonationReceived is { } handler)
                {
                    await handler(donation); // 구독자는 Program.cs에서 연결한 1개(DonationService)
                }
            }
            catch (Exception ex)
            {
                // DB 오류 등이 나도 소켓은 계속 다음 후원을 받는다
                logger.LogError(ex, "스트리머 {StreamerId}의 치지직 후원 처리 실패", streamerId);
            }
        });

        // 서버 쪽에서 끊었을 때: 목록에서 빼고 정리한다 (우리가 끊은 경우에는 이미 빠져 있다)
        client.OnDisconnected += (_, reason) =>
        {
            logger.LogInformation("스트리머 {StreamerId}의 치지직 세션이 끊겼습니다: {Reason}", streamerId, reason);
            if (_sockets.TryRemove(new KeyValuePair<int, SocketIO>(streamerId, client)))
            {
                client.Dispose();
            }
        };

        // 연결 전에 목록에 넣는다: SYSTEM 처리기가 연결 직후 실패해도 이 소켓을 찾아 끊을 수 있게
        _sockets[streamerId] = client;
        try
        {
            await client.ConnectAsync(ct);
        }
        catch
        {
            await DisconnectAsync(streamerId, client); // 연결에 실패한 소켓은 정리하고, 다음 점검 때 새 세션으로 다시 시도한다
            throw;
        }
    }

    public async Task DisconnectAllAsync()
    {
        foreach (var (streamerId, client) in _sockets.ToList())
        {
            await DisconnectAsync(streamerId, client);
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        await DisconnectAllAsync();
        await base.StopAsync(cancellationToken);
    }

    // 목록에서 이 소켓을 빼고 끊은 뒤 정리한다. 이미 빠져 있으면(다른 곳에서 정리함) 아무것도 하지 않는다
    private async Task DisconnectAsync(int streamerId, SocketIO client)
    {
        if (!_sockets.TryRemove(new KeyValuePair<int, SocketIO>(streamerId, client))) return;
        try
        {
            await client.DisconnectAsync();
        }
        catch (Exception ex)
        {
            logger.LogDebug(ex, "치지직 소켓을 끊는 중 오류 (무시)");
        }
        client.Dispose();
    }

    // "https://ssio08.nchat.naver.com:443?auth=TOKEN" → (https://ssio08.nchat.naver.com:443, "TOKEN")
    public static (Uri Origin, string Auth) SplitSessionUrl(string sessionUrl)
    {
        var uri = new Uri(sessionUrl);
        var auth = HttpUtility.ParseQueryString(uri.Query)["auth"] ?? "";
        return (new Uri(uri.GetLeftPart(UriPartial.Authority)), auth);
    }

    // DONATION 페이로드 → CheeseDonationEvent. 이벤트가 JSON 문자열이든 객체든, payAmount가 문자열이든 숫자든 받는다.
    // 읽을 수 없는 페이로드(깨진 JSON, 말이 안 되는 금액)는 null
    public static CheeseDonationEvent? ParseDonation(int streamerId, JsonElement payload, string source, DateTimeOffset receivedAt)
    {
        var d = ToObject(payload);
        if (d.ValueKind != JsonValueKind.Object) return null;

        var amount = d.TryGetProperty("payAmount", out var a) ? ToAmount(a) : 0m;
        if (amount is null or < 0 or > int.MaxValue) return null; // int로 바꿀 수 없는 금액

        return new CheeseDonationEvent(
            streamerId,
            source,
            ReadString(d, "donationType"),
            ReadString(d, "donatorNickname"),
            (int)amount.Value,
            ReadString(d, "donationText"),
            receivedAt);
    }

    // 문자열이면 JSON으로 풀고(깨졌으면 Undefined), 이미 객체면 그대로
    private static JsonElement ToObject(JsonElement e)
    {
        if (e.ValueKind != JsonValueKind.String) return e;
        try
        {
            using var document = JsonDocument.Parse(e.GetString()!);
            return document.RootElement.Clone();
        }
        catch (JsonException)
        {
            return default;
        }
    }

    private static decimal? ToAmount(JsonElement e) => e.ValueKind switch
    {
        JsonValueKind.Number when e.TryGetDecimal(out var n) => n,
        JsonValueKind.String when decimal.TryParse(e.GetString(), NumberStyles.Number, CultureInfo.InvariantCulture, out var v) => v,
        _ => null,
    };

    private static string ReadString(JsonElement e, string name) =>
        e.ValueKind == JsonValueKind.Object && e.TryGetProperty(name, out var v) && v.ValueKind == JsonValueKind.String ? v.GetString()! : "";
}
