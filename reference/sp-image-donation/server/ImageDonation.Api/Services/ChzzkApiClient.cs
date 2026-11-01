using System.Globalization;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using ImageDonation.Api.Data;
using ImageDonation.Api.Entities;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ImageDonation.Api.Services;

// 치지직 앱 설정. ClientId·ClientSecret은 user-secrets나 환경 변수(Chzzk__ClientSecret)에만 둔다
public sealed class ChzzkOptions
{
    public string ClientId { get; set; } = "";
    public string ClientSecret { get; set; } = "";
    public string RedirectUri { get; set; } = "";   // 개발자 센터에 등록한 "로그인 리디렉션 URL"과 같아야 한다
    public string ApiBaseUrl { get; set; } = "https://openapi.chzzk.naver.com";
    public string AuthorizeUrl { get; set; } = "https://chzzk.naver.com/account-interlock"; // Open API와 다른 도메인
    public int SessionCheckSeconds { get; set; } = 60;  // 세션 소켓 연결 상태를 점검하는 간격
    public bool ChatOnMatch { get; set; }               // 코드가 확인되면 채팅으로 알릴지 ("채팅 메시지 쓰기" Scope 필요)

    public bool IsConfigured => ClientId.Length > 0 && ClientSecret.Length > 0;
}

// 치지직 API가 실패 응답을 줬을 때
public sealed class ChzzkApiException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}

public sealed record ChzzkTokenResponse(string AccessToken, string RefreshToken, int ExpiresIn);

public sealed record ChzzkUser(string ChannelId, string ChannelName);

// 치지직 Open API 호출 모음 (HttpClient는 Program.cs의 AddHttpClient가 만들어 준다)
// 응답 공통 형식: 성공 {"code":200,"message":null,"content":{...}}, 실패 {"code":401,"message":"INVALID_TOKEN"}
public sealed class ChzzkApiClient(HttpClient http, IOptions<ChzzkOptions> options, IDataProtectionProvider dataProtection, TimeProvider time)
{
    // 리프레시 토큰은 1회용이라, 같은 토큰으로 두 번 동시에 갱신하면 하나는 반드시 실패한다 → 한 번에 하나씩.
    // (서버 프로세스 하나 안에서만 지켜진다. 서버를 여러 대 띄우면 DB 잠금 같은 다른 방법이 필요하다)
    private static readonly SemaphoreSlim RefreshLock = new(1, 1);

    private readonly ChzzkOptions _options = options.Value;
    private readonly IDataProtector _protector = dataProtection.CreateProtector("ImageDonation.ChzzkTokens");

    // 1) 로그인 화면 주소: 브라우저를 여기로 보낸다. scope 파라미터는 없다(개발자 센터에서 관리)
    public string BuildLoginUrl(string state) =>
        $"{_options.AuthorizeUrl}?clientId={Uri.EscapeDataString(_options.ClientId)}" +
        $"&redirectUri={Uri.EscapeDataString(_options.RedirectUri)}&state={Uri.EscapeDataString(state)}";

    // 2) 콜백으로 받은 code를 토큰으로 바꾼다
    public Task<ChzzkTokenResponse> ExchangeCodeAsync(string code, string state, CancellationToken ct = default) =>
        PostTokenAsync(new
        {
            grantType = "authorization_code",
            clientId = _options.ClientId,
            clientSecret = _options.ClientSecret,
            code,
            state,
        }, ct);

    // 3) 토큰 갱신: 응답에 "새" 리프레시 토큰이 들어 있다. 옛 토큰은 다시 쓸 수 없다
    public Task<ChzzkTokenResponse> RefreshAsync(string refreshToken, CancellationToken ct = default) =>
        PostTokenAsync(new
        {
            grantType = "refresh_token",
            refreshToken,
            clientId = _options.ClientId,
            clientSecret = _options.ClientSecret,
        }, ct);

    // 토큰을 암호화해서 엔티티에 넣는다 (DB에는 암호문만 저장된다). 저장(SaveChanges)은 호출한 쪽이 한다
    public void StoreTokens(ChzzkToken entity, ChzzkTokenResponse tokens)
    {
        var now = time.GetUtcNow();
        entity.AccessTokenProtected = _protector.Protect(tokens.AccessToken);
        entity.RefreshTokenProtected = _protector.Protect(tokens.RefreshToken);
        entity.AccessTokenExpiresAt = now.AddSeconds(tokens.ExpiresIn);
        entity.UpdatedAt = now;
    }

    public string ReadRefreshToken(ChzzkToken entity) => _protector.Unprotect(entity.RefreshTokenProtected);

