using System.ComponentModel.DataAnnotations;

namespace StreamerHub.Api.Entities;

// 방송 화면(오버레이)에 띄울 공지 (Day 33). 가장 최근 것이 "지금 공지"예요.
public class Notice
{
    public int Id { get; set; }

    [MaxLength(200)]
    public string Message { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}
