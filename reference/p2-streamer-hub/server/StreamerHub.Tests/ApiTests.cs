using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using StreamerHub.Api.Dtos;

namespace StreamerHub.Tests;

// API 통합 테스트 (Day 36): 요청을 보내고 상태 코드와 JSON을 확인해요.
// 테스트마다 TestApp을 새로 만들어서 DB와 요청 제한이 서로 섞이지 않게 해요.
public class ApiTests
{
    [Fact]
    public async Task Anonymous_CannotCreatePost_401()
    {
        using var app = new TestApp();
        var client = app.CreateClient(); // 로그인하지 않은 사람

        var response = await client.PostAsJsonAsync("/api/posts", new { title = "제목", body = "내용" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Register_Login_CreatePost_201()
    {
        using var app = new TestApp();
        var client = app.CreateClient();

        // 1) 가입
        var register = await client.PostAsJsonAsync("/api/auth/register", new { email = "fan@test.local", password = TestApp.FanPassword });
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        // 2) 쿠키 로그인: HttpOnly + SameSite=Lax 쿠키를 받아요
        var login = await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email = "fan@test.local", password = TestApp.FanPassword });
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        var cookie = Assert.Single(login.Headers.GetValues("Set-Cookie"));
        Assert.Contains("httponly", cookie, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=lax", cookie, StringComparison.OrdinalIgnoreCase);

        // 3) 글쓰기: 201 Created + Location 헤더
        var create = await client.PostAsJsonAsync("/api/posts", new { title = "첫 글", body = "반가워요" });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var post = await create.Content.ReadFromJsonAsync<PostDetail>();
        Assert.NotNull(post);
        Assert.Equal("첫 글", post.Title);
        Assert.True(post.CanEdit);
        Assert.Equal($"/api/posts/{post.Id}", create.Headers.Location?.ToString());

        // 4) 내 정보: 가입한 이메일이 나와요
        var me = await client.GetFromJsonAsync<MeResponse>("/api/me");
        Assert.Equal("fan@test.local", me?.Email);
        Assert.Empty(me!.Roles);
    }

    [Fact]
    public async Task NonAdmin_CannotCreateStreamer_403()
    {
        using var app = new TestApp();
        var fan = await app.CreateFanClientAsync("fan@test.local");

        var response = await fan.PostAsJsonAsync("/api/streamers", NewStreamer("팬이 만든 스트리머"));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CreatesStreamer_201()
    {
        using var app = new TestApp();
        var admin = await app.CreateAdminClientAsync();

        var response = await admin.PostAsJsonAsync("/api/streamers", NewStreamer("테스트곰"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<StreamerResponse>();
        Assert.NotNull(created);
        Assert.Equal($"/api/streamers/{created.Id}", response.Headers.Location?.ToString());

        // 로그인하지 않은 사람도 검색해서 볼 수 있어요
        var list = await app.CreateClient().GetFromJsonAsync<List<StreamerResponse>>("/api/streamers?q=테스트");
        var found = Assert.Single(list!);
        Assert.Equal(created.Id, found.Id);
    }

    [Fact]
    public async Task Admin_CreateStreamer_EmptyName_400()
    {
        using var app = new TestApp();
        var admin = await app.CreateAdminClientAsync();

        var response = await admin.PostAsJsonAsync("/api/streamers", NewStreamer(""));

        // AddValidation()이 DTO의 [Required]를 보고 400 + ProblemDetails를 돌려줘요
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var errors = problem.RootElement.GetProperty("errors");
        Assert.True(errors.TryGetProperty("Name", out _), errors.ToString());
    }

    [Fact]
    public async Task Posts_Paginate()
    {
        using var app = new TestApp();
        var writer = await app.CreateFanClientAsync("writer@test.local");
        for (var i = 1; i <= 25; i++)
        {
            var created = await writer.PostAsJsonAsync("/api/posts", new { title = $"글 {i}", body = "내용" });
            Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        }
        var anonymous = app.CreateClient();

        var page1 = await anonymous.GetFromJsonAsync<PagedResult<PostListItem>>("/api/posts?page=1&pageSize=10");
        Assert.NotNull(page1);
        Assert.Equal(25, page1.Total);
        Assert.Equal(1, page1.Page);
        Assert.Equal(10, page1.PageSize);
        Assert.Equal(10, page1.Items.Count);
        Assert.Equal("글 25", page1.Items.First().Title); // 최신 글이 맨 앞

        var page3 = await anonymous.GetFromJsonAsync<PagedResult<PostListItem>>("/api/posts?page=3&pageSize=10");
        Assert.NotNull(page3);
        Assert.Equal(5, page3.Items.Count);
        Assert.Equal("글 1", page3.Items.Last().Title);

        // 한 번에 너무 많이 달라고 하면 400
        var tooMany = await anonymous.GetAsync("/api/posts?page=1&pageSize=1000");
        Assert.Equal(HttpStatusCode.BadRequest, tooMany.StatusCode);
    }

    [Fact]
    public async Task Notice_Stream_Sends_Event()
    {
        using var app = new TestApp();
        var admin = await app.CreateAdminClientAsync();
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));

        // 1) 관리자가 첫 공지를 올려요
        var first = await admin.PostAsJsonAsync("/api/notices", new { message = "첫 공지" }, timeout.Token);
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        // 2) 오버레이(시청자)가 스트림에 연결하면 지금 공지가 바로 와요
        var viewer = app.CreateClient();
        using var response = await viewer.GetAsync("/api/notices/stream", HttpCompletionOption.ResponseHeadersRead, timeout.Token);
        Assert.Equal("text/event-stream", response.Content.Headers.ContentType?.MediaType);
        using var reader = new StreamReader(await response.Content.ReadAsStreamAsync(timeout.Token));
        var current = await ReadEventAsync(reader, timeout.Token);
        Assert.Equal("notice", current.EventType);
        Assert.Equal("첫 공지", current.Data.GetProperty("message").GetString());

        // 3) 연결된 채로 새 공지를 올리면 이벤트가 하나 더 와요
        var second = await admin.PostAsJsonAsync("/api/notices", new { message = "10분 뒤 방송 시작!" }, timeout.Token);
        Assert.Equal(HttpStatusCode.Created, second.StatusCode);
        var next = await ReadEventAsync(reader, timeout.Token);
        Assert.Equal("notice", next.EventType);
        Assert.Equal("10분 뒤 방송 시작!", next.Data.GetProperty("message").GetString());
    }

    [Fact]
    public async Task RateLimit_Returns429()
    {
        // 이 테스트만 "1분에 3번"으로 줄여요
        using var app = new TestApp(permitLimit: 3);
        var client = app.CreateClient();

        var statusCodes = new List<HttpStatusCode>();
        for (var i = 0; i < 4; i++)
        {
            // 틀린 비밀번호로 로그인을 계속 시도한다 (무차별 대입 흉내)
            var response = await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email = "nobody@test.local", password = "Wrong-Passw0rd!" });
            statusCodes.Add(response.StatusCode);
            if (response.StatusCode == HttpStatusCode.TooManyRequests)
            {
                Assert.Equal("application/problem+json", response.Content.Headers.ContentType?.MediaType);
            }
        }

        Assert.Equal(
            new[] { HttpStatusCode.Unauthorized, HttpStatusCode.Unauthorized, HttpStatusCode.Unauthorized, HttpStatusCode.TooManyRequests },
            statusCodes);
    }

    // ---------- 도우미 ----------

    private static StreamerRequest NewStreamer(string name) => new()
    {
        Name = name,
        Platform = "chzzk",
        ChannelUrl = "https://example.com/testbear",
        Bio = "테스트용 스트리머예요.",
    };

    // SSE 이벤트 하나("event: ..." / "data: ..." / 빈 줄)를 읽어요.
    private static async Task<(string EventType, JsonElement Data)> ReadEventAsync(StreamReader reader, CancellationToken token)
    {
        var eventType = "";
        var data = "";
        while (true)
        {
            var line = await reader.ReadLineAsync(token) ?? throw new InvalidOperationException("스트림이 끝났어요.");
            if (line == "") break; // 빈 줄 = 이벤트 하나 끝
            if (line.StartsWith("event: ")) eventType = line["event: ".Length..];
            if (line.StartsWith("data: ")) data = line["data: ".Length..];
        }
        using var json = JsonDocument.Parse(data);
        return (eventType, json.RootElement.Clone());
    }
}
