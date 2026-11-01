namespace ImageDonation.Api.Entities;

// 신고: 스트리머가 부적절한 후원을 서비스 운영자에게 알린다.
// 운영자 화면은 아직 없다 → 운영자는 SQL로 확인한다 (README "신고 확인").
// 신고된 후원의 이미지는 증거로 저장소에 남지만(/media로는 제공 안 함), 후원 행과 함께 7일 뒤 지워지므로 그 안에 확인한다.
public class Report
{
    public int Id { get; set; }
    public int DonationId { get; set; }
    public int StreamerId { get; set; }
    public string Reason { get; set; } = ""; // 최대 200자
    public DateTimeOffset CreatedAt { get; set; }
}
