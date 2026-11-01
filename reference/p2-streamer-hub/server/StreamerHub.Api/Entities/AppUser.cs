using Microsoft.AspNetCore.Identity;

namespace StreamerHub.Api.Entities;

// 로그인하는 사용자 (Day 25)
// IdentityUser에 Id, Email, PasswordHash(비밀번호를 해싱한 값) 등이 이미 들어 있어요.
// 우리는 게시판에 보여 줄 이름(DisplayName)만 더해요.
public class AppUser : IdentityUser
{
    // Identity의 /register는 이메일과 비밀번호만 받아요.
    // 그래서 처음에는 이 기본값으로 저장되고, 가입 직후 PUT /api/me로 바꿔요.
    public string DisplayName { get; set; } = "새 팬";
}
