using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 방송 일정 하나 (Day 22)
public class Schedule
{
    public int Id { get; set; }

    // 외래 키(FK): 어느 스트리머의 일정인지
    public int StreamerId { get; set; }
    public Streamer? Streamer { get; set; } // 탐색 속성: Include로 함께 불러와요

    [MaxLength(100)]
    public string Title { get; set; } = "";

    // 방송 시작 시각. DB와 API에서는 항상 UTC예요. 한국 시간으로 바꾸는 일은 화면이 해요 (Day 29)
    public DateTime StartsAt { get; set; }

    public int DurationMinutes { get; set; }
}
