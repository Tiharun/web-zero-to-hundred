namespace ImageDonation.Api.Entities;

// 스트리머가 차단한 보낸 사람 (IP 해시 기준)
public class BlockEntry
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public string SenderIpHash { get; set; } = "";
    public string Nickname { get; set; } = ""; // 어떤 후원 때문에 차단했는지 알아보기 위한 참고용
    public DateTimeOffset CreatedAt { get; set; }
}
