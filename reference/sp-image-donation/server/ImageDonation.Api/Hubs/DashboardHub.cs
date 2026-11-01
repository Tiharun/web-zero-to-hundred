using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace ImageDonation.Api.Hubs;

// 서버 → 검수 대시보드로 보내는 메시지
public interface IDashboardClient
{
    Task DonationCreated(DonationDto donation); // 새 후원이 들어왔다
    Task DonationUpdated(DonationDto donation); // 상태가 바뀌었다 (코드 확인, 승인, 표시 완료 등)
}

// 검수 대시보드 허브: /hubs/dashboard. 로그인한 스트리머만 접속하고, 자기 그룹의 소식만 받는다
[Authorize]
public class DashboardHub(AppDbContext db) : Hub<IDashboardClient>
{
    public static string GroupName(int streamerId) => $"dashboard:{streamerId}";

    public override async Task OnConnectedAsync()
    {
        var streamer = await db.FindStreamerAsync(Context.User!);
        if (streamer is null)
        {
            Context.Abort(); // 온보딩 전 계정
            return;
        }
        await Groups.AddToGroupAsync(Context.ConnectionId, GroupName(streamer.Id));
    }
}
