using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Hubs;
using ImageDonation.Api.Services.Storage;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Services;

public sealed record RetentionResult(int ExpiredDonations, int DeletedDonations, int DeletedFiles);

// 정리 담당 BackgroundService: 일정 간격(Retention:IntervalSeconds, 기본 60초)마다
//   ① 30분 안에 치즈가 오지 않은 후원을 Expired로 바꾸고 (그 사이 매칭된 후원은 건드리지 않는다)
//   ② 7일이 지난 후원(이미지·기록)을 지우고
//   ③ DB에 없는 7일 지난 파일도 지운다
public sealed class RetentionService(
    IServiceScopeFactory scopes,
    IImageStorage storage,
    IHubContext<DashboardHub, IDashboardClient> dashboard,
    IConfiguration configuration,
    TimeProvider time,
    ILogger<RetentionService> logger) : BackgroundService
{
    public static readonly TimeSpan KeepFor = TimeSpan.FromDays(7); // 보관 기간

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var interval = TimeSpan.FromSeconds(configuration.GetValue("Retention:IntervalSeconds", 60));
        using var timer = new PeriodicTimer(interval, time);
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                var result = await RunOnceAsync(stoppingToken);
                if (result != new RetentionResult(0, 0, 0))
                {
                    logger.LogInformation("정리 완료: {Result}", result);
                }
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                logger.LogError(ex, "정리 작업 실패. 다음 간격에 다시 시도합니다.");
            }
        }
    }

    public async Task<RetentionResult> RunOnceAsync(CancellationToken ct = default)
    {
        using var scope = scopes.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var now = time.GetUtcNow();

        // ① 코드 만료 (후보 고르기 → 후보마다 조건부 UPDATE)
        var expired = await ExpireAsync(db, await FindExpiryCandidatesAsync(db, now, ct), now, ct);

        // ② 7일이 지난 후원: 이미지 파일과 행을 지운다 (개인정보 최소 보관)
        var deleteBefore = now - KeepFor;
        var old = await db.Donations.Where(d => d.CreatedAt < deleteBefore).ToListAsync(ct);
        foreach (var donation in old)
        {
            await storage.DeleteAsync(donation.ImageFile, ct);
        }
        db.Donations.RemoveRange(old);
        await db.SaveChangesAsync(ct);
        await db.DonationEvents.Where(e => e.ReceivedAt < deleteBefore).ExecuteDeleteAsync(ct);

        // ③ 저장 도중 실패 등으로 DB에 없는 오래된 파일
        var deletedFiles = await storage.DeleteOlderThanAsync(deleteBefore, ct);

        return new RetentionResult(expired, old.Count, deletedFiles);
    }

    // 만료 후보: 30분이 지났는데 아직 AwaitingCheese인 후원의 ID (추적하지 않고 ID만 읽는다)
    public static Task<List<int>> FindExpiryCandidatesAsync(AppDbContext db, DateTimeOffset now, CancellationToken ct = default)
    {
        var expireBefore = now - DonationCodeMatcher.CodeLifetime;
        return db.Donations.AsNoTracking()
            .Where(d => d.Status == DonationStatus.AwaitingCheese && d.CreatedAt < expireBefore)
            .Select(d => d.Id)
            .ToListAsync(ct);
    }

    // 후보마다 "아직 AwaitingCheese일 때만" Expired로 바꾼다.
    // 후보를 고른 뒤 그 사이에 치즈 후원이 매칭되어 Pending이 됐다면 0행이 바뀌므로 덮어쓰지 않는다(시청자가 낸 후원을 지키기).
    // 실제로 바뀐 후원만 이미지를 지우고 대시보드에 알린다. 바꾼 개수를 돌려준다
    public async Task<int> ExpireAsync(AppDbContext db, IEnumerable<int> candidateIds, DateTimeOffset now, CancellationToken ct = default)
    {
        var expireBefore = now - DonationCodeMatcher.CodeLifetime;
        var expired = 0;
        foreach (var id in candidateIds)
        {
            var changed = await db.Donations
                .Where(d => d.Id == id && d.Status == DonationStatus.AwaitingCheese && d.CreatedAt < expireBefore)
                .ExecuteUpdateAsync(s => s.SetProperty(d => d.Status, DonationStatus.Expired).SetProperty(d => d.UpdatedAt, now), ct);
            if (changed != 1) continue;

            var donation = await db.Donations.AsNoTracking().SingleAsync(d => d.Id == id, ct);
            await storage.DeleteAsync(donation.ImageFile, ct); // 방송에 나가지 않으므로 이미지도 지운다
            await dashboard.Clients.Group(DashboardHub.GroupName(donation.StreamerId)).DonationUpdated(DonationDto.From(donation));
            expired++;
        }
        return expired;
    }
}
