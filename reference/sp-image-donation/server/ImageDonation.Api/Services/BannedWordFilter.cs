namespace ImageDonation.Api.Services;

// 금지어 검사: 대소문자를 무시하고 "포함"되어 있으면 걸린다
public static class BannedWordFilter
{
    // 걸린 금지어를 돌려준다. 없으면 null
    public static string? FindBannedWord(string text, IEnumerable<string> bannedWords) =>
        bannedWords
            .Select(w => w.Trim())
            .Where(w => w.Length > 0) // 빈 금지어는 모든 글에 걸리므로 무시
            .FirstOrDefault(w => text.Contains(w, StringComparison.OrdinalIgnoreCase));
}
