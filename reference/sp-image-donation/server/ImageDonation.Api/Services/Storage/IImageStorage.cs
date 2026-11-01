namespace ImageDonation.Api.Services.Storage;

// 이미지 저장소. 지금은 로컬 폴더(LocalImageStorage)이고, 나중에 S3 호환 객체 스토리지로 바꿔 끼울 수 있다
public interface IImageStorage
{
    // 저장하고, 무작위로 만든 파일 이름(예: 3f2a...c1.webp)을 돌려준다
    Task<string> SaveAsync(byte[] content, string extension, CancellationToken ct = default);

    // 없거나 이름이 이상하면 null
    Stream? OpenRead(string fileName);

    bool Exists(string fileName);

    Task DeleteAsync(string fileName, CancellationToken ct = default);

    // 보관 기간이 지난 파일을 지우고 지운 개수를 돌려준다
    Task<int> DeleteOlderThanAsync(DateTimeOffset cutoff, CancellationToken ct = default);
}
