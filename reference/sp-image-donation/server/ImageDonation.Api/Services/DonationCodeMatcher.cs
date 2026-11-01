using System.Security.Cryptography;
using System.Text.RegularExpressions;
using ImageDonation.Api.Entities;
using ImageDonation.Api.Services.Events;

namespace ImageDonation.Api.Services;

// 치즈 모드 후원 코드: 발급(#AB12)과, 치즈 후원 메시지에서 코드를 찾아 맞추기
public static partial class DonationCodeMatcher
{
    public static readonly TimeSpan CodeLifetime = TimeSpan.FromMinutes(30); // 코드 유효 시간

    private const string Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // # + 영문 대문자·숫자 4자. 추측하기 어렵게 암호학적 난수를 쓴다
    public static string NewCode() => "#" + RandomNumberGenerator.GetString(Alphabet, 4);

    // "#" 뒤 4글자, 그 뒤에 영문·숫자가 더 붙으면(#AB123) 코드가 아니다. 대소문자는 무시한다
    [GeneratedRegex("#([A-Za-z0-9]{4})(?![A-Za-z0-9])")]
    private static partial Regex CodePattern();

    // 메시지 속 코드들을 대문자로 바꿔 돌려준다 (예: "고마워요 #ab12" → ["#AB12"])
    public static List<string> ExtractCodes(string text) =>
        CodePattern().Matches(text).Select(m => "#" + m.Groups[1].Value.ToUpperInvariant()).ToList();

    // 이 치즈 후원과 맞는 "기다리는 후원"을 1건 고른다. 없으면 null
    // 조건: 상태가 AwaitingCheese, 코드가 메시지에 있음, 금액 ≥ 최소 치즈, 만들어진 지 30분 이내
    public static Donation? FindMatch(IEnumerable<Donation> candidates, CheeseDonationEvent evt, int minCheese, DateTimeOffset now)
    {
        if (evt.PayAmount < minCheese) return null;

        var codes = ExtractCodes(evt.DonationText);
        if (codes.Count == 0) return null;

        return candidates
            .Where(d => d.Status == DonationStatus.AwaitingCheese)  // 이미 확인된 후원은 다시 맞추지 않는다
            .Where(d => now - d.CreatedAt <= CodeLifetime)           // 만료된 코드는 무시
            .Where(d => d.Code is not null && codes.Contains(d.Code))
            .OrderBy(d => codes.IndexOf(d.Code!))                    // 메시지에 먼저 나온 코드 1건만
            .FirstOrDefault();
    }
}
