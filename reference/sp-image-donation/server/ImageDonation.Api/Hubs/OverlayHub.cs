using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Hubs;

// 서버 → 오버레이로 보내는 메시지 (JS에서 connection.on("ShowDonation", ...)으로 받는다)
public interface IOverlayClient
{
    Task ShowDonation(OverlayDonationDto donation);
    Task Clear(); // 긴급 정지: 지금 보이는 이미지와 대기 중인 이미지를 모두 지운다
}

// OBS 오버레이 허브: /hubs/overlay?token=<오버레이 토큰>. 로그인 없이 토큰만으로 접속한다.
// 토큰이 틀린 연결은 Program.cs의 검사(CheckTokenAsync)가 허브에 닿기 전에 401로 막는다.
public class OverlayHub(AppDbContext db, DonationService donations) : Hub<IOverlayClient>
{
    // 그룹 이름에 토큰을 넣는다 → 토큰을 재발급하면 옛 주소로 열린 오버레이는 더 이상 아무것도 받지 못한다
    public static string GroupName(string overlayToken) => $"overlay:{overlayToken}";

    public static Task<Streamer?> FindStreamerAsync(AppDbContext db, string? token) =>
        string.IsNullOrEmpty(token)
            ? Task.FromResult<Streamer?>(null)
            : db.Streamers.FirstOrDefaultAsync(s => s.OverlayToken == token);

    // 허브 앞에서 도는 검사: 틀린 토큰이면 401 (Program.cs에서 /hubs/overlay 요청에만 붙인다)
    public static async Task CheckTokenAsync(HttpContext http, RequestDelegate next)
    {
        var db = http.RequestServices.GetRequiredService<AppDbContext>();
        if (await FindStreamerAsync(db, http.Request.Query["token"]) is null)
        {
            http.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }
        await next(http);
    }

    public override async Task OnConnectedAsync()
    {
        var streamer = await FindStreamerAsync(db, Context.GetHttpContext()?.Request.Query["token"]);
        if (streamer is null)
        {
            Context.Abort(); // 한 번 더 확인 (그 사이 토큰이 바뀐 경우)
            return;
        }

        Context.Items["StreamerId"] = streamer.Id;
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(streamer.OverlayToken));
    }

    // 오버레이가 이미지를 다 보여 준 뒤 부른다: Approved → Shown
    public async Task MarkShown(int donationId)
    {
        if (Context.Items["StreamerId"] is int streamerId)
        {
            await donations.MarkShownAsync(streamerId, donationId);
        }
    }
}
