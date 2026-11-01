using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Dtos;

// 검증 특성을 직접 만들어요 (Day 23, 34)
// 기본 [Url]은 ftp:// 주소도 통과시키고 호스트(도메인)를 확인하지 않아요.
// 이 특성은 http:// 또는 https://로 시작하고 호스트가 있는 주소만 통과시켜요.
// 그래서 javascript:alert(1) 같은 주소가 링크(href)나 그림(src)에 들어가지 못해요.
public class HttpUrlAttribute : ValidationAttribute
{
    public override bool IsValid(object? value)
    {
        if (value is null)
        {
            return true; // 값이 꼭 있어야 하는지는 [Required]가 정해요
        }

        return value is string text
            && Uri.TryCreate(text, UriKind.Absolute, out var uri) // 완전한 주소인지
            && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps) // http·https만
            && uri.Host != ""; // 호스트(예: example.com)가 있는지
    }
}
