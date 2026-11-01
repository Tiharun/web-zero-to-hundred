using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;

namespace ImageDonation.Tests;

public class ChzzkApiClientTests
{
    private static (ChzzkApiClient Client, StubChzzkHandler Handler) Create()
    {
        var handler = new StubChzzkHandler();
        var http = new HttpClient(handler) { BaseAddress = new Uri("https://openapi.chzzk.test") };
        var options = Options.Create(new ChzzkOptions { ClientId = "client-id", ClientSecret = "client-secret" });
        var client = new ChzzkApiClient(http, options, new EphemeralDataProtectionProvider(), TimeProvider.System);
        return (client, handler);
    }

    [Fact]
    public async Task ChzzkApiClient_RefreshRotatesToken()
    {
        var (client, handler) = Create();
        var token = new ChzzkToken { UserId = "u1" };
        client.StoreTokens(token, new ChzzkTokenResponse("a1", "r1", 86400));

        // 저장된 값은 암호화되어 있어서 원문과 다르다
        Assert.NotEqual("r1", token.RefreshTokenProtected);
        Assert.Equal("r1", client.ReadRefreshToken(token));

        // 1) 아직 유효하면 갱신하지 않는다
        Assert.Equal("a1", await client.GetValidAccessTokenAsync(token));
        Assert.Empty(handler.UsedRefreshTokens);

        // 2) 만료되면 갱신하고, 새 Refresh Token(r2)으로 바꿔 둔다
        token.AccessTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-1);
        Assert.Equal("a2", await client.GetValidAccessTokenAsync(token));
        Assert.Equal("r2", client.ReadRefreshToken(token));
        Assert.True(token.AccessTokenExpiresAt > DateTimeOffset.UtcNow.AddHours(23));

        // 3) 다음 갱신은 옛 값(r1)이 아니라 새 값(r2)을 써야 성공한다
        token.AccessTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-1);
        Assert.Equal("a3", await client.GetValidAccessTokenAsync(token));
        Assert.Equal(["r1", "r2"], handler.UsedRefreshTokens);

        var lastRequest = handler.TokenRequests[^1];
        Assert.Equal("client-id", lastRequest.GetProperty("clientId").GetString());
        Assert.Equal("client-secret", lastRequest.GetProperty("clientSecret").GetString());
    }

    [Fact]
    public async Task ChzzkApiClient_RefreshFailure_Throws()
    {
        var (client, _) = Create();
        var token = new ChzzkToken { UserId = "u1" };
        client.StoreTokens(token, new ChzzkTokenResponse("a1", "old-refresh-token", 86400)); // 이미 쓴(무효) 토큰
        token.AccessTokenExpiresAt = DateTimeOffset.UtcNow.AddMinutes(-1);

        var error = await Assert.ThrowsAsync<ChzzkApiException>(() => client.GetValidAccessTokenAsync(token));
        Assert.Equal(401, error.StatusCode);
    }
}
