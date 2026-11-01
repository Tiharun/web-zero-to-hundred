using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;
using StreamerHub.Api.Services;

namespace StreamerHub.Api.Endpoints;

// /api/notices 주소 모음 (Day 33): 방송 화면 공지
public static class NoticeEndpoints
{
    public static void MapNoticeEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/notices");

        group.MapGet("/current", GetCurrent); // 폴링(몇 초마다 다시 묻기)용
        group.MapGet("/stream", Stream);      // SSE(서버가 먼저 보내 주기)용

        group.MapPost("/", Create).RequireAuthorization("Admin").RequireRateLimiting("write");
    }

    // GET /api/notices/current → 가장 최근 공지. 하나도 없으면 204(보낼 내용 없음)
    private static async Task<Results<Ok<NoticeResponse>, NoContent>> GetCurrent(AppDbContext db)
    {
        var current = await FindCurrentAsync(db);
        if (current is null)
        {
            return TypedResults.NoContent();
        }
        return TypedResults.Ok(current);
    }

    // POST /api/notices (관리자) → 저장하고, 연결된 오버레이 모두에게 바로 보내요
    private static async Task<Created<NoticeResponse>> Create(
        NoticeRequest request, AppDbContext db, NoticeBroadcaster broadcaster)
    {
        var notice = new Notice
        {
            Message = request.Message,
            CreatedAt = DateTime.UtcNow,
        };
        db.Notices.Add(notice);
        await db.SaveChangesAsync();

        var response = NoticeResponse.From(notice);
        broadcaster.Publish(response);
        return TypedResults.Created("/api/notices/current", response);
    }

    // GET /api/notices/stream → SSE(Server-Sent Events, Content-Type: text/event-stream)
    // 연결을 끊지 않고 열어 둔 채, 공지가 생길 때마다 "event: notice / data: {JSON}"을 보내요.
    private static ServerSentEventsResult<NoticeResponse> Stream(
        AppDbContext db, NoticeBroadcaster broadcaster, CancellationToken cancellationToken)
    {
        return TypedResults.ServerSentEvents(ReadNoticesAsync(db, broadcaster, cancellationToken), eventType: "notice");
    }

    // 오버레이 하나에게 보낼 공지를 차례로 내놓아요(yield return). 브라우저가 연결을 끊으면 cancellationToken이 취소돼요
    private static async IAsyncEnumerable<NoticeResponse> ReadNoticesAsync(
        AppDbContext db, NoticeBroadcaster broadcaster, [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        // 1) 먼저 우편함을 등록해요. 그래야 아래에서 지금 공지를 읽는 사이에 올라온 공지도 놓치지 않아요
        var mailbox = broadcaster.Subscribe();
        try
        {
            // 2) 지금 공지부터 보내요. (다시 연결한 오버레이도 바로 최신 공지를 보여 줄 수 있어요)
            var current = await FindCurrentAsync(db);
            if (current is not null)
            {
                yield return current;
            }

            // 3) 새 공지가 우편함에 들어올 때까지 기다렸다가 하나씩 보내요
            await foreach (var notice in mailbox.Reader.ReadAllAsync(cancellationToken))
            {
                yield return notice;
            }
        }
        finally
        {
            // 4) 연결이 끝나면 우편함을 치워요
            broadcaster.Unsubscribe(mailbox);
        }
    }

    private static async Task<NoticeResponse?> FindCurrentAsync(AppDbContext db)
    {
        var notice = await db.Notices
            .OrderByDescending(n => n.Id) // Id가 가장 큰 것 = 가장 최근
            .FirstOrDefaultAsync();
        if (notice is null)
        {
            return null;
        }
        return NoticeResponse.From(notice);
    }
}
