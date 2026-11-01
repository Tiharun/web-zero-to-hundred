using System.ComponentModel.DataAnnotations;

namespace ImageDonation.Api.Dtos;

// 온보딩: 후원 페이지 주소(slug)와 표시 이름을 정한다
public record OnboardingRequest(
    [Required, RegularExpression("^[a-z0-9-]{3,30}$", ErrorMessage = "주소는 영문 소문자·숫자·-로 3~30자예요.")] string Slug,
    [Required, StringLength(40, MinimumLength = 1)] string DisplayName);

// GET /api/auth/me
public record MeResponse(string UserName, StreamerInfo? Streamer, ChzzkInfo? Chzzk);

public record StreamerInfo(int Id, string Slug, string DisplayName);

public record ChzzkInfo(string ChannelName, bool SessionConnected);
