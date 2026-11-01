using ImageDonation.Api.Services.Storage;

namespace ImageDonation.Tests;

// 지우기만 늘 실패하는 저장소 (Windows에서 다른 프로그램이 파일을 잡고 있을 때처럼). 나머지는 진짜 저장소에 맡긴다
public sealed class FailingDeleteStorage(IImageStorage inner) : IImageStorage
{
    public Task<string> SaveAsync(byte[] content, string extension, CancellationToken ct = default) => inner.SaveAsync(content, extension, ct);

    public Stream? OpenRead(string fileName) => inner.OpenRead(fileName);

    public bool Exists(string fileName) => inner.Exists(fileName);

    public Task DeleteAsync(string fileName, CancellationToken ct = default) =>
        throw new IOException("The process cannot access the file because it is being used by another process.");

    public Task<int> DeleteOlderThanAsync(DateTimeOffset cutoff, CancellationToken ct = default) => inner.DeleteOlderThanAsync(cutoff, ct);
}
