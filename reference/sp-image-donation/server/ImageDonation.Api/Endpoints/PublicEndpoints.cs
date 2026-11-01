using ImageDonation.Api.Data;
using ImageDonation.Api.Dtos;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Storage;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImageDonation.Api.Endpoints;

// 로그인 없이 쓰는 API: 후원 페이지 정보, 후원 보내기, 이미지 파일
public static class PublicEndpoints
{
    public const int MaxUploadBytes = StreamerSettings.MaxFileMbLimit * 1024 * 1024; // 서버 전체 상한 10MB
    public const int MaxNicknameLength = 20;
    public const int MaxMessageLength = 100;

    public static void MapPublicEndpoints(this IEndpointRouteBuilder app)
    {
        var streamer = app.MapGroup("/api/public/streamers/{slug}");
        streamer.MapGet("/", GetStreamer);
        streamer.MapPost("/donations", CreateDonation)
            .RequireRateLimiting("donations") // IP당 1분에 N건 (Program.cs)
            .DisableAntiforgery()             // 로그인 쿠키를 쓰지 않는 공개 API라 위조 방지 토큰이 필요 없다
            .WithMetadata(new RequestSizeLimitAttribute(MaxUploadBytes + 64 * 1024)); // 본문 전체 상한(폼 글자 여유분 포함)

        app.MapGet("/media/{file}", GetMedia);
    }

    private static async Task<IResult> GetStreamer(string slug, AppDbContext db)
    {
        var s = await db.Streamers.Include(x => x.Settings).FirstOrDefaultAsync(x => x.Slug == slug);
        return s is null
            ? Results.NotFound()
            : Results.Ok(new PublicStreamerDto(s.Slug, s.DisplayName, s.Settings.Mode, s.Settings.MinCheese, s.Settings.MaxFileMb));
    }

    // multipart/form-data: image(파일), nickname(≤20자), message(≤100자)
    private static async Task<IResult> CreateDonation(
        string slug,
        IFormFile? image,
        [FromForm] string? nickname,
        [FromForm] string? message,
        HttpContext http,
        AppDbContext db,
        DonationService donations,
        CancellationToken ct)
    {
        var streamer = await db.Streamers.Include(s => s.Settings).FirstOrDefaultAsync(s => s.Slug == slug, ct);
        if (streamer is null) return Results.NotFound();
        var settings = streamer.Settings;

        // 1) 글자 입력 검사 (서버에서 다시 검사한다: 브라우저 검사는 우회할 수 있다)
        nickname = nickname?.Trim() ?? "";
        message = message?.Trim() ?? "";
        if (nickname.Length is 0 or > MaxNicknameLength) return Problem(400, $"닉네임은 1~{MaxNicknameLength}자로 써 주세요.");
        if (message.Length > MaxMessageLength) return Problem(400, $"메시지는 {MaxMessageLength}자까지 쓸 수 있어요.");
        if (image is null || image.Length == 0) return Problem(400, "이미지 파일을 골라 주세요.");

        // 2) 크기 검사: 스트리머가 정한 한도(MaxFileMb, 최대 10MB)
        if (image.Length > settings.MaxFileMb * 1024L * 1024L)
        {
            return Problem(StatusCodes.Status413PayloadTooLarge, $"이미지는 {settings.MaxFileMb}MB까지 올릴 수 있어요.");
        }

        // 3) 금지어·차단 검사
        if (BannedWordFilter.FindBannedWord($"{nickname} {message}", settings.BannedWords) is not null)
        {
            return Problem(400, "사용할 수 없는 단어가 들어 있어요.");
        }
        var ipHash = donations.HashSenderIp(http.Connection.RemoteIpAddress);
        if (await donations.IsBlockedAsync(streamer.Id, ipHash, ct)) return Problem(403, "이 방송에는 후원할 수 없어요.");

        // 4) 이미지 검사·정리 후 저장 (확장자·Content-Type은 믿지 않는다)
        using var buffer = new MemoryStream();
        await image.CopyToAsync(buffer, ct);
        try
        {
            var donation = await donations.CreateAsync(streamer, nickname, message, buffer.ToArray(), ipHash, ct);
            return TypedResults.Created((string?)null, new CreateDonationResponse(donation.Id, donation.Status, donation.Code));
        }
        catch (InvalidImageException ex)
        {
            return Problem(400, ex.Message);
        }
    }

    // 보여 줄 수 있는 상태의 후원 이미지만 준다. 파일이 남아 있어도 거절(신고 포함)·만료·긴급 정지된 후원이거나
    // DB에 없는 파일이면 404 → 신고된 이미지는 증거로 남아 있지만 오버레이·시청자 누구에게도 나가지 않는다(격리)
    private static async Task<IResult> GetMedia(string file, IImageStorage storage, AppDbContext db, HttpContext http)
    {
        var status = await db.Donations.AsNoTracking()
            .Where(d => d.ImageFile == file)
            .Select(d => (DonationStatus?)d.Status)
            .FirstOrDefaultAsync();
        if (status is null || !DonationDto.ImageVisible(status.Value)) return Results.NotFound();

        var stream = storage.OpenRead(file); // 이름 형식(GUID.webp)이 아니거나 파일이 없으면 null
        if (stream is null) return Results.NotFound();

        http.Response.Headers.CacheControl = "private, max-age=3600";
        return Results.Stream(stream, "image/webp");
    }

    private static IResult Problem(int status, string detail) => Results.Problem(detail: detail, statusCode: status);
}
