using ImageDonation.Api.Data;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ImageDonation.Tests;

public class RetentionTests
{
    [Fact]
    public async Task Retention_DeletesOldFiles()
    {
        await using var app = new ApiFactory();
        await app.CreateStreamerClientAsync("keeper");
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var storage = scope.ServiceProvider.GetRequiredService<IImageStorage>();
        var streamerId = (await db.Streamers.SingleAsync()).Id;
        var now = DateTimeOffset.UtcNow;

        var oldFile = await storage.SaveAsync(TestImages.Png(), ".webp");
        var newFile = await storage.SaveAsync(TestImages.Png(), ".webp");
        var orphanFile = await storage.SaveAsync(TestImages.Png(), ".webp"); // DB에 없는 오래된 파일
        File.SetLastWriteTimeUtc(Path.Combine(app.MediaPath, oldFile), now.AddDays(-8).UtcDateTime);
        File.SetLastWriteTimeUtc(Path.Combine(app.MediaPath, orphanFile), now.AddDays(-8).UtcDateTime);

        db.Donations.AddRange(
            new Donation { StreamerId = streamerId, Status = DonationStatus.Shown, Nickname = "old", ImageFile = oldFile, CreatedAt = now.AddDays(-8), UpdatedAt = now.AddDays(-8) },
            new Donation { StreamerId = streamerId, Status = DonationStatus.Shown, Nickname = "new", ImageFile = newFile, CreatedAt = now.AddDays(-1), UpdatedAt = now.AddDays(-1) });
        await db.SaveChangesAsync();

        var result = await app.Services.GetRequiredService<RetentionService>().RunOnceAsync();

        Assert.False(storage.Exists(oldFile));    // 7일이 지난 후원의 이미지
        Assert.False(storage.Exists(orphanFile)); // 7일이 지난, 주인 없는 파일
        Assert.True(storage.Exists(newFile));
        var left = await db.Donations.AsNoTracking().Select(d => d.Nickname).ToListAsync();
        Assert.Equal(["new"], left);
        Assert.Equal(1, result.DeletedDonations);
    }

    [Fact]
    public async Task Retention_ExpiresAwaitingCheeseAfter30Minutes()
    {
        await using var app = new ApiFactory();
        await app.CreateStreamerClientAsync("expirer");
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var streamerId = (await db.Streamers.SingleAsync()).Id;
        var now = DateTimeOffset.UtcNow;

        db.Donations.AddRange(
            new Donation { StreamerId = streamerId, Status = DonationStatus.AwaitingCheese, Nickname = "late", Code = "#LATE", CreatedAt = now.AddMinutes(-31), UpdatedAt = now },
            new Donation { StreamerId = streamerId, Status = DonationStatus.AwaitingCheese, Nickname = "fresh", Code = "#NEW1", CreatedAt = now.AddMinutes(-5), UpdatedAt = now });
        await db.SaveChangesAsync();

        var result = await app.Services.GetRequiredService<RetentionService>().RunOnceAsync();

        var statuses = await db.Donations.AsNoTracking().OrderBy(d => d.Nickname).Select(d => d.Status).ToListAsync();
        Assert.Equal([DonationStatus.AwaitingCheese, DonationStatus.Expired], statuses); // fresh, late 순
        Assert.Equal(1, result.ExpiredDonations);
    }

    [Fact]
    public async Task Retention_DoesNotExpireDonationMatchedInTheMeantime()
    {
        await using var app = new ApiFactory();
        await app.CreateStreamerClientAsync("racer");
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var storage = scope.ServiceProvider.GetRequiredService<IImageStorage>();
        var retention = app.Services.GetRequiredService<RetentionService>();
        var streamerId = (await db.Streamers.SingleAsync()).Id;
        var now = DateTimeOffset.UtcNow;

        var file = await storage.SaveAsync(TestImages.Png(), ".webp");
        var donation = new Donation
        {
            StreamerId = streamerId, Status = DonationStatus.AwaitingCheese, Nickname = "paid", Code = "#PAID",
            ImageFile = file, CreatedAt = now.AddMinutes(-31), UpdatedAt = now.AddMinutes(-31),
        };
        db.Donations.Add(donation);
        await db.SaveChangesAsync();

        // 1) 정리 작업이 만료 후보를 골랐다
        var candidates = await RetentionService.FindExpiryCandidatesAsync(db, now);
        Assert.Equal([donation.Id], candidates);

        // 2) 바로 그때 치즈 후원이 매칭되어 Pending이 됐다 (DonationService가 하는 조건부 UPDATE)
        await db.Donations.Where(d => d.Id == donation.Id && d.Status == DonationStatus.AwaitingCheese)
            .ExecuteUpdateAsync(s => s.SetProperty(d => d.Status, DonationStatus.Pending));

        // 3) 정리 작업이 이어서 만료를 시도해도, 매칭이 이긴다: 그대로 Pending, 이미지도 남는다
        Assert.Equal(0, await retention.ExpireAsync(db, candidates, now));
        Assert.Equal(DonationStatus.Pending, (await db.Donations.AsNoTracking().SingleAsync()).Status);
        Assert.True(storage.Exists(file));
    }
}
