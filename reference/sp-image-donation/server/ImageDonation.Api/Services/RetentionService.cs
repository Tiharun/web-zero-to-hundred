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
//   ① 30분 안에 치즈가 오지 않은 후원을 Expired로 바꾸고
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

        // ① 코드 만료: 이미지도 방송에 나가지 않으므로 바로 지운다
        var expireBefore = now - DonationCodeMatcher.CodeLifetime;
        var expired = await db.Donations
            .Where(d => d.Status == DonationStatus.AwaitingCheese && d.CreatedAt < expireBefore)
            .ToListAsync(ct);
        foreach (var donation in expired)
        {
            donation.Status = DonationStatus.Expired;
            donation.UpdatedAt = now;
            await storage.DeleteAsync(donation.ImageFile, ct);
        }
        await db.SaveChangesAsync(ct);
        foreach (var donation in expired)
        {
            await dashboard.Clients.Group(DashboardHub.GroupName(donation.StreamerId)).DonationUpdated(DonationDto.From(donation));
        }

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

        return new RetentionResult(expired.Count, old.Count, deletedFiles);
    }
}
