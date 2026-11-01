using ImageDonation.Api.Services;

namespace ImageDonation.Tests;

public class BannedWordFilterTests
{
    [Fact]
    public void BannedWords_Rejects()
    {
        string[] banned = ["나쁜말", "SPAM", "  "];

        Assert.Equal("나쁜말", BannedWordFilter.FindBannedWord("이건 나쁜말이에요", banned));
        Assert.Equal("SPAM", BannedWordFilter.FindBannedWord("free spam here", banned)); // 대소문자 무시
        Assert.Null(BannedWordFilter.FindBannedWord("좋은 말만 해요", banned));          // 빈 금지어("  ")는 무시
        Assert.Null(BannedWordFilter.FindBannedWord("아무 말", []));
    }
}
