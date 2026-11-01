using System.ComponentModel.DataAnnotations;
using StreamerHub.Api.Entities;

namespace StreamerHub.Api.Dtos;

// 요청: 관리자가 일정을 등록·수정할 때 보내는 값
public record ScheduleRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "스트리머를 골라 주세요.")]
    public int StreamerId { get; init; }

    [Required(ErrorMessage = "방송 제목을 입력해 주세요.")]
    [StringLength(100, ErrorMessage = "방송 제목은 100자까지 쓸 수 있어요.")]
    public string Title { get; init; } = "";

    // 시작 시각은 UTC로 보내요. 예: "2026-11-02T11:00:00Z" (끝의 Z = UTC)
    public DateTime StartsAt { get; init; }

    [Range(10, 1440, ErrorMessage = "방송 길이는 10분에서 1440분(24시간) 사이로 써 주세요.")]
    public int DurationMinutes { get; init; } = 60;
}

// 응답: 일정 하나. 화면에 스트리머 이름도 보여 주려고 함께 담아요
public record ScheduleResponse(
    int Id,
    int StreamerId,
    string StreamerName,
    string Title,
    DateTime StartsAt,
    int DurationMinutes)
{
    // schedule.Streamer는 Include로 함께 불러와 둬야 해요(!는 "null이 아니다"라는 약속)
    public static ScheduleResponse From(Schedule schedule) => new(
        schedule.Id,
        schedule.StreamerId,
        schedule.Streamer!.Name,
        schedule.Title,
        schedule.StartsAt,
        schedule.DurationMinutes);
}
