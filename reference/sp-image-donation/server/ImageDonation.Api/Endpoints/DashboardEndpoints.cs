using System.Security.Claims;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Hubs;
using ImageDonation.Api.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Endpoints;

// 스트리머 전용 API (로그인 필요): 검수, 긴급 정지, 설정, 오버레이 토큰
public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard").RequireAuthorization();

        group.MapGet("/donations", ListDonations);
        group.MapPost("/donations/{id:int}/approve", (int id, ClaimsPrincipal user, AppDbContext db, DonationService donations) =>
            ChangeAsync(id, user, db, s => donations.ApproveAsync(s, id)));
        group.MapPost("/donations/{id:int}/reject", (int id, ClaimsPrincipal user, AppDbContext db, DonationService donations) =>
            ChangeAsync(id, user, db, s => donations.RejectAsync(s, id)));
        group.MapPost("/donations/{id:int}/block", (int id, ClaimsPrincipal user, AppDbContext db, DonationService donations) =>
            ChangeAsync(id, user, db, s => donations.BlockSenderAsync(s, id)));
        // 신고: 운영자에게 알림 + 거절 + 차단을 한 번에 (본문 {"reason":"..."}, 200자까지)
        group.MapPost("/donations/{id:int}/report", (int id, ReportRequest body, ClaimsPrincipal user, AppDbContext db, DonationService donations) =>
            ChangeAsync(id, user, db, s => donations.ReportAsync(s, id, body.Reason)));

        group.MapPost("/overlay/clear", ClearOverlay);
        group.MapGet("/settings", GetSettings);
        group.MapPut("/settings", PutSettings);
        group.MapGet("/overlay-token", GetOverlayToken);
        group.MapPost("/overlay-token/rotate", RotateOverlayToken);
    }

    // 로그인은 했지만 아직 온보딩(후원 페이지 만들기)을 안 한 계정
    public static IResult NeedsOnboarding() => Results.Problem(detail: "먼저 온보딩에서 후원 페이지를 만들어 주세요.", statusCode: 403);

    // GET /api/dashboard/donations?status=Pending  (status를 빼면 전체)
    private static async Task<IResult> ListDonations(string? status, ClaimsPrincipal user, AppDbContext db)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return NeedsOnboarding();

        var query = db.Donations.AsNoTracking().Where(d => d.StreamerId == streamer.Id);
        if (status is not null)
        {
            if (!Enum.TryParse<DonationStatus>(status, ignoreCase: true, out var parsed))
            {
                return Results.Problem(detail: "status 값이 올바르지 않아요.", statusCode: 400);
            }
            query = query.Where(d => d.Status == parsed);
        }

        var list = await query.OrderByDescending(d => d.Id).Take(100).ToListAsync(); // 최신 100건
        var ids = list.Select(d => d.Id).ToList();
        var reported = (await db.Reports.Where(r => ids.Contains(r.DonationId)).Select(r => r.DonationId).ToListAsync()).ToHashSet();
        return Results.Ok(list.Select(d => DonationDto.From(d, reported.Contains(d.Id))));
    }

    // 승인·거절·차단·신고 공통: 없거나 다른 스트리머의 후원이면 404, 지금 상태에서 할 수 없으면 409
    private static async Task<IResult> ChangeAsync(int id, ClaimsPrincipal user, AppDbContext db, Func<Streamer, Task<DonationDto?>> change)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return NeedsOnboarding();
        if (!await db.Donations.AnyAsync(d => d.Id == id && d.StreamerId == streamer.Id)) return Results.NotFound();

        var result = await change(streamer);
        return result is null
            ? Results.Problem(detail: "지금 상태에서는 바꿀 수 없어요.", statusCode: 409)
            : Results.Ok(result);
    }

    // 긴급 정지
    private static async Task<IResult> ClearOverlay(ClaimsPrincipal user, AppDbContext db, DonationService donations)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return NeedsOnboarding();

        await donations.ClearOverlayAsync(streamer);
        return Results.NoContent();
    }

    private static async Task<IResult> GetSettings(ClaimsPrincipal user, AppDbContext db)
    {
        var streamer = await db.FindStreamerAsync(user);
        return streamer is null ? NeedsOnboarding() : Results.Ok(SettingsDto.From(streamer.Settings));
    }

    // 범위 검사([Range] 등)는 AddValidation()이 먼저 한다. 여기서는 금지어 목록만 정리한다
    private static async Task<IResult> PutSettings(SettingsDto body, ClaimsPrincipal user, AppDbContext db)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return NeedsOnboarding();

        // JSON의 ["a", null]처럼 빈 값(null)이 섞여 들어올 수 있다 → 그대로 쓰면 서버 오류(500)가 나므로 400으로 막는다
        if (body.BannedWords.Any(w => w is null))
        {
            return Results.Problem(detail: "금지어 목록에 빈 값(null)이 있어요.", statusCode: 400);
        }
        var words = body.BannedWords.Select(w => w.Trim()).Where(w => w.Length > 0).Distinct().ToArray();
        if (words.Any(w => w.Length > SettingsDto.MaxBannedWordLength))
        {
            return Results.Problem(detail: $"금지어는 한 개에 {SettingsDto.MaxBannedWordLength}자까지예요.", statusCode: 400);
        }

        var s = streamer.Settings;
        s.Mode = body.Mode;
        s.MinCheese = body.MinCheese;
        s.AutoApprove = body.AutoApprove;
        s.DisplaySeconds = body.DisplaySeconds;
        s.MinIntervalSeconds = body.MinIntervalSeconds;
        s.MaxFileMb = body.MaxFileMb;
        s.BannedWords = words;
        await db.SaveChangesAsync();
        return Results.Ok(SettingsDto.From(s));
    }

    private static async Task<IResult> GetOverlayToken(ClaimsPrincipal user, AppDbContext db)
    {
        var streamer = await db.FindStreamerAsync(user);
        return streamer is null ? NeedsOnboarding() : Results.Ok(new OverlayTokenResponse(streamer.OverlayToken));
    }

    // 오버레이 주소가 새어 나갔을 때: 새 토큰을 만들고, 옛 주소의 화면은 비운다
    private static async Task<IResult> RotateOverlayToken(ClaimsPrincipal user, AppDbContext db, IHubContext<OverlayHub, IOverlayClient> overlay)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return NeedsOnboarding();

        var oldGroup = OverlayHub.GroupName(streamer.OverlayToken);
        streamer.OverlayToken = Streamer.NewOverlayToken();
        await db.SaveChangesAsync();
        await overlay.Clients.Group(oldGroup).Clear();
        return Results.Ok(new OverlayTokenResponse(streamer.OverlayToken));
    }
}
