using System.Buffers.Text;
using System.Security.Cryptography;
using System.Text;
using ImageDonation.Api.Data;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ImageDonation.Api.Endpoints;

// 치지직 로그인 (OAuth 2.0 인가 코드 흐름)
//   /api/chzzk/login → 치지직 로그인 화면 → /api/chzzk/callback?code=...&state=... → 토큰 교환 → 우리 쿠키 로그인
public static class ChzzkEndpoints
{
    private const string StateCookie = "chzzk_oauth_state";
    private const string CookiePath = "/api/chzzk";

    public static void MapChzzkEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/chzzk");
        group.MapGet("/login", Login);
        group.MapGet("/callback", Callback);
    }

    private static IResult Login(HttpContext http, ChzzkApiClient api, IOptions<ChzzkOptions> options)
    {
        if (!options.Value.IsConfigured)
        {
            return Results.Redirect("/login?error=chzzk-config"); // 서버에 Chzzk:ClientId·ClientSecret이 없다
        }

        // state: 다른 사이트가 로그인 흐름을 위조하지 못하게 하는 1회용 무작위 값. 쿠키에 적어 두고 콜백에서 비교한다
        var state = Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(32));
        http.Response.Cookies.Append(StateCookie, state, new CookieOptions
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Lax, // 치지직에서 돌아오는 GET 이동에는 쿠키가 따라온다
            Secure = http.Request.IsHttps,
            MaxAge = TimeSpan.FromMinutes(10),
            Path = CookiePath,
        });
        return Results.Redirect(api.BuildLoginUrl(state));
    }

    private static async Task<IResult> Callback(
        string? code,
        string? state,
        HttpContext http,
        ChzzkApiClient api,
        AppDbContext db,
        UserManager<IdentityUser> users,
        SignInManager<IdentityUser> signIn,
        ILogger<ChzzkApiClient> logger)
    {
        var expected = http.Request.Cookies[StateCookie];
        http.Response.Cookies.Delete(StateCookie, new CookieOptions { Path = CookiePath });
        if (code is null || state is null || expected is null || !SameText(state, expected))
        {
            return Results.Redirect("/login?error=chzzk-state");
        }

        ChzzkTokenResponse tokens;
        ChzzkUser me;
        try
        {
            tokens = await api.ExchangeCodeAsync(code, state);
            me = await api.GetMeAsync(tokens.AccessToken);
        }
        catch (ChzzkApiException ex)
        {
            logger.LogWarning(ex, "치지직 토큰 교환 실패 ({Status})", ex.StatusCode);
            return Results.Redirect("/login?error=chzzk-token");
        }

        // 계정 찾기: ① 이 채널이 이미 연결된 계정 ② 지금 로컬 로그인 중인 계정(계정 연결) ③ 새 계정
        var token = await db.ChzzkTokens.FirstOrDefaultAsync(t => t.ChannelId == me.ChannelId);
        var user = token is null ? null : await users.FindByIdAsync(token.UserId);
        if (user is null && http.User.Identity?.IsAuthenticated == true)
        {
            user = await users.GetUserAsync(http.User);
        }
        if (user is null)
        {
            user = new IdentityUser($"chzzk-{me.ChannelId}"); // 비밀번호 없는 계정: 치지직 로그인으로만 들어온다
            if (!(await users.CreateAsync(user)).Succeeded) return Results.Redirect("/login?error=chzzk-account");
        }

        token ??= await db.ChzzkTokens.FindAsync(user.Id);
        if (token is null)
        {
            token = new ChzzkToken { UserId = user.Id };
            db.ChzzkTokens.Add(token);
        }
        token.ChannelId = me.ChannelId;
        token.ChannelName = me.ChannelName;
        api.StoreTokens(token, tokens); // Data Protection으로 암호화해서 저장
        await db.SaveChangesAsync();

        await signIn.SignInAsync(user, isPersistent: true); // 로컬 로그인과 같은 쿠키
        var hasStreamer = await db.Streamers.AnyAsync(s => s.UserId == user.Id);
        return Results.Redirect(hasStreamer ? "/dashboard" : "/onboarding");
    }

    // 걸리는 시간이 값에 따라 달라지지 않는 비교 (타이밍 공격 방지)
    private static bool SameText(string a, string b) =>
        CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(a), Encoding.UTF8.GetBytes(b));
}
