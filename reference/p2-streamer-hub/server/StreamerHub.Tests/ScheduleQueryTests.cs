using StreamerHub.Api.Entities;
using StreamerHub.Api.Services;

namespace StreamerHub.Tests;

// ScheduleQuery 단위 테스트 (Day 29, 35): 한국 날짜 하루를 UTC 범위로 바꿔서 거르면 맞게 나오는지 확인해요.
public class ScheduleQueryTests
{
    [Fact]
    public void ScheduleQuery_FiltersByUtcRange()
    {
        // 한국 시간 2026-11-02(월) 0시 ~ 11-03 0시 = UTC 2026-11-01 15:00 ~ 11-02 15:00
        var fromUtc = new DateTime(2026, 11, 1, 15, 0, 0, DateTimeKind.Utc);
        var toUtc = new DateTime(2026, 11, 2, 15, 0, 0, DateTimeKind.Utc);

        var schedules = new List<Schedule>
        {
            // 한국 11/1 23:59 → 전날이라 빠져요
            new() { Id = 1, Title = "전날 밤 방송", StartsAt = new DateTime(2026, 11, 1, 14, 59, 0, DateTimeKind.Utc) },
            // 한국 11/2 20:00 → 들어가요
            new() { Id = 2, Title = "저녁 방송", StartsAt = new DateTime(2026, 11, 2, 11, 0, 0, DateTimeKind.Utc) },
            // 한국 11/2 08:00 → UTC 날짜는 11/1이지만 한국 날짜로는 11/2라서 들어가요
            new() { Id = 3, Title = "아침 방송", StartsAt = new DateTime(2026, 11, 1, 23, 0, 0, DateTimeKind.Utc) },
            // 한국 11/3 00:00 → 끝 시각은 범위에 넣지 않아서 빠져요
            new() { Id = 4, Title = "다음 날 방송", StartsAt = new DateTime(2026, 11, 2, 15, 0, 0, DateTimeKind.Utc) },
        };

        var result = ScheduleQuery.InRange(schedules.AsQueryable(), fromUtc, toUtc).ToList();

        // 시작 시각 순서로 정렬되어 나와요: 아침(3) → 저녁(2)
        Assert.Equal(new[] { 3, 2 }, result.Select(s => s.Id));
    }
}
