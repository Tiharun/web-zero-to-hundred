using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace ImageDonation.Tests;

// 진짜 치지직 대신 응답하는 가짜 HTTP 처리기.
// Refresh Token은 1회용: 마지막으로 발급한 값만 받아 주고, 쓰면 새 값으로 바뀐다.
public sealed class StubChzzkHandler : HttpMessageHandler
{
    private readonly Lock _lock = new();
    private int _issued = 1;

    public string CurrentRefreshToken { get; private set; } = "r1";
    public List<string> UsedRefreshTokens { get; } = [];
    public List<JsonElement> TokenRequests { get; } = [];

    // 갱신 응답을 일부러 늦춘다: 두 요청이 동시에 갱신하려는 상황을 만들기 위해
    public TimeSpan RefreshDelay { get; init; } = TimeSpan.Zero;

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
    {
        if (request.Method == HttpMethod.Post && request.RequestUri!.AbsolutePath == "/auth/v1/token")
        {
            JsonElement body;
            using (var document = JsonDocument.Parse(await request.Content!.ReadAsStringAsync(ct)))
            {
                body = document.RootElement.Clone();
            }

            if (body.GetProperty("grantType").GetString() == "refresh_token")
            {
                await Task.Delay(RefreshDelay, ct);
                lock (_lock)
                {
                    TokenRequests.Add(body);
                    var used = body.GetProperty("refreshToken").GetString()!;
                    UsedRefreshTokens.Add(used);
                    if (used != CurrentRefreshToken)
                    {
                        return Json(HttpStatusCode.Unauthorized, new { code = 401, message = "INVALID_TOKEN" });
                    }

                    _issued++;
                    CurrentRefreshToken = $"r{_issued}";
                    // 문서는 expiresIn을 문자열로, 실측 보고는 숫자로 적는다 → 번갈아 보내 본다
                    object expiresIn = _issued % 2 == 0 ? "86400" : 86400;
                    return Json(HttpStatusCode.OK, new
                    {
                        code = 200,
                        message = (string?)null,
                        content = new { accessToken = $"a{_issued}", refreshToken = CurrentRefreshToken, tokenType = "Bearer", expiresIn },
                    });
                }
            }
        }

        return Json(HttpStatusCode.NotFound, new { code = 404, message = "NOT_FOUND" });
    }

    private static HttpResponseMessage Json(HttpStatusCode status, object body) =>
        new(status) { Content = JsonContent.Create(body) };
}
