using System.ComponentModel.DataAnnotations;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Dtos;

// 요청: 글쓰기·글 수정
public record PostRequest
{
    [Required(ErrorMessage = "제목을 입력해 주세요.")]
    [StringLength(100, ErrorMessage = "제목은 100자까지 쓸 수 있어요.")]
    public string Title { get; init; } = "";

    [Required(ErrorMessage = "내용을 입력해 주세요.")]
    [StringLength(5000, ErrorMessage = "내용은 5000자까지 쓸 수 있어요.")]
    public string Body { get; init; } = "";
}

// 응답: 목록의 한 줄. 본문은 빼서 가볍게 보내요 (PostService.ListAsync가 Select로 바로 만들어요)
public record PostListItem(int Id, string Title, string AuthorName, DateTime CreatedAt);

// 응답: 글 상세. CanEdit = 지금 보는 사람이 고치거나 지울 수 있는지 (작성자 또는 관리자)
public record PostDetail(
    int Id,
    string Title,
    string Body,
    string AuthorName,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    bool CanEdit)
{
    public static PostDetail From(Post post, bool canEdit) => new(
        post.Id,
        post.Title,
        post.Body,
        post.Author!.DisplayName,
        post.CreatedAt,
        post.UpdatedAt,
        canEdit);
}
