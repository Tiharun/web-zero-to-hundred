using System.ComponentModel.DataAnnotations;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Dtos;

// 요청: 관리자가 공지를 올릴 때
public record NoticeRequest
{
    [Required(ErrorMessage = "공지 내용을 입력해 주세요.")]
    [StringLength(200, ErrorMessage = "공지는 200자까지 쓸 수 있어요.")]
    public string Message { get; init; } = "";
}

// 응답: 공지 하나 (오버레이가 SSE로 받는 모양도 이것이에요)
public record NoticeResponse(int Id, string Message, DateTime CreatedAt)
{
    public static NoticeResponse From(Notice notice) => new(notice.Id, notice.Message, notice.CreatedAt);
}
