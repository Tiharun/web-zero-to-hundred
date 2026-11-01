using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Data;

// DB와 C#을 이어 주는 통로 (Day 20)
// IdentityDbContext를 물려받으면 사용자·역할 테이블(AspNetUsers, AspNetRoles ...)도 함께 생겨요 (Day 25)
public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet 하나 = 테이블 하나
    public DbSet<Streamer> Streamers => Set<Streamer>();
    public DbSet<Schedule> Schedules => Set<Schedule>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Notice> Notices => Set<Notice>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // SQLite에는 "이 시각은 UTC"라는 표시를 저장할 칸이 없어요.
        // 그래서 DB에서 읽어 올 때 모든 DateTime에 UTC 표시를 다시 붙여요.
        // (안 붙이면 JSON에 끝의 Z가 빠져서 브라우저가 한국 시간으로 잘못 읽어요. Day 29)
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
    }
}

// DB에 쓸 때는 그대로, 읽을 때는 Kind = Utc로 바꿔 주는 변환기
public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
{
    public UtcDateTimeConverter()
        : base(
            toDatabase => toDatabase,
            fromDatabase => DateTime.SpecifyKind(fromDatabase, DateTimeKind.Utc))
    {
    }
}
