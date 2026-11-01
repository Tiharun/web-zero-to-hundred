using System.Security.Claims;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Services.Events;

namespace ImageDonation.Api.Endpoints;

// 테스트 모드: 치지직 승인 없이 "치즈 후원이 들어왔다"를 흉내 낸다 (돈은 오가지 않는다)
public static class TestModeEndpoints
{
    public static void MapTestModeEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/dashboard/test-donation", SendTestDonation).RequireAuthorization();
    }

    // 본문 예: {"amount":1000,"message":"이미지 부탁해요 #AB12","nickname":"테스트 후원자"}
    private static async Task<IResult> SendTestDonation(TestDonationRequest body, ClaimsPrincipal user, AppDbContext db, FakeDonationSource fake)
    {
        var streamer = await db.FindStreamerAsync(user);
        if (streamer is null) return DashboardEndpoints.NeedsOnboarding();

        // 자기 방송에만 보낼 수 있다 (streamer.Id). 결과(매칭 여부)는 대시보드 허브로 실시간 전달된다
        await fake.PublishAsync(streamer.Id, body.Nickname ?? "테스트 후원자", body.Amount, body.Message);
        return Results.Accepted();
    }
}
