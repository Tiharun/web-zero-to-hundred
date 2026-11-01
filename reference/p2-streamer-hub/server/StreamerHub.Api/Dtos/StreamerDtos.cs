using System.ComponentModel.DataAnnotations;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Dtos;

// DTO(Data Transfer Object) = API로 주고받는 모양 (Day 23)
// 엔티티를 그대로 내보내지 않고, 필요한 칸만 골라서 주고받아요.

// 요청: 관리자가 스트리머를 등록·수정할 때 보내는 값
// 꼭 public으로 선언해요. internal이면 AddValidation()이 검사를 조용히 건너뛰어요.
public record StreamerRequest
{
    [Required(ErrorMessage = "이름을 입력해 주세요.")]
    [StringLength(50, ErrorMessage = "이름은 50자까지 쓸 수 있어요.")]
    public string Name { get; init; } = "";

    [Required(ErrorMessage = "플랫폼을 골라 주세요.")]
    [AllowedValues("chzzk", "youtube", "soop", "other", ErrorMessage = "플랫폼은 chzzk, youtube, soop, other 중 하나예요.")]
    public string Platform { get; init; } = "";

    // [Url]은 http://, https://로 시작하는 주소만 통과시켜요. (javascript: 같은 위험한 주소를 막아요. Day 34)
    [Required(ErrorMessage = "채널 주소를 입력해 주세요.")]
    [Url(ErrorMessage = "채널 주소는 https://로 시작하는 주소로 써 주세요.")]
    [StringLength(200, ErrorMessage = "채널 주소는 200자까지 쓸 수 있어요.")]
    public string ChannelUrl { get; init; } = "";

    [Required(ErrorMessage = "소개를 입력해 주세요.")]
    [StringLength(500, ErrorMessage = "소개는 500자까지 쓸 수 있어요.")]
    public string Bio { get; init; } = "";

    // 프로필 사진 주소는 없어도 돼요(null).
    [Url(ErrorMessage = "프로필 사진 주소는 https://로 시작하는 주소로 써 주세요.")]
    [StringLength(200, ErrorMessage = "프로필 사진 주소는 200자까지 쓸 수 있어요.")]
    public string? AvatarUrl { get; init; }
}

// 응답: 목록과 등록 결과에 쓰는 모양
public record StreamerResponse(
    int Id,
    string Name,
    string Platform,
    string ChannelUrl,
    string Bio,
    string? AvatarUrl,
    DateTime CreatedAt)
{
    // 엔티티 → DTO 변환은 여기 한 곳에서만 해요
    public static StreamerResponse From(Streamer streamer) => new(
        streamer.Id,
        streamer.Name,
        streamer.Platform,
        streamer.ChannelUrl,
        streamer.Bio,
        streamer.AvatarUrl,
        streamer.CreatedAt);
}

// 응답: 상세 화면용. 다가오는 방송 일정까지 함께 담아요 (Day 22)
public record StreamerDetailResponse(
    int Id,
    string Name,
    string Platform,
    string ChannelUrl,
    string Bio,
    string? AvatarUrl,
    DateTime CreatedAt,
    List<ScheduleResponse> Schedules)
{
    public static StreamerDetailResponse From(Streamer streamer) => new(
        streamer.Id,
        streamer.Name,
        streamer.Platform,
        streamer.ChannelUrl,
        streamer.Bio,
        streamer.AvatarUrl,
        streamer.CreatedAt,
        streamer.Schedules.Select(ScheduleResponse.From).ToList());
}
