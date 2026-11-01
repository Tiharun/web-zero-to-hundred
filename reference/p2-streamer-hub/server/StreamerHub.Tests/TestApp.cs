using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;

namespace StreamerHub.Tests;

// 통합 테스트용 앱 (Day 36): 진짜 Program.cs를 메모리 안에서 실행해요.
// - DB: 이름 붙인 메모리 SQLite. 테스트마다 새 이름이라 서로 섞이지 않아요.
// - 관리자 계정·요청 제한 같은 값은 "설정"으로 넣어요. (실제 실행에서는 환경 변수·user-secrets로 넣는 값)
public sealed class TestApp : WebApplicationFactory<Program>
{
    public const string AdminEmail = "admin@test.local";

    // 비밀번호는 코드에 적어 두지 않고, 테스트를 실행할 때마다 새로 만들어요 (진짜 비밀번호를 코드에 쓰지 않는 습관)
    public static readonly string AdminPassword = NewPassword();
    public static readonly string FanPassword = NewPassword();

    // Identity 규칙(영어 대문자·소문자·숫자·기호, 6자 이상)에 맞는 무작위 비밀번호
    public static string NewPassword()
    {
        return $"Test-{Guid.NewGuid():N}-Aa1!";
    }

    private readonly string _connectionString;
    private readonly SqliteConnection _keepAlive;
    private readonly int _permitLimit;

    public TestApp(int permitLimit = 1000)
    {
        _permitLimit = permitLimit;

        // Mode=Memory;Cache=Shared: 같은 이름으로 연 연결끼리 메모리 DB 하나를 같이 써요.
        // 이 연결(_keepAlive)을 테스트가 끝날 때까지 열어 둬야 DB가 사라지지 않아요.
        _connectionString = $"Data Source=streamerhub-test-{Guid.NewGuid():N};Mode=Memory;Cache=Shared";
        _keepAlive = new SqliteConnection(_connectionString);
        _keepAlive.Open();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing"); // 개발자 PC의 user-secrets를 읽지 않게 해요
        builder.UseSetting("ConnectionStrings:Default", _connectionString);
        builder.UseSetting("Admin:Email", AdminEmail);
        builder.UseSetting("Admin:Password", AdminPassword);
        builder.UseSetting("RateLimit:PermitLimit", _permitLimit.ToString());
    }

    // 가입하고 쿠키로 로그인한 클라이언트를 만들어요.
    public async Task<HttpClient> CreateFanClientAsync(string email)
    {
        var client = CreateClient(); // 쿠키를 기억하는 HttpClient
        var register = await client.PostAsJsonAsync("/api/auth/register", new { email, password = FanPassword });
        register.EnsureSuccessStatusCode();
        await LoginAsync(client, email, FanPassword);
        return client;
    }

    // 관리자(설정의 Admin:Email/Admin:Password로 시드된 계정)로 로그인한 클라이언트
    public async Task<HttpClient> CreateAdminClientAsync()
    {
        var client = CreateClient();
        await LoginAsync(client, AdminEmail, AdminPassword);
        return client;
    }

    private static async Task LoginAsync(HttpClient client, string email, string password)
    {
        var login = await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email, password });
        login.EnsureSuccessStatusCode();
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _keepAlive.Dispose();
        }
    }
}
