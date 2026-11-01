using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Data;

// 앱이 시작할 때 한 번 실행해서 DB를 준비해요 (Day 21, 26)
public static class SeedData
{
    public const string AdminRole = "Admin";

    public static async Task InitializeAsync(IServiceProvider services)
    {
        // DbContext·UserManager는 "요청 하나마다" 쓰는(Scoped) 서비스예요.
        // 지금은 요청이 없으니 범위(scope)를 직접 만들어서 꺼내 써요.
        using var scope = services.CreateScope();
        var provider = scope.ServiceProvider;
        var db = provider.GetRequiredService<AppDbContext>();

        // 1) 아직 적용하지 않은 마이그레이션을 적용해요. DB 파일이 없으면 새로 만들어요 (Day 20)
        await db.Database.MigrateAsync();

        // 2) 관리자 역할과 관리자 계정
        await EnsureAdminAsync(provider);

        // 3) 처음 실행이면 예시 스트리머와 방송 일정
        await AddSampleStreamersAsync(db);
    }

    private static async Task EnsureAdminAsync(IServiceProvider provider)
    {
        var roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = provider.GetRequiredService<UserManager<AppUser>>();
        var configuration = provider.GetRequiredService<IConfiguration>();
        var logger = provider.GetRequiredService<ILoggerFactory>().CreateLogger("SeedData");

        if (!await roleManager.RoleExistsAsync(AdminRole))
        {
            await roleManager.CreateAsync(new IdentityRole(AdminRole));
        }

        // 관리자 이메일·비밀번호는 코드나 appsettings.json에 쓰지 않고 "설정"에서 읽어요.
        // 개발 PC: dotnet user-secrets set "Admin:Email" "..."  /  테스트·배포: 환경 변수 Admin__Email, Admin__Password
        var email = configuration["Admin:Email"];
        var password = configuration["Admin:Password"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("Admin:Email과 Admin:Password 설정이 없어서 관리자 계정을 만들지 않았어요.");
            return;
        }

        var admin = await userManager.FindByEmailAsync(email);
        if (admin is null)
        {
            admin = new AppUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true,
                DisplayName = "관리자",
            };
            var result = await userManager.CreateAsync(admin, password); // 비밀번호는 해싱해서 저장돼요
            if (!result.Succeeded)
            {
                // 비밀번호 규칙(6자 이상, 영어 대문자·소문자·숫자·기호 각 1개 이상)에 맞지 않으면 여기로 와요
                var reasons = string.Join(" ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"관리자 계정을 만들지 못했어요: {reasons}");
            }
            logger.LogInformation("관리자 계정 {Email}을(를) 만들었어요.", email);
        }

        if (!await userManager.IsInRoleAsync(admin, AdminRole))
        {
            await userManager.AddToRoleAsync(admin, AdminRole);
        }
    }

    private static async Task AddSampleStreamersAsync(AppDbContext db)
    {
        if (await db.Streamers.AnyAsync())
        {
            return; // 이미 데이터가 있으면 건너뛰어요
        }

        var now = DateTime.UtcNow;
        var todayUtc = now.Date; // 오늘 0시(UTC). UTC 11시 = 한국 20시, UTC 4시 = 한국 13시

        var streamers = new List<Streamer>
        {
            new Streamer
            {
                Name = "달빛곰",
                Platform = "chzzk",
                ChannelUrl = "https://example.com/moonbear",
                Bio = "밤마다 느긋하게 게임하는 곰이에요. 채팅 환영!",
                CreatedAt = now,
                Schedules = new List<Schedule>
                {
                    new Schedule { Title = "저녁 게임 방송", StartsAt = todayUtc.AddDays(1).AddHours(11), DurationMinutes = 120 },
                    new Schedule { Title = "시청자 참여 게임", StartsAt = todayUtc.AddDays(3).AddHours(11), DurationMinutes = 90 },
                },
            },
            new Streamer
            {
                Name = "픽셀토끼",
                Platform = "youtube",
                ChannelUrl = "https://example.com/pixelrabbit",
                Bio = "도트 그림을 그리면서 이야기 나누는 토끼예요.",
                CreatedAt = now,
                Schedules = new List<Schedule>
                {
                    new Schedule { Title = "점심 그림 방송", StartsAt = todayUtc.AddDays(2).AddHours(4), DurationMinutes = 60 },
                },
            },
            new Streamer
            {
                Name = "노을고양이",
                Platform = "soop",
                ChannelUrl = "https://example.com/sunsetcat",
                Bio = "노래와 수다를 좋아하는 고양이예요.",
                CreatedAt = now,
                Schedules = new List<Schedule>
                {
                    new Schedule { Title = "노래 방송", StartsAt = todayUtc.AddDays(4).AddHours(13), DurationMinutes = 120 },
                },
            },
        };

        db.Streamers.AddRange(streamers);
        await db.SaveChangesAsync();
    }
}
