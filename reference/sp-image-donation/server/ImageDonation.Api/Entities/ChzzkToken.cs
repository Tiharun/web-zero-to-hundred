namespace ImageDonation.Api.Entities;

// 치지직 로그인으로 받은 토큰. 토큰 값은 Data Protection으로 암호화해서만 저장한다
public class ChzzkToken
{
    public string UserId { get; set; } = "";               // 기본 키: 로그인 계정(IdentityUser.Id)
    public string ChannelId { get; set; } = "";            // 치지직 채널 ID (계정 연결 기준)
    public string ChannelName { get; set; } = "";
    public string AccessTokenProtected { get; set; } = "";  // 암호화된 Access Token (1일)
    public string RefreshTokenProtected { get; set; } = ""; // 암호화된 Refresh Token (30일, 1회용)
    public DateTimeOffset AccessTokenExpiresAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
