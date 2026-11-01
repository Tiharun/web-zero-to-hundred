using System.Buffers.Text;
using System.Security.Cryptography;

namespace ImageDonation.Api.Entities;

// 스트리머 1명 = 공개 후원 페이지(/d/{Slug}) 1개 + 비밀 오버레이 주소 1개
public class Streamer
{
    public int Id { get; set; }
    public string UserId { get; set; } = "";       // 로그인 계정(IdentityUser.Id)과 1:1
    public string Slug { get; set; } = "";         // 후원 페이지 주소에 들어가는 이름 (영문 소문자·숫자·-)
    public string DisplayName { get; set; } = "";  // 화면에 보이는 이름
    public string OverlayToken { get; set; } = ""; // OBS 오버레이 주소의 비밀 토큰 (?token=...)
    public DateTimeOffset CreatedAt { get; set; }

    public StreamerSettings Settings { get; set; } = null!;

    // 추측할 수 없는 토큰: 무작위 32바이트(256비트)를 주소에 넣어도 안전한 Base64Url 글자로 바꾼다
    public static string NewOverlayToken() => Base64Url.EncodeToString(RandomNumberGenerator.GetBytes(32));
}
