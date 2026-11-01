using System.Security.Claims;
using ImageDonation.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Data;

// IdentityDbContext: 로그인 계정 테이블(AspNetUsers 등)과 우리 테이블을 한 DB에 둔다
public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Streamer> Streamers => Set<Streamer>();
    public DbSet<StreamerSettings> StreamerSettings => Set<StreamerSettings>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<DonationEvent> DonationEvents => Set<DonationEvent>();
    public DbSet<ChzzkToken> ChzzkTokens => Set<ChzzkToken>();
    public DbSet<BlockEntry> BlockEntries => Set<BlockEntry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder); // Identity 테이블 설정을 먼저 적용

        builder.Entity<Streamer>(s =>
        {
            s.Property(x => x.Slug).HasMaxLength(30);
            s.Property(x => x.DisplayName).HasMaxLength(40);
            s.HasIndex(x => x.Slug).IsUnique();         // 후원 페이지 주소는 겹치면 안 된다
            s.HasIndex(x => x.OverlayToken).IsUnique();
            s.HasIndex(x => x.UserId).IsUnique();       // 계정 1개 = 스트리머 1명
            s.HasOne(x => x.Settings).WithOne().HasForeignKey<StreamerSettings>(x => x.StreamerId);
        });

        builder.Entity<StreamerSettings>(s =>
        {
            s.HasKey(x => x.StreamerId);
            s.Property(x => x.Mode).HasConversion<string>(); // DB에 "Free"/"Cheese" 글자로 저장
            // BannedWords(string[])는 PostgreSQL의 text[] 배열 열이 된다
        });

        builder.Entity<Donation>(d =>
        {
            d.Property(x => x.Status).HasConversion<string>();
            d.Property(x => x.Nickname).HasMaxLength(20);
            d.Property(x => x.Message).HasMaxLength(100);
            d.Property(x => x.Code).HasMaxLength(5);
            d.HasIndex(x => new { x.StreamerId, x.Status }); // 대기열 조회를 빠르게
            d.HasIndex(x => x.CreatedAt);                     // 보관 기간 정리를 빠르게
        });

        builder.Entity<DonationEvent>(e => e.HasIndex(x => x.ReceivedAt));

        builder.Entity<ChzzkToken>(t =>
        {
            t.HasKey(x => x.UserId);
            t.HasIndex(x => x.ChannelId).IsUnique(); // 치지직 채널 1개는 계정 1개에만 연결
        });

        builder.Entity<BlockEntry>(b => b.HasIndex(x => new { x.StreamerId, x.SenderIpHash }));
    }

    // 로그인한 사용자의 스트리머 정보(설정 포함). 온보딩 전이면 null
    public Task<Streamer?> FindStreamerAsync(ClaimsPrincipal user, CancellationToken ct = default)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Streamers.Include(s => s.Settings).FirstOrDefaultAsync(s => s.UserId == userId, ct);
    }
}
