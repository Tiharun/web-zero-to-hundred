using System.Text;
using ImageDonation.Api.Services;
using SkiaSharp;

namespace ImageDonation.Tests;

public class ImageProcessorTests
{
    private readonly ImageProcessor _processor = new();

    private static bool Contains(byte[] bytes, string text) => bytes.AsSpan().IndexOf(Encoding.ASCII.GetBytes(text)) >= 0;

    // 결과 파일을 다시 읽어 형식·크기·방향을 확인한다
    private static (SKEncodedImageFormat Format, int Width, int Height, SKEncodedOrigin Origin, int Frames) Inspect(byte[] file)
    {
        using var data = SKData.CreateCopy(file);
        using var codec = SKCodec.Create(data);
        return (codec.EncodedFormat, codec.Info.Width, codec.Info.Height, codec.EncodedOrigin, codec.FrameCount);
    }

    private static SKColor PixelAt(byte[] file, int x, int y)
    {
        using var bitmap = SKBitmap.Decode(file);
        return bitmap.GetPixel(x, y);
    }

    [Fact]
    public void MagicNumber_RejectsRenamedTextFile()
    {
        // 텍스트 파일의 이름만 photo.jpg로 바꾼 경우: 내용 앞부분이 이미지 형식이 아니다
        var renamedText = Encoding.UTF8.GetBytes("이건 사진이 아니라 텍스트 파일이에요.");

        Assert.False(ImageProcessor.HasAllowedSignature(renamedText));
        Assert.Throws<InvalidImageException>(() => _processor.Process(renamedText));
    }

    [Fact]
    public void MagicNumber_AcceptsJpegPngGifWebp()
    {
        Assert.True(ImageProcessor.HasAllowedSignature([0xFF, 0xD8, 0xFF, 0xE0]));
        Assert.True(ImageProcessor.HasAllowedSignature([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));
        Assert.True(ImageProcessor.HasAllowedSignature("GIF89a"u8));
        Assert.True(ImageProcessor.HasAllowedSignature("RIFF\0\0\0\0WEBPVP8 "u8));
        Assert.False(ImageProcessor.HasAllowedSignature("<svg xmlns="u8)); // SVG는 스크립트를 품을 수 있어 받지 않는다
    }

    [Fact]
    public void Decode_RejectsFakeHeaderWithGarbage()
    {
        // 앞 3바이트만 JPEG처럼 꾸민 가짜 파일: 매직 넘버는 통과해도 디코딩에서 걸린다
        byte[] fake = [0xFF, 0xD8, 0xFF, .. Encoding.ASCII.GetBytes("<script>alert(1)</script>")];

        Assert.True(ImageProcessor.HasAllowedSignature(fake));
        Assert.Throws<InvalidImageException>(() => _processor.Process(fake));
    }

    [Fact]
    public void ImageProcessor_StripsExif_AndResizes()
    {
        var input = TestImages.JpegWithExif(2000, 1000);
        // 전제: 원본에는 EXIF가 들어 있다 (바이트에 "Exif"와 소프트웨어 이름이 보인다)
        Assert.True(Contains(input, "Exif"));
        Assert.True(Contains(input, TestImages.SecretSoftware));

        var result = _processor.Process(input);

        var (format, width, height, _, _) = Inspect(result.Content);
        Assert.Equal(".webp", result.Extension);
        Assert.Equal(SKEncodedImageFormat.Webp, format);
        Assert.Equal((1280, 640), (width, height)); // 긴 변이 1280px로 줄고 비율(2:1)은 유지된다
        Assert.Equal((1280, 640), (result.Width, result.Height));
        // 재인코딩한 파일에는 EXIF·색 프로필 조각도, 소프트웨어 이름도 없다
        Assert.False(Contains(result.Content, "EXIF"));
        Assert.False(Contains(result.Content, "Exif"));
        Assert.False(Contains(result.Content, "ICCP"));
        Assert.False(Contains(result.Content, TestImages.SecretSoftware));
    }

    [Fact]
    public void ImageProcessor_AppliesExifOrientation()
    {
        // 가로 200 × 세로 100, 왼쪽 빨강·오른쪽 파랑. EXIF 방향 6(시계 방향 90도로 돌려서 볼 것)
        var input = TestImages.JpegWithExif(200, 100, orientation: 6);
        Assert.Equal(SKEncodedOrigin.RightTop, Inspect(input).Origin); // 전제: 디코더가 EXIF 방향을 읽는다

        var result = _processor.Process(input);

        var (_, width, height, origin, _) = Inspect(result.Content);
        Assert.Equal((100, 200), (width, height));          // 돌려서 세로 사진이 됐다
        Assert.Equal(SKEncodedOrigin.TopLeft, origin);       // 방향 정보는 남지 않는다 (이미 픽셀에 적용)
        var top = PixelAt(result.Content, 50, 20);           // 왼쪽(빨강)이 위로 간다
        var bottom = PixelAt(result.Content, 50, 180);       // 오른쪽(파랑)이 아래로 간다
        Assert.True(top.Red > 200 && top.Blue < 60, $"위쪽 색 {top}");
        Assert.True(bottom.Blue > 200 && bottom.Red < 60, $"아래쪽 색 {bottom}");
    }

    [Fact]
    public void ImageProcessor_AnimatedGif_KeepsFirstFrameOnly()
    {
        var input = TestImages.AnimatedGif();
        Assert.Equal(3, Inspect(input).Frames); // 전제: 원본은 3장면(빨강 → 초록 → 파랑)

        var result = _processor.Process(input);

        // 정책: 정지 이미지 1장 (Skia는 정지 WebP의 장면 수를 0으로 알려 주므로 "1 이하"로 확인한다)
        Assert.InRange(Inspect(result.Content).Frames, 0, 1);
        var pixel = PixelAt(result.Content, 1, 1);
        Assert.True(pixel.Red > 200 && pixel.Green < 60 && pixel.Blue < 60, $"첫 장면(빨강)이어야 해요: {pixel}");
    }

    [Fact]
    public void ImageProcessor_RejectsHugeResolutionBeforeDecoding()
    {
        // 머리글이 4억 픽셀이라고 주장 → 원본 상한(1억) 초과
        var huge = Assert.Throws<InvalidImageException>(() => _processor.Process(TestImages.PngHeaderClaiming(20_000, 20_000)));
        // 2천만 픽셀 PNG: PNG는 줄여서 풀 수 없으니 그대로 풀면 80MB → 디코딩 상한(4096×4096) 초과
        var big = Assert.Throws<InvalidImageException>(() => _processor.Process(TestImages.PngHeaderClaiming(5000, 4000)));

        Assert.Contains("해상도", huge.Message);
        Assert.Contains("해상도", big.Message);
    }

    [Fact]
    public void ImageProcessor_LargeJpeg_IsDecodedScaledDown()
    {
        // 5000×4000(2천만 픽셀) JPEG도 받는다: 1/8 단위로 줄여서 풀기 때문에 디코딩 상한 안에 들어온다
        var result = _processor.Process(TestImages.LargeJpeg(5000, 4000));

        Assert.Equal((1280, 1024), (result.Width, result.Height));
    }

    [Fact]
    public void ImageProcessor_DoesNotEnlargeSmallImages()
    {
        var result = _processor.Process(TestImages.Png(64, 48));

        Assert.Equal((64, 48), (result.Width, result.Height));
    }
}
