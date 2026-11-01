using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 스트리머 한 명 = Streamers 테이블의 한 줄 (Day 20)
public class Streamer
{
    public int Id { get; set; } // 기본 키(PK). 이름이 Id라서 EF Core가 알아서 키로 써요

    [MaxLength(50)]
    public string Name { get; set; } = "";

    // "chzzk" | "youtube" | "soop" | "other" 중 하나 (검사는 StreamerRequest에서 해요)
    [MaxLength(20)]
    public string Platform { get; set; } = "other";

    [MaxLength(200)]
    public string ChannelUrl { get; set; } = "";

    [MaxLength(500)]
    public string Bio { get; set; } = "";

    [MaxLength(200)]
    public string? AvatarUrl { get; set; } // ?가 붙으면 비어 있어도(null) 돼요

    public DateTime CreatedAt { get; set; } // 항상 UTC

    // 1:N 관계: 스트리머 한 명에게 일정이 여러 개 (Day 22)
    public List<Schedule> Schedules { get; set; } = new List<Schedule>();
}
