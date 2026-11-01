namespace ImageDonation.Api.Entities;

// 후원 방식: 무료 이미지 후원 / 치지직 치즈 후원과 연동
public enum DonationMode
{
    Free,
    Cheese,
}

// 스트리머별 설정 (스트리머 1명당 1행)
public class StreamerSettings
{
    public const int MaxFileMbLimit = 10; // 스트리머가 올릴 수 있는 업로드 한도의 상한(서버 전체 제한)

    public int StreamerId { get; set; }                    // 기본 키이자 Streamer를 가리키는 외래 키
    public DonationMode Mode { get; set; } = DonationMode.Free;
    public int MinCheese { get; set; } = 1000;             // 치즈 모드에서 인정하는 최소 금액
    public bool AutoApprove { get; set; }                  // 켜면 검수 없이 바로 방송에 표시
    public int DisplaySeconds { get; set; } = 8;           // 이미지 1장을 보여 주는 시간(3~30초)
    public int MinIntervalSeconds { get; set; } = 2;       // 다음 이미지까지 쉬는 시간
    public int MaxFileMb { get; set; } = 5;                // 업로드 크기 제한(최대 10MB)
    public string[] BannedWords { get; set; } = [];        // 닉네임·메시지에 들어가면 거절할 단어
}
