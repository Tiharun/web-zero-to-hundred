using System.Text.Json;

namespace ImageDonation.Api.Services.Events;

// 테스트 모드: 치지직 승인 없이도 전체 흐름을 연습하도록 가짜 치즈 후원을 만든다.
// 치지직 DONATION과 같은 JSON을 만들고, 진짜 수신기와 같은 해석기(ParseDonation)를 거쳐 내보낸다.
public sealed class FakeDonationSource(TimeProvider time) : IDonationEventSource
{
    public event Func<CheeseDonationEvent, Task>? DonationReceived;

    public async Task PublishAsync(int streamerId, string nickname, int amount, string message)
    {
        // 치지직 문서 표기대로 payAmount는 문자열
        var payload = JsonSerializer.SerializeToElement(new
        {
            donationType = "CHAT",
            channelId = "test-channel",
            donatorChannelId = "test-donator",
            donatorNickname = nickname,
            payAmount = amount.ToString(),
            donationText = message,
            emojis = new { },
        });

        var donation = ChzzkSessionSource.ParseDonation(streamerId, payload, "test", time.GetUtcNow())!;
        if (DonationReceived is { } handler)
        {
            await handler(donation); // 처리가 끝날 때까지 기다린다 → API 응답 시점에 결과가 DB에 반영되어 있다
        }
    }
}
