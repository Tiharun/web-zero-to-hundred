namespace StreamerHub.Api.Dtos;

// 페이지 하나 분량의 목록 (Day 30). JSON으로는 { items, total, page, pageSize }
// <T>는 제네릭: 글 목록이든 무엇이든 같은 모양으로 담을 수 있어요
public record PagedResult<T>(List<T> Items, int Total, int Page, int PageSize);
