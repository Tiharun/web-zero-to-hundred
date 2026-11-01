using SkiaSharp;

namespace ImageDonation.Api.Services;

// 이미지가 아니거나 너무 크거나 망가진 파일
public sealed class InvalidImageException(string message) : Exception(message);

// 처리된 결과: 항상 WebP
public sealed record ProcessedImage(byte[] Content, string Extension, int Width, int Height);

// 업로드 이미지 검사·정리 (SkiaSharp 사용, MIT 라이선스)
// 순서: 매직 넘버 → 머리글 읽기(형식·크기) → 첫 장면 디코딩 → 리사이즈 → 방향 보정 → WebP 재인코딩
// 확장자와 Content-Type은 시청자가 마음대로 바꿀 수 있으므로 믿지 않는다.
// 재인코딩은 "픽셀만" 새 파일로 쓰기 때문에 EXIF(위치·기기 정보) 같은 메타데이터는 따라가지 않는다.
// SKData·SKCodec·SKBitmap·SKImage는 네이티브 메모리를 쓰므로 모두 using으로 바로 돌려준다.
public sealed class ImageProcessor
{
    public const int MaxLongSide = 1280;       // 긴 변 최대 1280px
    private const long MaxPixels = 50_000_000; // 디코딩 전에 거르는 최대 픽셀 수 (압축 폭탄 방지)
    private const int WebpQuality = 80;

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

        // 1) 전체를 풀기 전에 머리글만 읽는다. 이미지로 읽을 수 없으면 codec이 null
        using var data = SKData.CreateCopy(input);
        using var codec = SKCodec.Create(data) ?? throw Unreadable();
        if (codec.EncodedFormat is not (SKEncodedImageFormat.Jpeg or SKEncodedImageFormat.Png
            or SKEncodedImageFormat.Gif or SKEncodedImageFormat.Webp))
        {
            throw new InvalidImageException("JPEG·PNG·WebP·GIF 이미지만 올릴 수 있어요.");
        }
        if ((long)codec.Info.Width * codec.Info.Height > MaxPixels)
        {
            throw new InvalidImageException("이미지 해상도가 너무 커요.");
        }

        // 2) 실제로 디코딩해 본다: 머리글만 이미지인 가짜 파일은 여기서 걸린다
        using var decoded = DecodeFirstFrame(codec);

        // 3) 긴 변이 1280px를 넘으면 줄인다 (작은 이미지는 그대로)
        using var resized = ShrinkToFit(decoded); // 줄일 필요가 없으면 null
        var source = resized ?? decoded;

        // 4) EXIF의 방향 정보를 픽셀에 적용한다 (EXIF를 버려도 휴대폰 세로 사진이 똑바로 보이도록)
        using var oriented = ApplyOrigin(source, codec.EncodedOrigin);

