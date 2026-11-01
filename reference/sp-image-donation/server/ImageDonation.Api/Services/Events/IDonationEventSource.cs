namespace ImageDonation.Api.Services.Events;

// 치즈 후원 이벤트 1건. 치지직 DONATION 페이로드를 우리 형식으로 옮긴 것
public sealed record CheeseDonationEvent(
    int StreamerId,         // 어느 스트리머의 방송에 들어온 후원인지
    string Source,          // "chzzk"(진짜) 또는 "test"(테스트 모드)
    string DonationType,    // "CHAT" 또는 "VIDEO"
    string DonatorNickname,
    int PayAmount,          // 치즈 금액
    string DonationText,    // 후원 메시지 (여기서 #코드를 찾는다)
    DateTimeOffset ReceivedAt);

// 후원 이벤트를 "보내 주는 쪽"의 공통 모양.
// 진짜(ChzzkSessionSource)와 가짜(FakeDonationSource)가 같은 이벤트를 내보내므로,
// 받는 쪽(DonationService)은 어느 쪽에서 왔는지 신경 쓰지 않아도 된다.
// 주의: 처리기를 여러 개 붙이면 `await DonationReceived(evt)`는 "마지막" 처리기의 Task만 기다린다.
// 이 프로젝트는 Program.cs에서 처리기를 딱 하나만 붙인다. 여러 개가 필요하면 GetInvocationList()로 하나씩 기다려야 한다.
public interface IDonationEventSource
{
    event Func<CheeseDonationEvent, Task>? DonationReceived;
}
