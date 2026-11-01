namespace ImageDonation.Api.Entities;

// 후원 상태
//   무료:   Pending → Approved → Shown,  Pending → Rejected
//   치즈:   AwaitingCheese → Pending(코드 매칭) 또는 → Expired(30분)
//   긴급 정지: Approved → Cleared (아직 다 보여 주지 못한 승인 후원을 모두 내린다)
//   신고:   Rejected·Expired가 아니면 → Rejected
public enum DonationStatus
{
    AwaitingCheese, // 치즈 후원(코드 포함)을 기다리는 중
    Pending,        // 스트리머 검수 대기
    Approved,       // 승인됨 → 오버레이로 보냄
    Shown,          // 오버레이가 다 보여 줌
    Rejected,       // 거절됨 (신고 포함)
    Expired,        // 30분 안에 치즈 후원이 오지 않음
    Cleared,        // 긴급 정지로 방송에서 내림
}

// 시청자가 보낸 이미지 후원 1건
public class Donation
{
    public int Id { get; set; }
    public int StreamerId { get; set; }
    public Streamer Streamer { get; set; } = null!;

    public DonationStatus Status { get; set; }
    public string Nickname { get; set; } = "";     // 최대 20자
    public string Message { get; set; } = "";      // 최대 100자
    public string ImageFile { get; set; } = "";    // 저장소 안의 파일 이름(무작위 GUID.webp)
    public string? Code { get; set; }              // 치즈 모드 후원 코드 (예: #AB12)
    public int? CheeseAmount { get; set; }         // 매칭된 치즈 금액
    public string SenderIpHash { get; set; } = ""; // 보낸 사람 IP의 해시(차단용). IP 원문은 저장하지 않는다
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
