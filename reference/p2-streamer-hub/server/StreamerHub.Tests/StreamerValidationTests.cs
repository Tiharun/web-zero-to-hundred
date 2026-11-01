using System.ComponentModel.DataAnnotations;
using StreamerHub.Api.Dtos;

namespace StreamerHub.Tests;

// 검증 규칙 단위 테스트 (Day 23, 35): DTO에 붙인 특성([Required] 등)을 직접 검사해요.
// API는 AddValidation()이 같은 특성으로 검사하고, 실패하면 400을 돌려줘요.
public class StreamerValidationTests
{
    [Fact]
    public void StreamerValidation_RejectsEmptyName()
    {
        var request = new StreamerRequest
        {
            Name = "",
            Platform = "chzzk",
            ChannelUrl = "https://example.com/moonbear",
            Bio = "소개 글",
        };

        var errors = new List<ValidationResult>();
        var isValid = Validator.TryValidateObject(request, new ValidationContext(request), errors, validateAllProperties: true);

        Assert.False(isValid);
        var error = Assert.Single(errors); // 이름 하나만 틀렸어요
        Assert.Contains(nameof(StreamerRequest.Name), error.MemberNames);
    }

    // [Theory] + [InlineData]: 같은 검사를 값만 바꿔서 여러 번 해요
    [Theory]
    [InlineData("ftp://example.com/channel")]  // http·https가 아니에요
    [InlineData("https://")]                   // 호스트(도메인)가 없어요
    [InlineData("javascript:alert(1)")]        // 링크에 넣으면 스크립트가 실행되는 주소
    [InlineData("example.com/channel")]        // 완전한 주소가 아니에요
    public void StreamerValidation_RejectsNonHttpUrl(string channelUrl)
    {
        var request = ValidRequest() with { ChannelUrl = channelUrl };

        var errors = Validate(request);

        var error = Assert.Single(errors);
        Assert.Contains(nameof(StreamerRequest.ChannelUrl), error.MemberNames);
    }

    [Fact]
    public void StreamerValidation_AcceptsHttpsUrl()
    {
        var request = ValidRequest() with { AvatarUrl = "https://example.com/moonbear.png" };

        Assert.Empty(Validate(request));
    }

    private static StreamerRequest ValidRequest() => new()
    {
        Name = "달빛곰",
        Platform = "chzzk",
        ChannelUrl = "https://example.com/moonbear",
        Bio = "소개 글",
    };

    private static List<ValidationResult> Validate(StreamerRequest request)
    {
        var errors = new List<ValidationResult>();
        Validator.TryValidateObject(request, new ValidationContext(request), errors, validateAllProperties: true);
        return errors;
    }
}
