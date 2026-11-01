using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;
using StreamerHub.Api.Services;

namespace StreamerHub.Api.Endpoints;

// /api/schedules 주소 모음 (Day 22, 29)
// 시간은 모두 UTC로 주고받아요. 한국 시간으로 바꾸는 일은 화면(클라이언트)이 해요.
public static class ScheduleEndpoints
{
    public static void MapScheduleEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/schedules");

        group.MapGet("/", GetInRange);

        group.MapPost("/", Create).RequireAuthorization("Admin").RequireRateLimiting("write");
        group.MapPut("/{id:int}", Update).RequireAuthorization("Admin").RequireRateLimiting("write");
        group.MapDelete("/{id:int}", Delete).RequireAuthorization("Admin").RequireRateLimiting("write");
    }

    // GET /api/schedules?from=2026-11-01T15:00:00Z&to=2026-11-08T15:00:00Z
    // from·to를 빼면 "지금부터 7일 동안"이에요
    private static async Task<Results<Ok<List<ScheduleResponse>>, ValidationProblem>> GetInRange(
        DateTime? from, DateTime? to, AppDbContext db)
    {
        var fromUtc = from ?? DateTime.UtcNow;
        var toUtc = to ?? fromUtc.AddDays(7);

        // 주소의 시각 끝에 Z(또는 +09:00 같은 시차)가 없으면 Kind가 Utc가 아니에요. 어느 나라 시간인지 모르니 거절해요
        if (fromUtc.Kind != DateTimeKind.Utc || toUtc.Kind != DateTimeKind.Utc)
        {
            return Problem("from", "시각은 UTC로 보내 주세요. 예: 2026-11-02T00:00:00Z");
        }
        if (toUtc <= fromUtc)
        {
            return Problem("to", "to는 from보다 뒤여야 해요.");
        }

        var schedules = await ScheduleQuery
            .InRange(db.Schedules.Include(s => s.Streamer), fromUtc, toUtc)
            .ToListAsync();
        return TypedResults.Ok(schedules.Select(ScheduleResponse.From).ToList());
    }

    // POST /api/schedules (관리자)
    private static async Task<Results<Created<ScheduleResponse>, ValidationProblem>> Create(
        ScheduleRequest request, AppDbContext db)
    {
        if (request.StartsAt.Kind != DateTimeKind.Utc)
        {
            return Problem("startsAt", "시작 시각은 UTC로 보내 주세요. 예: 2026-11-02T11:00:00Z");
        }
        var streamer = await db.Streamers.FindAsync(request.StreamerId);
        if (streamer is null)
        {
            return Problem("streamerId", "없는 스트리머예요.");
        }

        var schedule = new Schedule
        {
            Streamer = streamer,
            Title = request.Title,
            StartsAt = request.StartsAt,
            DurationMinutes = request.DurationMinutes,
        };
        db.Schedules.Add(schedule);
        await db.SaveChangesAsync();
        return TypedResults.Created($"/api/schedules/{schedule.Id}", ScheduleResponse.From(schedule));
    }

    // PUT /api/schedules/5 (관리자)
    private static async Task<Results<NoContent, NotFound, ValidationProblem>> Update(
        int id, ScheduleRequest request, AppDbContext db)
    {
        if (request.StartsAt.Kind != DateTimeKind.Utc)
        {
            return Problem("startsAt", "시작 시각은 UTC로 보내 주세요. 예: 2026-11-02T11:00:00Z");
        }
        var schedule = await db.Schedules.FindAsync(id);
        if (schedule is null)
        {
            return TypedResults.NotFound();
        }
        if (!await db.Streamers.AnyAsync(s => s.Id == request.StreamerId))
        {
            return Problem("streamerId", "없는 스트리머예요.");
        }

        schedule.StreamerId = request.StreamerId;
        schedule.Title = request.Title;
        schedule.StartsAt = request.StartsAt;
        schedule.DurationMinutes = request.DurationMinutes;
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    // DELETE /api/schedules/5 (관리자)
    private static async Task<Results<NoContent, NotFound>> Delete(int id, AppDbContext db)
    {
        var schedule = await db.Schedules.FindAsync(id);
        if (schedule is null)
        {
            return TypedResults.NotFound();
        }

        db.Schedules.Remove(schedule);
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    // 검증 실패(400)를 AddValidation과 같은 모양({ errors: { 칸: [메시지] } })으로 만들어요
    private static ValidationProblem Problem(string field, string message)
    {
        var errors = new Dictionary<string, string[]>
        {
            [field] = new[] { message },
        };
        return TypedResults.ValidationProblem(errors);
    }
}
