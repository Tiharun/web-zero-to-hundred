using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 팬 게시판의 글 하나 (Day 30)
public class Post
{
    public int Id { get; set; }

    // 글쓴이 = 로그인한 사용자(AppUser)의 Id
    public string AuthorId { get; set; } = "";
    public AppUser? Author { get; set; }

    [MaxLength(100)]
    public string Title { get; set; } = "";

    [MaxLength(5000)]
    public string Body { get; set; } = "";

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; } // 한 번도 고치지 않았으면 null
}
