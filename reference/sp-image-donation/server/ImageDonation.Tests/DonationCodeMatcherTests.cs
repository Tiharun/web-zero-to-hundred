using ImageDonation.Api.Entities;
using ImageDonation.Api.Services;
using ImageDonation.Api.Services.Events;

namespace ImageDonation.Tests;

public class DonationCodeMatcherTests
{
    private static readonly DateTimeOffset Now = new(2026, 11, 1, 12, 0, 0, TimeSpan.Zero);
    private const int MinCheese = 1000;

    private static Donation Awaiting(string code, int id = 1, int minutesAgo = 5) => new()
    {
        Id = id,
        Status = DonationStatus.AwaitingCheese,
        Code = code,
        CreatedAt = Now.AddMinutes(-minutesAgo),
    };

    private static CheeseDonationEvent Cheese(int amount, string text) =>
        new(StreamerId: 1, Source: "test", DonationType: "CHAT", DonatorNickname: "후원자", PayAmount: amount, DonationText: text, ReceivedAt: Now);

    [Fact]
    public void NewCode_IsHashPlusFourUpperLettersOrDigits()
    {
        for (var i = 0; i < 50; i++)
        {
            Assert.Matches("^#[A-Z0-9]{4}$", DonationCodeMatcher.NewCode());
        }
    }

    [Fact]
    public void CodeMatcher_MatchesCodeInMessage_CaseInsensitive()
    {
        var donation = Awaiting("#AB12");

        var match = DonationCodeMatcher.FindMatch([donation], Cheese(1000, "이미지 부탁해요 #ab12!"), MinCheese, Now);

        Assert.Same(donation, match);
    }

    [Fact]
    public void CodeMatcher_IgnoresLongerTokens()
    {
        // #AB123은 다른 코드다: 4글자 뒤에 글자가 더 붙으면 인정하지 않는다
        Assert.Empty(DonationCodeMatcher.ExtractCodes("#AB123"));
        Assert.Equal(["#AB12", "#CD34"], DonationCodeMatcher.ExtractCodes("#ab12 그리고 #CD34."));
    }

    [Fact]
    public void CodeMatcher_IgnoresBelowMinCheese()
    {
        var match = DonationCodeMatcher.FindMatch([Awaiting("#AB12")], Cheese(999, "#AB12"), MinCheese, Now);

        Assert.Null(match);
    }

    [Fact]
    public void CodeMatcher_IgnoresExpired()
    {
        var expired = Awaiting("#AB12", minutesAgo: 31); // 30분이 지났다

        var match = DonationCodeMatcher.FindMatch([expired], Cheese(1000, "#AB12"), MinCheese, Now);

        Assert.Null(match);
    }

    [Fact]
    public void CodeMatcher_NoDoubleMatch()
    {
        var first = Awaiting("#AB12", id: 1);
        var second = Awaiting("#CD34", id: 2);
        var evt = Cheese(5000, "#AB12 #CD34"); // 코드 두 개를 넣어도 한 번의 후원은 한 건만 인정한다

        var match = DonationCodeMatcher.FindMatch([first, second], evt, MinCheese, Now);
        Assert.Same(first, match);

        match!.Status = DonationStatus.Pending; // DonationService가 매칭 결과를 저장한 상태
        var again = DonationCodeMatcher.FindMatch([first], Cheese(5000, "#AB12"), MinCheese, Now);
        Assert.Null(again); // 이미 확인된 후원은 다시 매칭되지 않는다
    }
}
