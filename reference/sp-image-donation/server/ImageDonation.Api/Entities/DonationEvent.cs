namespace ImageDonation.Api.Entities;

// 받은 치즈 후원 이벤트 기록 (치지직 세션 또는 테스트 모드). 7일 뒤 RetentionService가 지운다
public class DonationEvent
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public string Source { get; set; } = "";          // "chzzk" 또는 "test"
    public string DonatorNickname { get; set; } = "";
    public int PayAmount { get; set; }                // 치즈 금액
    public string DonationText { get; set; } = "";    // 후원 메시지 (여기서 코드를 찾는다)
    public DateTimeOffset ReceivedAt { get; set; }
    public int? MatchedDonationId { get; set; }       // 이 이벤트로 확인된 이미지 후원
}
