using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using ImageDonation.Api.Data;
using ImageDonation.Api.Endpoints;
using ImageDonation.Api.Hubs;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Events;
using ImageDonation.Api.Services.Storage;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// ── 비밀 값은 user-secrets(개발) 또는 환경 변수(Docker)로 넣는다. appsettings.json에는 두지 않는다
var connectionString = config.GetConnectionString("Default")
    ?? throw new InvalidOperationException("ConnectionStrings:Default가 없어요. README의 'user-secrets 설정'을 보세요.");
if (string.IsNullOrEmpty(config["Security:IpHashKey"]))
{
    throw new InvalidOperationException("Security:IpHashKey가 없어요. README의 'user-secrets 설정'을 보세요.");
}

// ── 데이터베이스: PostgreSQL + EF Core (Npgsql)
builder.Services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));

// ── 로그인: 개발용 로컬 계정(Identity)과 치지직 로그인이 같은 쿠키를 쓴다
builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<AppDbContext>();

// ── 암호화 키(Data Protection): 로그인 쿠키와 치지직 토큰 암호화에 쓴다.
//    키를 폴더에 보관해야 재시작(컨테이너 재생성) 후에도 쿠키·토큰을 다시 읽을 수 있다
var dataProtection = builder.Services.AddDataProtection().SetApplicationName("ImageDonation");
if (config["DataProtection:KeysPath"] is { Length: > 0 } keysPath)
{
    dataProtection.PersistKeysToFileSystem(new DirectoryInfo(keysPath));
}

// ── JSON: enum을 숫자 대신 "Pending" 같은 글자로 주고받는다
builder.Services.ConfigureHttpJsonOptions(o => o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddValidation(); // public record의 [Range]·[MaxLength] 등을 검사해 틀리면 400

// ── 실시간: SignalR (오버레이 허브, 대시보드 허브)
builder.Services.AddSignalR()
    .AddJsonProtocol(o => o.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// ── 요청 제한: 같은 IP에서 1분에 너무 많이 보내면 429
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddPolicy("donations", http => PerIpPerMinute(http, config.GetValue("RateLimit:DonationsPerMinute", 5)));
    o.AddPolicy("auth", http => PerIpPerMinute(http, config.GetValue("RateLimit:AuthPerMinute", 20)));
});

// ── 업로드: multipart 본문 전체 상한 (스트리머별 한도는 PublicEndpoints에서 따로 검사)
builder.Services.Configure<FormOptions>(o => o.MultipartBodyLengthLimit = PublicEndpoints.MaxUploadBytes + 64 * 1024);

// ── 우리 서비스
builder.Services.TryAddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ImageProcessor>();
builder.Services.AddSingleton<IImageStorage, LocalImageStorage>();
builder.Services.AddScoped<DonationService>();
builder.Services.AddSingleton<RetentionService>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<RetentionService>());

// ── 치지직 Open API (설정 섹션 "Chzzk". ClientSecret은 user-secrets/환경 변수에만)
builder.Services.Configure<ChzzkOptions>(config.GetSection("Chzzk"));
builder.Services.AddHttpClient<ChzzkApiClient>((sp, http) =>
    http.BaseAddress = new Uri(sp.GetRequiredService<IOptions<ChzzkOptions>>().Value.ApiBaseUrl));

// ── 후원 이벤트 출처 두 가지: 진짜(치지직 세션 소켓)와 가짜(테스트 모드)
builder.Services.AddSingleton<ChzzkSessionSource>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<ChzzkSessionSource>());
builder.Services.AddSingleton<FakeDonationSource>();
builder.Services.AddSingleton<IDonationEventSource>(sp => sp.GetRequiredService<ChzzkSessionSource>());
builder.Services.AddSingleton<IDonationEventSource>(sp => sp.GetRequiredService<FakeDonationSource>());

builder.Services.AddHealthChecks();

var app = builder.Build();

// 시작할 때 DB 마이그레이션을 적용한다 (처음이면 테이블을 만든다)
using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();
}

// 모든 후원 이벤트 출처를 같은 처리기(DonationService)에 연결한다
foreach (var source in app.Services.GetServices<IDonationEventSource>())
{
    source.DonationReceived += async evt =>
    {
        using var scope = app.Services.CreateScope(); // 이벤트마다 새 DbContext
        await scope.ServiceProvider.GetRequiredService<DonationService>().HandleCheeseEventAsync(evt);
    };
}

// 보안 헤더 (모든 응답)
app.Use(async (http, next) =>
{
    http.Response.Headers.XContentTypeOptions = "nosniff";    // 브라우저가 파일 형식을 멋대로 추측하지 않게
    http.Response.Headers.XFrameOptions = "DENY";             // 다른 사이트가 우리 화면을 iframe에 넣지 못하게
    http.Response.Headers["Referrer-Policy"] = "no-referrer"; // 오버레이 주소(토큰)가 다른 사이트로 새지 않게
    await next(http);
});

app.UseDefaultFiles(); // "/" → index.html
app.UseStaticFiles();  // wwwroot(React 빌드 결과: index.html, overlay.html, assets) 제공

app.UseAuthentication();
app.UseAuthorization();
app.UseRateLimiter();

// 오버레이 허브는 로그인 대신 토큰으로 들어온다: 허브에 닿기 전에 토큰부터 확인한다(틀리면 401)
app.UseWhen(http => http.Request.Path.StartsWithSegments("/hubs/overlay"), branch => branch.Use(OverlayHub.CheckTokenAsync));

app.MapHealthChecks("/healthz");
app.MapAuthEndpoints(config.GetValue("Auth:LocalLoginEnabled", true));
app.MapChzzkEndpoints();
app.MapPublicEndpoints();
app.MapDashboardEndpoints();
app.MapTestModeEndpoints();
app.MapHub<OverlayHub>("/hubs/overlay");
app.MapHub<DashboardHub>("/hubs/dashboard");

app.MapFallback("/api/{**path}", () => Results.NotFound()); // 없는 API 주소는 404
app.MapFallbackToFile("index.html");                         // /d/내주소, /dashboard 등 React 화면은 index.html

app.Run();

// IP 하나당 1분에 limit번까지 (테스트 서버처럼 IP를 모르면 "unknown" 하나로 묶인다)
static RateLimitPartition<string> PerIpPerMinute(HttpContext http, int limit) =>
    RateLimitPartition.GetFixedWindowLimiter(
        http.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = limit, Window = TimeSpan.FromMinutes(1) });