    // 쓸 수 있는 Access Token을 돌려준다. 만료 5분 전부터는 갱신해서 새 토큰 쌍을 DB에 저장한다
    public async Task<string> GetValidAccessTokenAsync(AppDbContext db, string userId, CancellationToken ct = default)
    {
        var token = await db.ChzzkTokens.SingleAsync(t => t.UserId == userId, ct);
        if (IsFresh(token)) return _protector.Unprotect(token.AccessTokenProtected);

        await RefreshLock.WaitAsync(ct);
        try
        {
            // 잠금을 기다리는 동안 다른 요청이 이미 갱신했을 수 있다 → DB에서 다시 읽는다
            await db.Entry(token).ReloadAsync(ct);
            if (IsFresh(token)) return _protector.Unprotect(token.AccessTokenProtected);

            var refreshed = await RefreshAsync(ReadRefreshToken(token), ct);
            StoreTokens(token, refreshed); // 옛 리프레시 토큰은 이제 무효 → 바로 덮어쓴다
            await db.SaveChangesAsync(ct); // 잠금 안에서 저장해야 다음 요청이 새 토큰을 읽는다
            return refreshed.AccessToken;
        }
        finally
        {
            RefreshLock.Release();
        }
    }

    private bool IsFresh(ChzzkToken token) => token.AccessTokenExpiresAt - time.GetUtcNow() > TimeSpan.FromMinutes(5);

    // 로그인한 사용자의 채널 정보 (Scope: 유저 정보 조회)
    public async Task<ChzzkUser> GetMeAsync(string accessToken, CancellationToken ct = default)
    {
        var content = await SendAsync(WithBearer(HttpMethod.Get, "/open/v1/users/me", accessToken), ct);
        return new ChzzkUser(content.GetProperty("channelId").GetString()!, content.GetProperty("channelName").GetString() ?? "");
    }

    // 세션 소켓 주소를 받는다. 이 주소는 1회용이고 잠깐만 유효하다
    public async Task<string> GetSessionUrlAsync(string accessToken, CancellationToken ct = default)
    {
        var content = await SendAsync(WithBearer(HttpMethod.Get, "/open/v1/sessions/auth", accessToken), ct);
        return content.GetProperty("url").GetString()!;
    }

    // 소켓의 SYSTEM(connected) 메시지로 받은 sessionKey로 후원 이벤트를 구독한다 (Scope: 후원 조회)
    // 구독 완료는 HTTP 응답이 아니라 소켓의 SYSTEM(subscribed) 메시지로 온다
    public async Task SubscribeDonationAsync(string accessToken, string sessionKey, CancellationToken ct = default)
    {
        var path = $"/open/v1/sessions/events/subscribe/donation?sessionKey={Uri.EscapeDataString(sessionKey)}";
        await SendAsync(WithBearer(HttpMethod.Post, path, accessToken), ct);
    }

    // 채팅 보내기 (Scope: 채팅 메시지 쓰기). 메시지는 최대 100자
    public async Task SendChatAsync(string accessToken, string message, CancellationToken ct = default)
    {
        var request = WithBearer(HttpMethod.Post, "/open/v1/chats/send", accessToken);
        request.Content = JsonContent.Create(new { message = message.Length > 100 ? message[..100] : message });
        await SendAsync(request, ct);
    }

    private async Task<ChzzkTokenResponse> PostTokenAsync(object body, CancellationToken ct)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, "/auth/v1/token") { Content = JsonContent.Create(body) };
        var content = await SendAsync(request, ct);
        return new ChzzkTokenResponse(
            content.GetProperty("accessToken").GetString()!,
            content.GetProperty("refreshToken").GetString()!,
            ReadInt(content.GetProperty("expiresIn")));
    }

    private static HttpRequestMessage WithBearer(HttpMethod method, string path, string accessToken)
    {
        var request = new HttpRequestMessage(method, path);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken); // "Bearer {토큰}" (공백 주의)
        return request;
    }

    // 요청을 보내고 공통 응답 형식에서 content만 꺼낸다. 실패하면 ChzzkApiException
    private async Task<JsonElement> SendAsync(HttpRequestMessage request, CancellationToken ct)
    {
        using var response = await http.SendAsync(request, ct);
        var text = await response.Content.ReadAsStringAsync(ct);
        JsonElement root = default;
        var isJson = text.Length > 0 && TryParse(text, out root);

        if (!response.IsSuccessStatusCode || !isJson)
        {
            var message = isJson && root.TryGetProperty("message", out var m) && m.ValueKind == JsonValueKind.String
                ? m.GetString()!
                : response.ReasonPhrase ?? "치지직 API 오류";
            throw new ChzzkApiException((int)response.StatusCode, message);
        }

        return root.TryGetProperty("content", out var content) ? content : root;
    }

    private static bool TryParse(string text, out JsonElement root)
    {
        try
        {
            using var document = JsonDocument.Parse(text); // JsonDocument는 빌린 메모리를 쓰므로 다 쓰면 돌려준다
            root = document.RootElement.Clone();           // Clone: document를 닫아도 쓸 수 있는 복사본
            return true;
        }
        catch (JsonException)
        {
            root = default;
            return false;
        }
    }

    // 문서에는 문자열("86400"), 실측 보고에는 숫자(86400)로 적혀 있어서 둘 다 받는다
    private static int ReadInt(JsonElement e) => e.ValueKind == JsonValueKind.String
        ? int.Parse(e.GetString()!, CultureInfo.InvariantCulture)
        : e.GetInt32();
}
