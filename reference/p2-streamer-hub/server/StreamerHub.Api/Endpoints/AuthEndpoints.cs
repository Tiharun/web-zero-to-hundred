using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Endpoints;

// 가입·로그인·로그아웃과 "내 정보" 주소 모음 (Day 25, 26)
public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        // Identity가 만들어 주는 주소들: POST /api/auth/register, POST /api/auth/login?useCookies=true 등
        // 로그인에도 요청 제한을 걸어서 비밀번호를 마구 넣어 보는 공격(무차별 대입)을 막아요 (Day 34)
        var auth = app.MapGroup("/api/auth").RequireRateLimiting("write");
        auth.MapIdentityApi<AppUser>();
        auth.MapPost("/logout", Logout);

        app.MapGet("/api/me", GetMe);
        app.MapPut("/api/me", UpdateMe).RequireAuthorization().RequireRateLimiting("write");
    }

    // POST /api/auth/logout → 로그인 쿠키를 지워요
    // 쿠키가 이미 만료됐어도 "로그아웃 성공"이 맞으니 RequireAuthorization을 붙이지 않아요
    private static async Task<NoContent> Logout(SignInManager<AppUser> signInManager)
    {
        await signInManager.SignOutAsync();
        return TypedResults.NoContent();
    }

    // GET /api/me → 로그인했으면 { email, displayName, roles }, 아니면 204(내용 없음)
    // 401로 답하면 로그인하지 않은 방문자의 브라우저 콘솔에 페이지를 열 때마다 빨간 오류가 찍혀요.
    // "아직 로그인 안 함"은 오류가 아니라서 204로 알려 줘요.
    private static async Task<Results<Ok<MeResponse>, NoContent>> GetMe(
        ClaimsPrincipal user, UserManager<AppUser> userManager)
    {
        var appUser = await userManager.GetUserAsync(user); // 쿠키 안의 사용자 Id로 DB에서 찾아요
        if (appUser is null)
        {
            return TypedResults.NoContent();
        }

        var roles = await userManager.GetRolesAsync(appUser);
        return TypedResults.Ok(new MeResponse(appUser.Email ?? "", appUser.DisplayName, roles.ToList()));
    }

    // PUT /api/me → 닉네임(DisplayName) 바꾸기. 가입 화면이 가입 직후에 불러요
    private static async Task<Results<NoContent, NotFound>> UpdateMe(
        UpdateMeRequest request, ClaimsPrincipal user, UserManager<AppUser> userManager)
    {
        var appUser = await userManager.GetUserAsync(user);
        if (appUser is null)
        {
            return TypedResults.NotFound();
        }

        appUser.DisplayName = request.DisplayName;
        await userManager.UpdateAsync(appUser);
        return TypedResults.NoContent();
    }
}
