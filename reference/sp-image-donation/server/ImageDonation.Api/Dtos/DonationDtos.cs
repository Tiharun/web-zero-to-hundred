using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;

namespace ImageDonation.Api.Dtos;

// 주의: AddValidation()의 검증은 public 타입에만 동작한다 (internal이면 조용히 꺼짐)

// 대시보드에 보내는 후원 1건
public record DonationDto(
    int Id,
    DonationStatus Status,
    string Nickname,
    string Message,
    string? ImageUrl,
    string? Code,
    int? CheeseAmount,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ExpiresAt)
{
    public static DonationDto From(Donation d) => new(
        d.Id,
        d.Status,
        d.Nickname,
        d.Message,
        HasImage(d.Status) ? MediaUrl(d.ImageFile) : null, // 거절·만료된 후원은 이미지를 바로 지운다
        d.Code,
        d.CheeseAmount,
        d.CreatedAt,
        d.Status == DonationStatus.AwaitingCheese ? d.CreatedAt + DonationCodeMatcher.CodeLifetime : null);

    public static string MediaUrl(string file) => $"/media/{file}";

    private static bool HasImage(DonationStatus s) => s is not (DonationStatus.Rejected or DonationStatus.Expired);
}

// 공개 후원 API의 응답: {id, status, code?}
public record CreateDonationResponse(
    int Id,
    DonationStatus Status,
    [property: JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)] string? Code);

// 오버레이에 보내는 후원 1건 (표시 시간 설정을 함께 보낸다)
public record OverlayDonationDto(
    int Id,
    string ImageUrl,
    string Nickname,
    string Message,
    int DisplaySeconds,
    int MinIntervalSeconds);

// 후원 페이지가 처음에 읽는 스트리머 정보 (비밀 값은 넣지 않는다)
public record PublicStreamerDto(string Slug, string DisplayName, DonationMode Mode, int MinCheese, int MaxFileMb);

// 테스트 모드: 가짜 치즈 후원 1건
public record TestDonationRequest(
    [Range(1, 10_000_000)] int Amount,
    [Required, MaxLength(100)] string Message,
    [MaxLength(20)] string? Nickname);
