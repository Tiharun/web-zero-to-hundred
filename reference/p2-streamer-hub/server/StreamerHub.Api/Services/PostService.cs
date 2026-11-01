using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Services;

// 글 수정·삭제의 결과: 성공 / 글이 없음 / 권한 없음
public enum PostChangeResult
{
    Success,
    NotFound,
    Forbidden,
}

// 팬 게시판 규칙을 모아 둔 서비스 (Day 23, 30)
// 엔드포인트는 HTTP(요청·응답)만 다루고, "누가 무엇을 할 수 있나" 같은 규칙은 여기서 정해요.
// 그래서 HTTP 없이도 단위 테스트를 할 수 있어요 (Day 35).
public class PostService
{
    private readonly AppDbContext _db;

    // 의존성 주입: Program.cs에 AddScoped<PostService>()로 등록하면 ASP.NET Core가 DbContext를 넣어 줘요
    public PostService(AppDbContext db)
    {
        _db = db;
    }

    // 목록: 최신 글부터, page번째 쪽만 (page는 1부터 세요)
    public async Task<PagedResult<PostListItem>> ListAsync(int page, int pageSize)
    {
        var total = await _db.Posts.CountAsync();
        var posts = await _db.Posts
            .Include(p => p.Author)          // 글쓴이 이름도 함께 불러와요
            .OrderByDescending(p => p.Id)    // Id가 클수록 나중에 쓴 글
            .Skip((page - 1) * pageSize)     // 앞쪽 페이지만큼 건너뛰고
            .Take(pageSize)                  // 한 쪽 분량만 가져와요
            .ToListAsync();

        var items = posts.Select(PostListItem.From).ToList();
        return new PagedResult<PostListItem>(items, total, page, pageSize);
    }

    // 상세: 글이 없으면 null. 로그인하지 않았으면 userId가 null이에요
    public async Task<PostDetail?> GetAsync(int id, string? userId, bool isAdmin)
    {
        var post = await _db.Posts
            .Include(p => p.Author)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (post is null)
        {
            return null;
        }
        return PostDetail.From(post, CanChange(post, userId, isAdmin));
    }

    public async Task<PostDetail> CreateAsync(string authorId, PostRequest request)
    {
        var post = new Post
        {
            AuthorId = authorId,
            Title = request.Title,
            Body = request.Body,
            CreatedAt = DateTime.UtcNow,
        };
        _db.Posts.Add(post);
        await _db.SaveChangesAsync(); // 저장하면 post.Id가 채워져요

        // 글쓴이 이름까지 담아서 돌려주려고 다시 읽어요. 방금 저장했으니 반드시 있어요(!)
        return (await GetAsync(post.Id, authorId, isAdmin: false))!;
    }

    public async Task<PostChangeResult> UpdateAsync(int id, PostRequest request, string userId, bool isAdmin)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null)
        {
            return PostChangeResult.NotFound;
        }
        if (!CanChange(post, userId, isAdmin))
        {
            return PostChangeResult.Forbidden;
        }

        post.Title = request.Title;
        post.Body = request.Body;
        post.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return PostChangeResult.Success;
    }

    public async Task<PostChangeResult> DeleteAsync(int id, string userId, bool isAdmin)
    {
        var post = await _db.Posts.FindAsync(id);
        if (post is null)
        {
            return PostChangeResult.NotFound;
        }
        if (!CanChange(post, userId, isAdmin))
        {
            return PostChangeResult.Forbidden;
        }

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();
        return PostChangeResult.Success;
    }

    // 고치거나 지울 수 있는 사람: 글쓴이 본인 또는 관리자
    private static bool CanChange(Post post, string? userId, bool isAdmin)
    {
        return isAdmin || post.AuthorId == userId;
    }
}
