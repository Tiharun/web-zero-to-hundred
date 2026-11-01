using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Dtos;

// 응답: GET /api/me. JSON으로는 { email, displayName, roles }
public record MeResponse(string Email, string DisplayName, List<string> Roles);

// 요청: PUT /api/me. 게시판에 보일 닉네임을 바꿔요
public record UpdateMeRequest
{
    [Required(ErrorMessage = "닉네임을 입력해 주세요.")]
    [StringLength(20, MinimumLength = 2, ErrorMessage = "닉네임은 2~20자로 써 주세요.")]
    public string DisplayName { get; init; } = "";
}
