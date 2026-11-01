using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;

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
    public async Task Admin_CreateStreamer_NonHttpUrl_400()
    {
        using var app = new TestApp();
        var admin = await app.CreateAdminClientAsync();
        var request = NewStreamer("주소가 이상한 스트리머") with { ChannelUrl = "javascript:alert(1)", AvatarUrl = "ftp://example.com/a.png" };

        var response = await admin.PostAsJsonAsync("/api/streamers", request);

        // 우리가 만든 [HttpUrl] 특성도 AddValidation()이 검사해요
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        using var problem = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var errors = problem.RootElement.GetProperty("errors");
        Assert.True(errors.TryGetProperty("ChannelUrl", out _), errors.ToString());
        Assert.True(errors.TryGetProperty("AvatarUrl", out _), errors.ToString());
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
            var response = await client.PostAsJsonAsync("/api/auth/login?useCookies=true", new { email = "nobody@test.local", password = TestApp.NewPassword() });
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

    [Fact]
    public async Task RateLimit_Posts_Returns429()
    {
        // 글쓰기 같은 보통 쓰기 요청에도 같은 제한이 걸려요. 1분에 5번으로 줄여서 확인해요
        using var app = new TestApp(permitLimit: 5);
        var fan = await app.CreateFanClientAsync("busy@test.local"); // 가입 1번 + 로그인 1번 = 이미 2번 썼어요 (같은 IP)

        var statusCodes = new List<HttpStatusCode>();
        for (var i = 1; i <= 4; i++)
        {
            var response = await fan.PostAsJsonAsync("/api/posts", new { title = $"도배 {i}", body = "내용" });
            statusCodes.Add(response.StatusCode);
        }

        // 남은 3번은 201, 그다음은 429
        Assert.Equal(
            new[] { HttpStatusCode.Created, HttpStatusCode.Created, HttpStatusCode.Created, HttpStatusCode.TooManyRequests },
            statusCodes);
    }

    // ---------- 게시판 권한: 본인 또는 관리자만 고치고 지울 수 있어요 (Day 30, 36) ----------

    [Fact]
    public async Task OtherUser_CannotUpdateOrDeletePost_403()
    {
        using var app = new TestApp();
        var author = await app.CreateFanClientAsync("author@test.local");
        var other = await app.CreateFanClientAsync("other@test.local");
        var postId = await CreatePostAsync(author, "작성자의 글");

        var update = await other.PutAsJsonAsync($"/api/posts/{postId}", new { title = "남이 고침", body = "남이 고침" });
        var delete = await other.DeleteAsync($"/api/posts/{postId}");

        Assert.Equal(HttpStatusCode.Forbidden, update.StatusCode);
        Assert.Equal(HttpStatusCode.Forbidden, delete.StatusCode);
        var post = await author.GetFromJsonAsync<PostDetail>($"/api/posts/{postId}");
        Assert.Equal("작성자의 글", post?.Title); // 그대로 남아 있어요
    }

    [Fact]
    public async Task Author_UpdatesPost_204()
    {
        using var app = new TestApp();
        var author = await app.CreateFanClientAsync("author@test.local");
        var postId = await CreatePostAsync(author, "처음 제목");

        var update = await author.PutAsJsonAsync($"/api/posts/{postId}", new { title = "고친 제목", body = "고친 내용" });

        Assert.Equal(HttpStatusCode.NoContent, update.StatusCode);
        var post = await author.GetFromJsonAsync<PostDetail>($"/api/posts/{postId}");
        Assert.Equal("고친 제목", post?.Title);
        Assert.NotNull(post?.UpdatedAt);
    }

    [Fact]
    public async Task Admin_DeletesAnyPost_204()
    {
        using var app = new TestApp();
        var author = await app.CreateFanClientAsync("author@test.local");
        var admin = await app.CreateAdminClientAsync();
        var postId = await CreatePostAsync(author, "관리자가 지울 글");

        var delete = await admin.DeleteAsync($"/api/posts/{postId}");

        Assert.Equal(HttpStatusCode.NoContent, delete.StatusCode);
        var gone = await author.GetAsync($"/api/posts/{postId}");
        Assert.Equal(HttpStatusCode.NotFound, gone.StatusCode);
    }

    // ---------- 관리자 시드: 먼저 가입해 둔 계정을 관리자로 올려 주지 않아요 (Day 26, 34) ----------

    [Fact]
    public async Task AdminSeed_DoesNotPromote_PreRegisteredAccountWithWrongPassword()
    {
        using var app = new TestApp();
        // 1) 누군가 "앞으로 관리자가 될 이메일"로 먼저 가입해 둬요 (가입은 누구나, 이메일 확인 없음)
        await app.CreateFanClientAsync("future-admin@test.local");

        // 2) 운영자가 그 이메일을 관리자로 설정하고 서버를 다시 켠 상황: 시드가 다른 비밀번호로 다시 돌아요
        using var scope = app.Services.CreateScope();
        await SeedData.EnsureAdminAsync(scope.ServiceProvider, "future-admin@test.local", TestApp.NewPassword());

        // 3) 비밀번호가 설정과 다르니 관리자로 올리지 않아요
        Assert.False(await IsAdminAsync(scope.ServiceProvider, "future-admin@test.local"));
    }

    [Fact]
    public async Task AdminSeed_Promotes_ExistingAccountWithMatchingPassword()
    {
        using var app = new TestApp();
        // 운영자 본인이 화면에서 먼저 가입했고, 설정에도 같은 비밀번호를 넣은 경우
        await app.CreateFanClientAsync("owner@test.local");

        using var scope = app.Services.CreateScope();
        await SeedData.EnsureAdminAsync(scope.ServiceProvider, "owner@test.local", TestApp.FanPassword);

        Assert.True(await IsAdminAsync(scope.ServiceProvider, "owner@test.local"));
    }

    // ---------- 도우미 ----------

    // 글을 하나 쓰고 그 글의 id를 돌려줘요
    private static async Task<int> CreatePostAsync(HttpClient client, string title)
    {
        var response = await client.PostAsJsonAsync("/api/posts", new { title, body = "내용" });
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var post = await response.Content.ReadFromJsonAsync<PostDetail>();
        return post!.Id;
    }

    // DB에서 직접 Admin 역할이 있는지 봐요 (로그인 쿠키가 아니라 저장된 값)
    private static async Task<bool> IsAdminAsync(IServiceProvider provider, string email)
    {
        var userManager = provider.GetRequiredService<UserManager<AppUser>>();
        var user = await userManager.FindByEmailAsync(email);
        Assert.NotNull(user);
        return await userManager.IsInRoleAsync(user, SeedData.AdminRole);
    }

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
