using System.Security.Claims;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services.Events;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Endpoints;

// 로그인·내 정보·온보딩
public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app, bool localLoginEnabled)
    {
        var group = app.MapGroup("/api/auth");

        // 개발용 로컬 로그인: POST /api/auth/register, POST /api/auth/login?useCookies=true 등 (ASP.NET Core Identity)
        if (localLoginEnabled)
        {
            group.MapIdentityApi<IdentityUser>().RequireRateLimiting("auth");
        }

        group.MapPost("/logout", async (SignInManager<IdentityUser> signIn) =>
        {
            await signIn.SignOutAsync();
            return Results.NoContent();
        }).RequireAuthorization();

        group.MapGet("/me", GetMe); // 로그인 안 했으면 204(본문 없음): 화면이 "로그인 필요"를 판단하는 데 쓴다
        group.MapPost("/onboarding", Onboard).RequireAuthorization();
    }

    private static async Task<IResult> GetMe(ClaimsPrincipal user, AppDbContext db, ChzzkSessionSource sessions)
    {
        if (user.Identity?.IsAuthenticated != true) return Results.NoContent();

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        var streamer = await db.FindStreamerAsync(user);
        var chzzk = await db.ChzzkTokens.AsNoTracking().FirstOrDefaultAsync(t => t.UserId == userId);

        return Results.Ok(new MeResponse(
            user.Identity?.Name ?? "",
            streamer is null ? null : new StreamerInfo(streamer.Id, streamer.Slug, streamer.DisplayName),
            chzzk is null ? null : new ChzzkInfo(chzzk.ChannelName, streamer is not null && sessions.IsConnected(streamer.Id))));
    }

    // 후원 페이지 만들기: 주소(slug)와 이름을 정하면 비밀 오버레이 토큰과 기본 설정이 만들어진다
    private static async Task<IResult> Onboard(OnboardingRequest body, ClaimsPrincipal user, AppDbContext db, TimeProvider time)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        if (await db.Streamers.AnyAsync(s => s.UserId == userId))
        {
            return Results.Problem(detail: "이미 후원 페이지가 있어요.", statusCode: 409);
        }
        if (await db.Streamers.AnyAsync(s => s.Slug == body.Slug))
        {
            return Results.Problem(detail: "이미 쓰고 있는 주소예요. 다른 주소를 골라 주세요.", statusCode: 409);
        }

        var streamer = new Streamer
        {
            UserId = userId,
            Slug = body.Slug,
            DisplayName = body.DisplayName.Trim(),
            OverlayToken = Streamer.NewOverlayToken(),
            CreatedAt = time.GetUtcNow(),
            Settings = new StreamerSettings(),
        };
        db.Streamers.Add(streamer);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // 두 사람이 같은 주소를 동시에 고른 경우 (UNIQUE 인덱스가 막아 준다)
            return Results.Problem(detail: "이미 쓰고 있는 주소예요. 다른 주소를 골라 주세요.", statusCode: 409);
        }

        return TypedResults.Created((string?)null, new StreamerInfo(streamer.Id, streamer.Slug, streamer.DisplayName));
    }
}
