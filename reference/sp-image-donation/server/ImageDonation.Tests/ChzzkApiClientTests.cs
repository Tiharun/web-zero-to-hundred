using ImageDonation.Api.Data;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ImageDonation.Tests;

// 토큰은 DB(ChzzkTokens)에 암호화되어 저장되므로, 실제 PostgreSQL 스키마를 쓰는 통합 테스트로 확인한다
public class ChzzkApiClientTests
{
    private const string UserId = "user-1";

    private readonly EphemeralDataProtectionProvider _protection = new(); // 두 클라이언트가 같은 키를 써야 서로의 암호문을 읽는다

    private ChzzkApiClient NewClient(StubChzzkHandler handler) => new(
        new HttpClient(handler) { BaseAddress = new Uri("https://openapi.chzzk.test") },
        Options.Create(new ChzzkOptions { ClientId = "client-id", ClientSecret = "client-secret" }),
        _protection,
        TimeProvider.System);

    // 토큰 1개를 DB에 넣는다 (만료 시각을 정해서)
    private async Task SeedTokenAsync(ApiFactory app, StubChzzkHandler handler, string refreshToken, DateTimeOffset expiresAt)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var token = new ChzzkToken { UserId = UserId, ChannelId = "channel-1", ChannelName = "채널" };
        NewClient(handler).StoreTokens(token, new ChzzkTokenResponse("a1", refreshToken, 86400));
        token.AccessTokenExpiresAt = expiresAt;
        db.ChzzkTokens.Add(token);
        await db.SaveChangesAsync();
    }

    private static async Task ExpireNowAsync(ApiFactory app)
    {
        using var scope = app.Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService<AppDbContext>().ChzzkTokens
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.AccessTokenExpiresAt, DateTimeOffset.UtcNow.AddMinutes(-1)));
    }

    private async Task<string> GetTokenAsync(ApiFactory app, StubChzzkHandler handler)
    {
        using var scope = app.Services.CreateScope();
        return await NewClient(handler).GetValidAccessTokenAsync(scope.ServiceProvider.GetRequiredService<AppDbContext>(), UserId);
    }

    [Fact]
    public async Task ChzzkApiClient_RefreshRotatesToken()
    {
        await using var app = new ApiFactory();
        var handler = new StubChzzkHandler();
        await SeedTokenAsync(app, handler, "r1", DateTimeOffset.UtcNow.AddDays(1));

        // 저장된 값은 암호화되어 있어서 원문과 다르다
        using (var scope = app.Services.CreateScope())
        {
            var stored = await scope.ServiceProvider.GetRequiredService<AppDbContext>().ChzzkTokens.SingleAsync();
            Assert.NotEqual("r1", stored.RefreshTokenProtected);
            Assert.Equal("r1", NewClient(handler).ReadRefreshToken(stored));
        }

        // 1) 아직 유효하면 갱신하지 않는다
        Assert.Equal("a1", await GetTokenAsync(app, handler));
        Assert.Empty(handler.UsedRefreshTokens);

        // 2) 만료되면 갱신하고, 새 Refresh Token(r2)을 DB에 저장해 둔다
        await ExpireNowAsync(app);
        Assert.Equal("a2", await GetTokenAsync(app, handler));

        // 3) 다음 갱신은 옛 값(r1)이 아니라 DB에 저장된 새 값(r2)을 써야 성공한다
        await ExpireNowAsync(app);
        Assert.Equal("a3", await GetTokenAsync(app, handler));
        Assert.Equal(["r1", "r2"], handler.UsedRefreshTokens);

        var lastRequest = handler.TokenRequests[^1];
        Assert.Equal("client-id", lastRequest.GetProperty("clientId").GetString());
        Assert.Equal("client-secret", lastRequest.GetProperty("clientSecret").GetString());
    }

    [Fact]
    public async Task ChzzkApiClient_ConcurrentCallers_RefreshOnce()
    {
        await using var app = new ApiFactory();
        var handler = new StubChzzkHandler { RefreshDelay = TimeSpan.FromMilliseconds(300) };
        await SeedTokenAsync(app, handler, "r1", DateTimeOffset.UtcNow.AddMinutes(1)); // 곧 만료 (5분 안)

        // 두 요청이 동시에 "곧 만료"를 보고 갱신하려 한다. 각자 다른 DbContext를 쓴다
        var results = await Task.WhenAll(GetTokenAsync(app, handler), GetTokenAsync(app, handler));

        Assert.Equal(["a2", "a2"], results);               // 둘 다 새 토큰을 받는다
        Assert.Equal(["r1"], handler.UsedRefreshTokens);    // 1회용 토큰으로 갱신은 딱 한 번만
    }

    [Fact]
    public async Task ChzzkApiClient_RefreshFailure_Throws()
    {
        await using var app = new ApiFactory();
        var handler = new StubChzzkHandler();
        await SeedTokenAsync(app, handler, "old-refresh-token", DateTimeOffset.UtcNow.AddMinutes(-1)); // 이미 쓴(무효) 토큰

        var error = await Assert.ThrowsAsync<ChzzkApiException>(() => GetTokenAsync(app, handler));
        Assert.Equal(401, error.StatusCode);
    }
}
