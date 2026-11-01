using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;
using StreamerHub.Api.Services;

namespace StreamerHub.Tests;

// PostService 단위 테스트 (Day 35): "본인만 수정할 수 있다" 규칙을 HTTP 없이 확인해요.
public class PostServiceTests
{
    [Fact]
    public async Task PostService_Update_ByOtherUser_Forbidden()
    {
        // 준비(Arrange): 사용자 두 명과 글 하나
        using var db = new TestDb();
        var author = new AppUser { UserName = "author@test.local", Email = "author@test.local", DisplayName = "작성자" };
        var other = new AppUser { UserName = "other@test.local", Email = "other@test.local", DisplayName = "다른 팬" };
        db.Context.Users.AddRange(author, other);
        await db.Context.SaveChangesAsync();

        var service = new PostService(db.Context);
        var post = await service.CreateAsync(author.Id, new PostRequest { Title = "원래 제목", Body = "원래 내용" });

        // 실행(Act): 다른 사람이 고치려고 한다
        var result = await service.UpdateAsync(
            post.Id,
            new PostRequest { Title = "바꾼 제목", Body = "바꾼 내용" },
            userId: other.Id,
            isAdmin: false);

        // 확인(Assert): 거절되고, DB의 글은 그대로다
        Assert.Equal(PostChangeResult.Forbidden, result);
        var saved = await db.Context.Posts.AsNoTracking().SingleAsync(p => p.Id == post.Id);
        Assert.Equal("원래 제목", saved.Title);
        Assert.Null(saved.UpdatedAt);
    }
}