        // 5) WebP로 새로 저장(재인코딩): 원본 파일의 바이트(메타데이터 포함)는 하나도 남지 않는다
        using var image = SKImage.FromBitmap(oriented);
        using var encoded = image.Encode(SKEncodedImageFormat.Webp, WebpQuality)
            ?? throw new InvalidOperationException("WebP로 저장하지 못했어요.");
        return new ProcessedImage(encoded.ToArray(), ".webp", oriented.Width, oriented.Height);
    }

    // 첫 장면(frameIndex 0)만 디코딩한다.
    // 애니메이션 GIF·WebP 정책: 첫 장면 1장만 정지 이미지로 쓴다 (CPU·메모리 보호)
    private static SKBitmap DecodeFirstFrame(SKCodec codec)
    {
        // sRGB로 바꿔서 푼다: 원본의 색 프로필(ICC)이 달라도 색이 비슷하게 보이고, 프로필은 버린다
        var info = new SKImageInfo(codec.Info.Width, codec.Info.Height, SKColorType.Rgba8888, AlphaOf(codec), SKColorSpace.CreateSrgb());
        var bitmap = new SKBitmap(info);
        var result = codec.GetPixels(info, bitmap.GetPixels(), new SKCodecOptions(0));
        if (result != SKCodecResult.Success) // 잘린 파일(IncompleteInput)도 받지 않는다
        {
            bitmap.Dispose();
            throw Unreadable();
        }
        return bitmap;
    }

    // 비율을 유지하며 긴 변을 1280px로 줄인다. 이미 작으면 null
    private static SKBitmap? ShrinkToFit(SKBitmap source)
    {
        var longSide = Math.Max(source.Width, source.Height);
        if (longSide <= MaxLongSide) return null;

        var scale = (double)MaxLongSide / longSide;
        var size = new SKSizeI(
            Math.Max(1, (int)Math.Round(source.Width * scale)),
            Math.Max(1, (int)Math.Round(source.Height * scale)));
        // Mitchell(큐빅) 방식: 줄일 때 경계가 부드럽다
        return source.Resize(source.Info.WithSize(size), new SKSamplingOptions(SKCubicResampler.Mitchell))
            ?? throw new InvalidOperationException("이미지 크기를 바꾸지 못했어요.");
    }

    // EXIF 방향 값(1~8)대로 돌리거나 뒤집은 새 그림을 만든다
    private static SKBitmap ApplyOrigin(SKBitmap source, SKEncodedOrigin origin)
    {
        int w = source.Width, h = source.Height;
        // 5~8번은 90도 돌아간 사진이라 가로·세로가 바뀐다
        bool sideways = origin is SKEncodedOrigin.LeftTop or SKEncodedOrigin.RightTop
            or SKEncodedOrigin.RightBottom or SKEncodedOrigin.LeftBottom;

        // 색 공간을 지정하지 않은 새 그림: 인코더가 색 프로필(ICC)을 붙이지 않는다
        var result = new SKBitmap(new SKImageInfo(sideways ? h : w, sideways ? w : h, SKColorType.Rgba8888, source.AlphaType));
        using var canvas = new SKCanvas(result);
        switch (origin)
        {
            case SKEncodedOrigin.TopRight: // 2: 좌우 뒤집기
                canvas.Translate(w, 0);
                canvas.Scale(-1, 1);
                break;
            case SKEncodedOrigin.BottomRight: // 3: 180도
                canvas.Translate(w, h);
                canvas.RotateDegrees(180);
                break;
            case SKEncodedOrigin.BottomLeft: // 4: 위아래 뒤집기
                canvas.Translate(0, h);
                canvas.Scale(1, -1);
                break;
            case SKEncodedOrigin.LeftTop: // 5: 대각선으로 뒤집기
                canvas.Scale(-1, 1);
                canvas.RotateDegrees(90);
                break;
            case SKEncodedOrigin.RightTop: // 6: 시계 방향 90도 (휴대폰 세로 사진에 흔함)
                canvas.Translate(h, 0);
                canvas.RotateDegrees(90);
                break;
            case SKEncodedOrigin.RightBottom: // 7: 반대 대각선으로 뒤집기
                canvas.Translate(h, w);
                canvas.RotateDegrees(90);
                canvas.Scale(-1, 1);
                break;
            case SKEncodedOrigin.LeftBottom: // 8: 반시계 방향 90도
                canvas.Translate(0, w);
                canvas.RotateDegrees(-90);
                break;
        }
        // 90도 단위로 돌리기만 하므로 픽셀이 칸에 딱 맞는다: 기본 샘플링이면 충분하다
        canvas.DrawBitmap(source, 0, 0, SKSamplingOptions.Default, null);
        return result;
    }

    // 투명한 부분이 없는 형식(JPEG 등)은 Opaque로 둬서 WebP에 쓸데없는 투명도 정보가 붙지 않게 한다
    private static SKAlphaType AlphaOf(SKCodec codec) =>
        codec.Info.AlphaType == SKAlphaType.Opaque ? SKAlphaType.Opaque : SKAlphaType.Premul;

    private static InvalidImageException Unreadable() => new("이미지 파일이 손상되었거나 읽을 수 없어요.");
}
