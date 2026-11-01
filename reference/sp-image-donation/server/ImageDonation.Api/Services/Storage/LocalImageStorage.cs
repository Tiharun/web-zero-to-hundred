using System.Text.RegularExpressions;

namespace ImageDonation.Api.Services.Storage;

// 서버 PC의 폴더에 이미지를 저장한다 (설정 Storage:MediaPath, 기본은 프로젝트 폴더의 media)
public sealed partial class LocalImageStorage : IImageStorage
{
    private readonly string _root;

    public LocalImageStorage(IConfiguration configuration, IWebHostEnvironment env)
    {
        _root = Path.GetFullPath(configuration["Storage:MediaPath"] ?? "media", env.ContentRootPath);
        Directory.CreateDirectory(_root);
    }

    // 우리가 만든 이름(GUID 32자리 + .webp)만 허용 → "../" 같은 경로 조작을 원천 차단
    // 끝은 $가 아니라 \z: $는 맨 끝의 줄바꿈("…webp\n")도 통과시킨다
    [GeneratedRegex("^[0-9a-f]{32}\\.webp\\z")]
    private static partial Regex FileNamePattern();

    public static bool IsValidFileName(string fileName) => FileNamePattern().IsMatch(fileName);

    public async Task<string> SaveAsync(byte[] content, string extension, CancellationToken ct = default)
    {
        var fileName = $"{Guid.NewGuid():N}{extension}"; // 시청자가 보낸 파일 이름은 쓰지 않는다
        if (!IsValidFileName(fileName)) throw new ArgumentException("지원하지 않는 확장자예요.", nameof(extension));
        await File.WriteAllBytesAsync(Path.Combine(_root, fileName), content, ct);
        return fileName;
    }

    public Stream? OpenRead(string fileName) =>
        Exists(fileName) ? File.OpenRead(Path.Combine(_root, fileName)) : null;

    public bool Exists(string fileName) => IsValidFileName(fileName) && File.Exists(Path.Combine(_root, fileName));

    public Task DeleteAsync(string fileName, CancellationToken ct = default)
    {
        if (IsValidFileName(fileName)) File.Delete(Path.Combine(_root, fileName)); // 없는 파일이어도 오류가 나지 않는다
        return Task.CompletedTask;
    }

    public Task<int> DeleteOlderThanAsync(DateTimeOffset cutoff, CancellationToken ct = default)
    {
        var deleted = 0;
        foreach (var file in new DirectoryInfo(_root).EnumerateFiles())
        {
            if (IsValidFileName(file.Name) && file.LastWriteTimeUtc < cutoff.UtcDateTime)
            {
                file.Delete();
                deleted++;
            }
        }
        return Task.FromResult(deleted);
    }
}
