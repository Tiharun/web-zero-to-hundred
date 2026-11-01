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
}
