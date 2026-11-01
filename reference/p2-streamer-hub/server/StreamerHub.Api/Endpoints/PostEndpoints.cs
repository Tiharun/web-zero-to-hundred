using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using StreamerHub.Api.Data;
using StreamerHub.Api.Dtos;
using StreamerHub.Api.Services;

namespace StreamerHub.Api.Endpoints;

// /api/posts 주소 모음 (Day 30). 규칙은 PostService에 있고, 여기서는 HTTP만 다뤄요.
public static class PostEndpoints
{
    public static void MapPostEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/posts");

        // 읽기는 누구나
        group.MapGet("/", GetPage);
        group.MapGet("/{id:int}", GetById);

        // 쓰기는 로그인한 사람만 (RequireAuthorization). 수정·삭제는 PostService가 "본인 또는 관리자"인지 한 번 더 봐요
        group.MapPost("/", Create).RequireAuthorization().RequireRateLimiting("write");
        group.MapPut("/{id:int}", Update).RequireAuthorization().RequireRateLimiting("write");
        group.MapDelete("/{id:int}", Delete).RequireAuthorization().RequireRateLimiting("write");
    }

    // GET /api/posts?page=1&pageSize=20 → { items, total, page, pageSize }
    // 쿼리 값에도 [Range]를 붙일 수 있어요. 범위를 벗어나면 400
    private static async Task<Ok<PagedResult<PostListItem>>> GetPage(
        PostService posts,
        [Range(1, 100000, ErrorMessage = "page는 1 이상으로 보내 주세요.")] int page = 1,
        [Range(1, 50, ErrorMessage = "pageSize는 1~50으로 보내 주세요.")] int pageSize = 20)
    {
        return TypedResults.Ok(await posts.ListAsync(page, pageSize));
    }

    // GET /api/posts/7
    private static async Task<Results<Ok<PostDetail>, NotFound>> GetById(int id, PostService posts, ClaimsPrincipal user)
    {
        var post = await posts.GetAsync(id, UserId(user), user.IsInRole(SeedData.AdminRole));
        if (post is null)
        {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(post);
    }

    // POST /api/posts (로그인)
    private static async Task<Created<PostDetail>> Create(PostRequest request, PostService posts, ClaimsPrincipal user)
    {
        // RequireAuthorization을 통과했으니 사용자 Id가 반드시 있어요(!)
        var post = await posts.CreateAsync(UserId(user)!, request);
        return TypedResults.Created($"/api/posts/{post.Id}", post);
    }

    // PUT /api/posts/7 (작성자 또는 관리자, 아니면 403)
    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> Update(
        int id, PostRequest request, PostService posts, ClaimsPrincipal user)
    {
        var result = await posts.UpdateAsync(id, request, UserId(user)!, user.IsInRole(SeedData.AdminRole));
        return ToHttpResult(result);
    }

    // DELETE /api/posts/7 (작성자 또는 관리자, 아니면 403)
    private static async Task<Results<NoContent, NotFound, ForbidHttpResult>> Delete(
        int id, PostService posts, ClaimsPrincipal user)
    {
        var result = await posts.DeleteAsync(id, UserId(user)!, user.IsInRole(SeedData.AdminRole));
        return ToHttpResult(result);
    }

    // 로그인 쿠키 안의 사용자 Id. 로그인하지 않았으면 null
    private static string? UserId(ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier);
    }

    // 서비스의 결과를 HTTP 상태 코드로 바꿔요: 성공 204, 없음 404, 권한 없음 403
    private static Results<NoContent, NotFound, ForbidHttpResult> ToHttpResult(PostChangeResult result)
    {
        if (result == PostChangeResult.NotFound)
        {
            return TypedResults.NotFound();
        }
        if (result == PostChangeResult.Forbidden)
        {
            return TypedResults.Forbid();
        }
        return TypedResults.NoContent();
    }
}
