using System.ComponentModel.DataAnnotations;
using ImageDonation.Api.Entities;

namespace ImageDonation.Api.Dtos;

// GET/PUT /api/dashboard/settings 의 본문. 범위를 벗어나면 AddValidation()이 400을 돌려준다
public record SettingsDto(
    DonationMode Mode,
    [Range(0, 10_000_000)] int MinCheese,
    bool AutoApprove,
    [Range(3, 30)] int DisplaySeconds,
    [Range(0, 60)] int MinIntervalSeconds,
    [Range(1, StreamerSettings.MaxFileMbLimit)] int MaxFileMb,
    [Required, MaxLength(100)] string[] BannedWords)
{
    public const int MaxBannedWordLength = 30;

    public static SettingsDto From(StreamerSettings s) =>
        new(s.Mode, s.MinCheese, s.AutoApprove, s.DisplaySeconds, s.MinIntervalSeconds, s.MaxFileMb, s.BannedWords);
}

public record OverlayTokenResponse(string OverlayToken);
