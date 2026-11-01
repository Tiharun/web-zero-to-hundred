using System.Net;
using System.Security.Cryptography;
using System.Text;
using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Hubs;
using ImageDonation.Api.Services.Events;
using ImageDonation.Api.Services.Storage;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace ImageDonation.Api.Services;

// 후원의 상태 전이와 알림을 한곳에서 처리한다
//   만들기 → (치즈 모드) 코드 매칭 → 승인/거절 → 오버레이 표시 → 표시 완료 (+ 긴급 정지, 신고)
public sealed class DonationService(
    AppDbContext db,
    IImageStorage storage,
    ImageProcessor images,
    IHubContext<OverlayHub, IOverlayClient> overlay,
    IHubContext<DashboardHub, IDashboardClient> dashboard,
    ChzzkApiClient chzzk,
    IOptions<ChzzkOptions> chzzkOptions,
    IConfiguration configuration,
    TimeProvider time,
    ILogger<DonationService> logger)
{
    // 오버레이가 늦게 연결돼도(OBS를 나중에 켬) 이 시간 안에 승인된 후원은 다시 보내 준다
    public static readonly TimeSpan OverlayBacklogWindow = TimeSpan.FromMinutes(30);

    // 보낸 사람 IP는 원문 대신 HMAC 해시로만 저장한다 (키는 user-secrets/환경 변수의 Security:IpHashKey)
    public string HashSenderIp(IPAddress? ip)
    {
        var key = Encoding.UTF8.GetBytes(configuration["Security:IpHashKey"]!);
        var hash = HMACSHA256.HashData(key, Encoding.UTF8.GetBytes(ip?.ToString() ?? "unknown"));
        return Convert.ToHexString(hash);
    }

    public Task<bool> IsBlockedAsync(int streamerId, string senderIpHash, CancellationToken ct = default) =>
        db.BlockEntries.AnyAsync(b => b.StreamerId == streamerId && b.SenderIpHash == senderIpHash, ct);

    // 1) 시청자 후원 만들기 (입력 길이·금지어·차단 검사는 PublicEndpoints가 먼저 끝냈다)
    public async Task<Donation> CreateAsync(Streamer streamer, string nickname, string message, byte[] upload, string senderIpHash, CancellationToken ct = default)
    {
        var processed = images.Process(upload); // 이미지가 아니면 InvalidImageException
        var fileName = await storage.SaveAsync(processed.Content, processed.Extension, ct);
        var settings = streamer.Settings;
        var now = time.GetUtcNow();

        var donation = new Donation
        {
            StreamerId = streamer.Id,
            Nickname = nickname,
            Message = message,
            ImageFile = fileName,
            SenderIpHash = senderIpHash,
            CreatedAt = now,
            UpdatedAt = now,
            Status = settings.Mode == DonationMode.Cheese ? DonationStatus.AwaitingCheese
                : settings.AutoApprove ? DonationStatus.Approved
                : DonationStatus.Pending,
            Code = settings.Mode == DonationMode.Cheese ? await NewUniqueCodeAsync(streamer.Id, ct) : null,
        };
        db.Donations.Add(donation);
        await db.SaveChangesAsync(ct);

        await dashboard.Clients.Group(DashboardHub.GroupName(streamer.Id)).DonationCreated(DonationDto.From(donation));
        if (donation.Status == DonationStatus.Approved)
        {
            await SendToOverlayAsync(streamer, donation); // 자동 승인
        }
        return donation;
    }

    // 2) 승인: Pending일 때만 Approved로 바꾸고 오버레이로 보낸다. 바꿀 수 없으면 null
    public async Task<DonationDto?> ApproveAsync(Streamer streamer, int donationId)
    {
        if (!await TransitionAsync(streamer.Id, donationId, DonationStatus.Pending, DonationStatus.Approved)) return null;

        var donation = await db.Donations.AsNoTracking().SingleAsync(d => d.Id == donationId);
        await SendToOverlayAsync(streamer, donation);
        return await NotifyUpdatedAsync(donation);
    }

    // 3) 거절: Pending일 때만 Rejected로 바꾸고, 방송에 나가지 않을 이미지는 바로 지운다
    public async Task<DonationDto?> RejectAsync(Streamer streamer, int donationId)
    {
        if (!await TransitionAsync(streamer.Id, donationId, DonationStatus.Pending, DonationStatus.Rejected)) return null;

        var donation = await db.Donations.AsNoTracking().SingleAsync(d => d.Id == donationId);
        await storage.DeleteAsync(donation.ImageFile);
        return await NotifyUpdatedAsync(donation);
    }

    // 4) 차단: 이 후원을 보낸 사람(IP 해시)을 차단 목록에 넣고, 검수 대기 중이면 함께 거절한다
    public async Task<DonationDto?> BlockSenderAsync(Streamer streamer, int donationId)
    {
        var donation = await db.Donations.AsNoTracking().FirstOrDefaultAsync(d => d.Id == donationId && d.StreamerId == streamer.Id);
        if (donation is null) return null;

        if (!await IsBlockedAsync(streamer.Id, donation.SenderIpHash))
        {
            db.BlockEntries.Add(new BlockEntry
            {
                StreamerId = streamer.Id,
                SenderIpHash = donation.SenderIpHash,
                Nickname = donation.Nickname,
                CreatedAt = time.GetUtcNow(),
            });
            await db.SaveChangesAsync();
        }

        return await RejectAsync(streamer, donationId) ?? DonationDto.From(donation);
    }

    // 5) 신고: 운영자에게 알리고(Report 행), 후원을 거절하고, 보낸 사람을 차단한다. 셋을 한 트랜잭션으로 묶는다.
    //    이미지는 운영자가 볼 증거라 지우지 않는다: Rejected라서 /media로는 제공되지 않고(격리), 7일 보관 기간이 지나면 RetentionService가 지운다
    public async Task<DonationDto?> ReportAsync(Streamer streamer, int donationId, string reason)
    {
        var donation = await db.Donations.AsNoTracking().FirstOrDefaultAsync(d => d.Id == donationId && d.StreamerId == streamer.Id);
        if (donation is null) return null;
        var now = time.GetUtcNow();

        await using (var transaction = await db.Database.BeginTransactionAsync())
        {
            // 조건부 전이: 이미 거절·만료된 후원은 그대로 두고, 나머지(검수 대기·승인·방송 완료 등)는 Rejected로
            await db.Donations
                .Where(d => d.Id == donationId && d.StreamerId == streamer.Id
                    && d.Status != DonationStatus.Rejected && d.Status != DonationStatus.Expired)
                .ExecuteUpdateAsync(s => s.SetProperty(d => d.Status, DonationStatus.Rejected).SetProperty(d => d.UpdatedAt, now));

            db.Reports.Add(new Report { DonationId = donationId, StreamerId = streamer.Id, Reason = reason.Trim(), CreatedAt = now });
            if (!await IsBlockedAsync(streamer.Id, donation.SenderIpHash))
            {
                db.BlockEntries.Add(new BlockEntry { StreamerId = streamer.Id, SenderIpHash = donation.SenderIpHash, Nickname = donation.Nickname, CreatedAt = now });
            }
            await db.SaveChangesAsync();
            await transaction.CommitAsync(); // 여기까지 모두 성공해야 한꺼번에 반영된다
        }

        return await NotifyUpdatedAsync(await db.Donations.AsNoTracking().SingleAsync(d => d.Id == donationId));
    }

    // 6) 오버레이가 다 보여 줬다: Approved → Shown
    public async Task MarkShownAsync(int streamerId, int donationId)
    {
        if (await TransitionAsync(streamerId, donationId, DonationStatus.Approved, DonationStatus.Shown))
        {
            await NotifyUpdatedAsync(await db.Donations.AsNoTracking().SingleAsync(d => d.Id == donationId));
        }
    }

    // 7) 긴급 정지: 아직 다 보여 주지 못한 승인 후원을 모두 Cleared로 바꾸고(DB에 남김), 오버레이 화면과 대기열을 비운다.
    //    DB에 남겨야 오버레이가 다시 연결돼도 같은 이미지를 또 보내지 않는다. 바꾼 개수를 돌려준다
    public async Task<int> ClearOverlayAsync(Streamer streamer)
    {
        var approved = await db.Donations.AsNoTracking()
            .Where(d => d.StreamerId == streamer.Id && d.Status == DonationStatus.Approved)
            .ToListAsync();

        var cleared = 0;
        foreach (var donation in approved)
        {
            // 하나씩 조건부 전이: 그 사이 Shown이 된 후원은 건드리지 않는다
            if (!await TransitionAsync(streamer.Id, donation.Id, DonationStatus.Approved, DonationStatus.Cleared)) continue;
            await storage.DeleteAsync(donation.ImageFile);
            donation.Status = DonationStatus.Cleared;
            await NotifyUpdatedAsync(donation);
            cleared++;
        }

        await overlay.Clients.Group(OverlayHub.GroupName(streamer.OverlayToken)).Clear();
        return cleared;
    }

    // 오버레이가 연결될 때 보내 줄 "아직 보여 주지 못한 승인 후원" (최근 30분, 승인한 순서대로)
    public async Task<List<OverlayDonationDto>> GetOverlayBacklogAsync(Streamer streamer)
    {
        var since = time.GetUtcNow() - OverlayBacklogWindow;
        var approved = await db.Donations.AsNoTracking()
            .Where(d => d.StreamerId == streamer.Id && d.Status == DonationStatus.Approved && d.UpdatedAt >= since)
            .OrderBy(d => d.UpdatedAt)
            .ThenBy(d => d.Id)
            .ToListAsync();
        return approved.Select(d => ToOverlayDto(streamer, d)).ToList();
    }

    // 8) 치즈 후원 이벤트 처리 (치지직 세션과 테스트 모드가 모두 여기로 온다)
    public async Task HandleCheeseEventAsync(CheeseDonationEvent evt, CancellationToken ct = default)
    {
        var streamer = await db.Streamers.Include(s => s.Settings).FirstOrDefaultAsync(s => s.Id == evt.StreamerId, ct);
        // 무료 모드에서는 매칭할 것이 없으므로 아무것도 저장하지 않는다 (최소 수집)
        if (streamer is null || streamer.Settings.Mode != DonationMode.Cheese) return;

        var now = time.GetUtcNow();
        var since = now - DonationCodeMatcher.CodeLifetime;
        var candidates = await db.Donations.AsNoTracking()
            .Where(d => d.StreamerId == streamer.Id && d.Status == DonationStatus.AwaitingCheese && d.CreatedAt >= since)
            .ToListAsync(ct);
        var match = DonationCodeMatcher.FindMatch(candidates, evt, streamer.Settings.MinCheese, now);

        // 조건부 UPDATE: "아직 AwaitingCheese일 때만" 바꾼다 → 이벤트가 동시에 두 번 와도 한 번만 매칭된다
        var next = streamer.Settings.AutoApprove ? DonationStatus.Approved : DonationStatus.Pending;
        var matched = match is not null && await db.Donations
            .Where(d => d.Id == match.Id && d.Status == DonationStatus.AwaitingCheese)
            .ExecuteUpdateAsync(s => s
                .SetProperty(d => d.Status, next)
                .SetProperty(d => d.CheeseAmount, evt.PayAmount)
                .SetProperty(d => d.UpdatedAt, now), ct) == 1;

        // 이벤트 기록(7일 뒤 자동 삭제): 매칭에 필요한 것만. 후원자 닉네임·메시지는 저장하지 않는다
        db.DonationEvents.Add(new DonationEvent
        {
            StreamerId = streamer.Id,
            Source = evt.Source,
            PayAmount = evt.PayAmount,
            ReceivedAt = evt.ReceivedAt,
            MatchedDonationId = matched ? match!.Id : null,
        });
        await db.SaveChangesAsync(ct);
        if (!matched) return;

        var donation = await db.Donations.AsNoTracking().SingleAsync(d => d.Id == match!.Id, ct);
        await NotifyUpdatedAsync(donation);
        if (next == DonationStatus.Approved)
        {
            await SendToOverlayAsync(streamer, donation);
        }
        if (evt.Source == "chzzk" && chzzkOptions.Value.ChatOnMatch)
        {
            await TrySendChatAsync(streamer, $"{evt.DonatorNickname}님의 이미지 후원({donation.Code})이 확인됐어요!");
        }
    }

    // 상태 전이를 UPDATE 한 번으로: WHERE에 "지금 상태"를 넣어서, 이미 바뀐 후원은 다시 바꾸지 않는다
    private async Task<bool> TransitionAsync(int streamerId, int donationId, DonationStatus from, DonationStatus to)
    {
        var now = time.GetUtcNow();
        var changed = await db.Donations
            .Where(d => d.Id == donationId && d.StreamerId == streamerId && d.Status == from)
            .ExecuteUpdateAsync(s => s.SetProperty(d => d.Status, to).SetProperty(d => d.UpdatedAt, now));
        return changed == 1;
    }

    private async Task<string> NewUniqueCodeAsync(int streamerId, CancellationToken ct)
    {
        // 같은 스트리머의 "기다리는 후원"끼리 코드가 겹치지 않게 한다 (36^4 ≈ 168만 가지)
        for (var attempt = 0; attempt < 20; attempt++)
        {
            var code = DonationCodeMatcher.NewCode();
            var taken = await db.Donations.AnyAsync(
                d => d.StreamerId == streamerId && d.Status == DonationStatus.AwaitingCheese && d.Code == code, ct);
            if (!taken) return code;
        }
        throw new InvalidOperationException("후원 코드를 만들지 못했어요.");
    }

    private Task SendToOverlayAsync(Streamer streamer, Donation donation) =>
        overlay.Clients.Group(OverlayHub.GroupName(streamer.OverlayToken)).ShowDonation(ToOverlayDto(streamer, donation));

    private static OverlayDonationDto ToOverlayDto(Streamer streamer, Donation donation) => new(
        donation.Id,
        DonationDto.MediaUrl(donation.ImageFile),
        donation.Nickname,
        donation.Message,
        streamer.Settings.DisplaySeconds,
        streamer.Settings.MinIntervalSeconds);

    private async Task<DonationDto> NotifyUpdatedAsync(Donation donation)
    {
        var dto = DonationDto.From(donation);
        await dashboard.Clients.Group(DashboardHub.GroupName(donation.StreamerId)).DonationUpdated(dto);
        return dto;
    }

    // 채팅 안내는 "있으면 좋은 것": 실패해도 후원 처리는 이미 끝났으므로 기록만 남긴다
    private async Task TrySendChatAsync(Streamer streamer, string message)
    {
        try
        {
            if (!await db.ChzzkTokens.AnyAsync(t => t.UserId == streamer.UserId)) return; // 치지직을 연결하지 않은 스트리머
            var accessToken = await chzzk.GetValidAccessTokenAsync(db, streamer.UserId); // 필요하면 갱신·저장까지
            await chzzk.SendChatAsync(accessToken, message);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "치지직 채팅 안내 실패 (스트리머 {StreamerId})", streamer.Id);
        }
    }
}
