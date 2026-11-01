using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Services;

// 방송 일정 검색 규칙 (Day 29)
public static class ScheduleQuery
{
    // 시작 시각이 [fromUtc, toUtc) 안에 있는 일정을 빠른 순서로 골라요.
    // 시작은 포함하고 끝은 포함하지 않아요. 그래야 "이번 주"와 "다음 주"를 이어 붙여도 겹치지 않아요.
    // IQueryable이라서 DB(EF Core)에 쓰면 SQL의 WHERE로 바뀌고, 테스트에서는 List에도 그대로 쓸 수 있어요.
    public static IQueryable<Schedule> InRange(IQueryable<Schedule> schedules, DateTime fromUtc, DateTime toUtc)
    {
        return schedules
            .Where(s => s.StartsAt >= fromUtc && s.StartsAt < toUtc)
            .OrderBy(s => s.StartsAt);
    }
}
