namespace ImageDonation.Api.Entities;

// 받은 치즈 후원 이벤트 기록 (치지직 세션 또는 테스트 모드). 7일 뒤 RetentionService가 지운다.
// 최소 수집: 매칭에 필요한 것(금액·시각·출처·결과)만 남기고, 후원자 닉네임·메시지는 저장하지 않는다.
// 무료 모드 스트리머의 이벤트는 아예 저장하지 않는다.
public class DonationEvent
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public string Source { get; set; } = "";     // "chzzk" 또는 "test"
    public int PayAmount { get; set; }           // 치즈 금액
    public DateTimeOffset ReceivedAt { get; set; }
    public int? MatchedDonationId { get; set; }  // 이 이벤트로 확인된 이미지 후원 (없으면 코드가 맞지 않았던 것)
}
