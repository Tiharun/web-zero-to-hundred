using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Endpoints;
using StreamerHub.Api.Entities;
using StreamerHub.Api.Services;

// ===== 스트리머 허브 서버의 시작점 =====
// 1부: 서비스 등록(builder.Services) → 2부: 요청이 지나가는 순서(app.Use...) → 3부: 주소 연결(app.Map...)

var builder = WebApplication.CreateBuilder(args);

// ---------- 1부: 서비스 등록 ----------

// 데이터베이스 (Day 20). 연결 문자열은 appsettings.json의 ConnectionStrings:Default
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// 가입·로그인 (Day 25): Identity API 엔드포인트 + 역할(Admin, Day 26) + 사용자 정보를 EF Core(DB)에 저장
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>();

// 로그인 쿠키 (Day 34): 자바스크립트로 읽을 수 없게(HttpOnly), 다른 사이트가 보낸 요청에는 붙지 않게(SameSite=Lax)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
});

// 권한 (Day 26): "Admin" 정책 = Admin 역할이 있는 사용자만
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", policy => policy.RequireRole(SeedData.AdminRole));

// 요청 검증 (Day 23): DTO의 [Required] 같은 특성을 보고, 틀리면 엔드포인트를 실행하지 않고 400을 보내요
builder.Services.AddValidation();

// 오류 응답을 ProblemDetails(JSON) 모양으로 통일해요 (Day 24)
builder.Services.AddProblemDetails();

// 요청 제한 (Day 34): 같은 IP에서 정해진 시간(창) 동안 정해진 횟수까지만 받아요. 넘으면 429
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("write", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown", // IP마다 따로 세요
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = builder.Configuration.GetValue<int>("RateLimit:PermitLimit"),
                Window = TimeSpan.FromSeconds(builder.Configuration.GetValue<int>("RateLimit:WindowSeconds")),
            }));
});

// 우리가 만든 서비스 (Day 23). Scoped = 요청마다 새로 만들어요, Singleton = 앱 전체에 하나만
builder.Services.AddScoped<PostService>();
builder.Services.AddSingleton<NoticeBroadcaster>();

var app = builder.Build();

// DB 마이그레이션 적용 + 관리자 계정·예시 데이터 준비
await SeedData.InitializeAsync(app.Services);

// ---------- 2부: 요청이 지나가는 순서 (미들웨어) ----------

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(); // 처리하지 못한 예외 → 500 ProblemDetails (개발 중에는 자세한 오류 화면이 대신 나와요)
}
app.UseStatusCodePages();  // 본문 없는 401·403·404·429 응답에 ProblemDetails 본문을 채워요
app.UseStaticFiles();      // wwwroot 폴더의 파일(빌드한 클라이언트)을 그대로 보내요 (Day 38)
app.UseAuthentication();   // 쿠키를 보고 "누구인지" 알아내요
app.UseAuthorization();    // "이 일을 해도 되는지" 확인해요
app.UseRateLimiter();      // 너무 많은 요청은 429로 막아요

// ---------- 3부: 주소 연결 ----------

app.MapStreamerEndpoints();
app.MapScheduleEndpoints();
app.MapPostEndpoints();
app.MapNoticeEndpoints();
app.MapAuthEndpoints();

// 없는 /api/... 주소는 404 (아래의 index.html로 넘어가지 않게 먼저 막아요)
app.Map("/api/{**rest}", () => TypedResults.NotFound());

// 그 밖의 주소는 클라이언트(index.html)에게 맡겨요 (Day 38)
app.MapFallbackToFile("index.html");

app.Run();
