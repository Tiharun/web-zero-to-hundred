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
}
