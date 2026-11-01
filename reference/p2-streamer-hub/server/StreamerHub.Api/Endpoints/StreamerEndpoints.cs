using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Endpoints;

// /api/streamers 주소 모음 (Day 18, 21, 22, 23)
public static class StreamerEndpoints
{
    public static void MapStreamerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/streamers");

        // 누구나 볼 수 있어요
        group.MapGet("/", GetAll);
        group.MapGet("/{id:int}", GetById);

        // 관리자만 할 수 있고, 요청 제한도 걸어요
        group.MapPost("/", Create).RequireAuthorization("Admin").RequireRateLimiting("write");
        group.MapPut("/{id:int}", Update).RequireAuthorization("Admin").RequireRateLimiting("write");
        group.MapDelete("/{id:int}", Delete).RequireAuthorization("Admin").RequireRateLimiting("write");
    }

    // GET /api/streamers?q=곰 → 이름에 검색어가 들어간 스트리머 (q가 없으면 전부)
    private static async Task<Ok<List<StreamerResponse>>> GetAll(string? q, AppDbContext db)
    {
        var query = db.Streamers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            // 검색어는 SQL 매개변수로 들어가서 SQL 인젝션이 생기지 않아요 (Day 34)
            var keyword = q.Trim().ToLower();
            query = query.Where(s => s.Name.ToLower().Contains(keyword));
        }

        var streamers = await query.OrderBy(s => s.Name).ToListAsync();
        return TypedResults.Ok(streamers.Select(StreamerResponse.From).ToList());
    }

    // GET /api/streamers/3 → 스트리머 한 명 + 다가오는 일정
    private static async Task<Results<Ok<StreamerDetailResponse>, NotFound>> GetById(int id, AppDbContext db)
    {
        var now = DateTime.UtcNow;
        var streamer = await db.Streamers
            .Include(s => s.Schedules.Where(x => x.StartsAt >= now).OrderBy(x => x.StartsAt)) // 1:N 관계를 함께 불러와요 (Day 22)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (streamer is null)
        {
            return TypedResults.NotFound(); // 본문은 UseStatusCodePages가 ProblemDetails로 채워요
        }
        return TypedResults.Ok(StreamerDetailResponse.From(streamer));
    }

    // POST /api/streamers (관리자). 본문이 검증에 실패하면 이 메서드까지 오지 않고 400이 나가요
    private static async Task<Created<StreamerResponse>> Create(StreamerRequest request, AppDbContext db)
    {
        var streamer = new Streamer
        {
            Name = request.Name,
            Platform = request.Platform,
            ChannelUrl = request.ChannelUrl,
            Bio = request.Bio,
            AvatarUrl = request.AvatarUrl,
            CreatedAt = DateTime.UtcNow,
        };
        db.Streamers.Add(streamer);
        await db.SaveChangesAsync();

        // 201 Created + Location 헤더(새로 생긴 자원의 주소)
        return TypedResults.Created($"/api/streamers/{streamer.Id}", StreamerResponse.From(streamer));
    }

    // PUT /api/streamers/3 (관리자)
    private static async Task<Results<NoContent, NotFound>> Update(int id, StreamerRequest request, AppDbContext db)
    {
        var streamer = await db.Streamers.FindAsync(id);
        if (streamer is null)
        {
            return TypedResults.NotFound();
        }

        streamer.Name = request.Name;
        streamer.Platform = request.Platform;
        streamer.ChannelUrl = request.ChannelUrl;
        streamer.Bio = request.Bio;
        streamer.AvatarUrl = request.AvatarUrl;
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }

    // DELETE /api/streamers/3 (관리자). 이 스트리머의 일정도 함께 지워져요(Cascade)
    private static async Task<Results<NoContent, NotFound>> Delete(int id, AppDbContext db)
    {
        var streamer = await db.Streamers.FindAsync(id);
        if (streamer is null)
        {
            return TypedResults.NotFound();
        }

        db.Streamers.Remove(streamer);
        await db.SaveChangesAsync();
        return TypedResults.NoContent();
    }
}
