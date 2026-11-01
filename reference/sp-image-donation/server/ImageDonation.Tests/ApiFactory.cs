using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using ImageDonation.Api.Dtos;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace ImageDonation.Tests;

// 통합 테스트용 앱: 진짜 Program.cs를 메모리 안에서 실행한다.
// DB는 TEST_DATABASE_URL의 PostgreSQL에 "테스트마다 새 스키마"를 만들어 쓰고, 끝나면 스키마째 지운다.
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    public const string Password = "Test-Passw0rd!";

    public static readonly string BaseConnectionString =
        Environment.GetEnvironmentVariable("TEST_DATABASE_URL")
        ?? "Host=127.0.0.1;Port=5432;Database=image_donation_test;Username=wzh;Password=wzh";

    public static readonly JsonSerializerOptions Json = new(JsonSerializerDefaults.Web) { Converters = { new JsonStringEnumConverter() } };

    private readonly int _donationsPerMinute;
    private readonly Action<IServiceCollection>? _replaceServices;

    // replaceServices: 테스트에서 서비스 하나를 가짜로 바꿀 때 (예: 지우기가 실패하는 저장소)
    public ApiFactory(int donationsPerMinute = 1000, Action<IServiceCollection>? replaceServices = null)
    {
        _donationsPerMinute = donationsPerMinute;
        _replaceServices = replaceServices;
        using var connection = new NpgsqlConnection(BaseConnectionString);
        connection.Open();
        using var command = new NpgsqlCommand($"CREATE SCHEMA \"{Schema}\"", connection);
        command.ExecuteNonQuery();
    }

    public string Schema { get; } = "test_" + Guid.NewGuid().ToString("N")[..12];

    public string MediaPath { get; } = Path.Combine(Path.GetTempPath(), $"image-donation-test-{Guid.NewGuid():N}");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:Default", $"{BaseConnectionString};Search Path={Schema}");
        builder.UseSetting("Storage:MediaPath", MediaPath);
        builder.UseSetting("Security:IpHashKey", "test-only-ip-hash-key");
        builder.UseSetting("RateLimit:DonationsPerMinute", _donationsPerMinute.ToString());
        builder.UseSetting("Retention:IntervalSeconds", "3600"); // 테스트 중에는 자동 정리가 돌지 않게
        if (_replaceServices is not null)
        {
            builder.ConfigureTestServices(_replaceServices); // 앱이 등록한 뒤에 덮어쓴다
        }
    }

    // 개발용 로컬 계정으로 가입·로그인하고 온보딩까지 마친 클라이언트(쿠키 유지)
    public async Task<HttpClient> CreateStreamerClientAsync(string slug)
    {
        var client = CreateClient();
        var email = $"{slug}@test.local";
        (await client.PostAsJsonAsync("/api/auth/register", new { email, password = Password })).EnsureSuccessStatusCode();
        (await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email, password = Password })).EnsureSuccessStatusCode();
        (await client.PostAsJsonAsync("/api/auth/onboarding", new { slug, displayName = $"{slug} 방송" })).EnsureSuccessStatusCode();
        return client;
    }

    public static async Task<string> GetOverlayTokenAsync(HttpClient streamer)
    {
        var response = await streamer.GetFromJsonAsync<OverlayTokenResponse>("/api/dashboard/overlay-token", Json);
        return response!.OverlayToken;
    }

    public static async Task UpdateSettingsAsync(HttpClient streamer, Func<SettingsDto, SettingsDto> change)
    {
        var current = await streamer.GetFromJsonAsync<SettingsDto>("/api/dashboard/settings", Json);
        (await streamer.PutAsJsonAsync("/api/dashboard/settings", change(current!), Json)).EnsureSuccessStatusCode();
    }

    // 시청자 후원(multipart/form-data)
    public static MultipartFormDataContent DonationForm(byte[] image, string nickname = "시청자", string message = "안녕하세요", string fileName = "photo.png")
    {
        var file = new ByteArrayContent(image);
        file.Headers.ContentType = new MediaTypeHeaderValue("image/png");
        return new MultipartFormDataContent
        {
            { file, "image", fileName },
            { new StringContent(nickname), "nickname" },
            { new StringContent(message), "message" },
        };
    }

    // 오버레이 SignalR 연결: 실제 OBS처럼 웹소켓으로 붙는다 (TestServer 안의 가짜 웹소켓)
    public HubConnection CreateOverlayConnection(string token) =>
        new HubConnectionBuilder()
            .WithUrl(new Uri(Server.BaseAddress, $"/hubs/overlay?token={Uri.EscapeDataString(token)}"), o =>
            {
                o.Transports = HttpTransportType.WebSockets;
                o.HttpMessageHandlerFactory = _ => Server.CreateHandler(); // 협상(negotiate) 요청
                o.WebSocketFactory = (context, ct) => new ValueTask<System.Net.WebSockets.WebSocket>(
                    Server.CreateWebSocketClient().ConnectAsync(context.Uri, ct));
            })
            .AddJsonProtocol(o => o.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
            .Build();

    // 오버레이를 연결하고, 서버가 그룹 가입(OnConnectedAsync)까지 끝냈음을 확인한다.
    // SignalR은 연결 응답을 먼저 보내고 OnConnectedAsync를 나중에 실행하므로 StartAsync만으로는 그룹 가입이 끝났다고 볼 수 없다.
    // 허브 메서드 호출은 OnConnectedAsync가 끝난 뒤에 처리되므로, 아무 일도 하지 않는 호출(없는 후원 0번의 MarkShown)을 한 번 보내고 기다린다
    public static async Task StartOverlayAsync(HubConnection overlay)
    {
        await overlay.StartAsync();
        await overlay.InvokeAsync("MarkShown", 0);
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        NpgsqlConnection.ClearAllPools();
        await using var connection = new NpgsqlConnection(BaseConnectionString);
        await connection.OpenAsync();
        await using var command = new NpgsqlCommand($"DROP SCHEMA IF EXISTS \"{Schema}\" CASCADE", connection);
        await command.ExecuteNonQueryAsync();
        if (Directory.Exists(MediaPath)) Directory.Delete(MediaPath, recursive: true);
    }
}
