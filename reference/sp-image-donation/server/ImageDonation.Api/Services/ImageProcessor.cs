using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Metadata;
using SixLabors.ImageSharp.Processing;

namespace ImageDonation.Api.Services;

// 이미지가 아니거나 너무 크거나 망가진 파일
public sealed class InvalidImageException(string message) : Exception(message);

// 처리된 결과: 항상 WebP
public sealed record ProcessedImage(byte[] Content, string Extension, int Width, int Height);

// 업로드 이미지 검사·정리 (SixLabors.ImageSharp 사용)
// 순서: 매직 넘버 → Identify(형식·크기) → 디코딩 → 방향 보정 → 리사이즈 → 메타데이터 제거 → WebP 재인코딩
// 확장자와 Content-Type은 시청자가 마음대로 바꿀 수 있으므로 믿지 않는다.
public sealed class ImageProcessor
{
    public const int MaxLongSide = 1280;          // 긴 변 최대 1280px
    private const long MaxPixels = 50_000_000;    // 디코딩 전에 거르는 최대 픽셀 수 (압축 폭탄 방지)

    // 애니메이션 GIF·WebP 정책: 첫 장면 1장만 디코딩해 정지 이미지로 만든다 (CPU·메모리 보호)
    // ColorProfileHandling.Convert: 색 프로필(ICC)을 sRGB로 바꾼 뒤 프로필은 버린다
    private static readonly DecoderOptions Decoder = new() { MaxFrames = 1, ColorProfileHandling = ColorProfileHandling.Convert };

    private static readonly WebpEncoder Encoder = new() { FileFormat = WebpFileFormatType.Lossy, Quality = 80 };

    // 파일 맨 앞 몇 바이트(매직 넘버)로 형식을 확인한다: JPEG·PNG·GIF·WebP만 허용
    public static bool HasAllowedSignature(ReadOnlySpan<byte> h)
    {
        bool jpeg = h.Length >= 3 && h[0] == 0xFF && h[1] == 0xD8 && h[2] == 0xFF;
        bool png = h.StartsWith((ReadOnlySpan<byte>)[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        bool gif = h.StartsWith("GIF87a"u8) || h.StartsWith("GIF89a"u8);
        bool webp = h.Length >= 12 && h[..4].SequenceEqual("RIFF"u8) && h[8..12].SequenceEqual("WEBP"u8);
        return jpeg || png || gif || webp;
    }

    public ProcessedImage Process(byte[] input)
    {
        if (!HasAllowedSignature(input))
        {
            throw new InvalidImageException("JPEG·PNG·WebP·GIF 이미지만 올릴 수 있어요.");
        }

        try
        {
            // 1) 전체를 풀기 전에 머리글만 읽어 크기를 확인한다
            var info = Image.Identify(Decoder, input);
            if ((long)info.Width * info.Height > MaxPixels)
            {
                throw new InvalidImageException("이미지 해상도가 너무 커요.");
            }

            // 2) 실제로 디코딩해 본다: 머리글만 이미지인 가짜 파일은 여기서 걸린다
            using var image = Image.Load(Decoder, input);

            image.Mutate(x =>
            {
                x.AutoOrient(); // EXIF의 회전 정보를 픽셀에 적용 (EXIF를 지워도 방향이 맞도록)
                if (Math.Max(image.Width, image.Height) > MaxLongSide)
                {
                    // Max: 비율을 유지하며 1280x1280 상자 안에 들어가게 줄인다
                    x.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(MaxLongSide, MaxLongSide) });
                }
            });

            // 3) 위치(GPS)·기기 정보가 들어 있을 수 있는 메타데이터를 모두 지운다
            StripMetadata(image.Metadata);
            foreach (var frame in image.Frames)
            {
                frame.Metadata.ExifProfile = null;
                frame.Metadata.IccProfile = null;
                frame.Metadata.IptcProfile = null;
                frame.Metadata.XmpProfile = null;
                frame.Metadata.CicpProfile = null;
            }

            // 4) 새 파일로 다시 저장(재인코딩): 원본 파일의 바이트는 하나도 남지 않는다
            using var output = new MemoryStream();
            image.Save(output, Encoder);
            return new ProcessedImage(output.ToArray(), ".webp", image.Width, image.Height);
        }
        catch (ImageFormatException)
        {
            // UnknownImageFormatException, InvalidImageContentException 모두 여기로 온다
            throw new InvalidImageException("이미지 파일이 손상되었거나 읽을 수 없어요.");
        }
    }

    private static void StripMetadata(ImageMetadata metadata)
    {
        metadata.ExifProfile = null;
        metadata.IccProfile = null;
        metadata.IptcProfile = null;
        metadata.XmpProfile = null;
        metadata.CicpProfile = null;
    }
}
