using System.Text;
using ImageDonation.Api.Services;
using SixLabors.ImageSharp;

namespace ImageDonation.Tests;

public class ImageProcessorTests
{
    private readonly ImageProcessor _processor = new();

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
        Assert.NotNull(Image.Identify(input).Metadata.ExifProfile); // 전제: 원본에는 EXIF가 있다

        var result = _processor.Process(input);

        var info = Image.Identify(result.Content);
        Assert.Equal(".webp", result.Extension);
        Assert.Equal("Webp", info.Metadata.DecodedImageFormat?.Name, ignoreCase: true);
        Assert.Equal(1280, info.Width);  // 긴 변이 1280px로 줄고
        Assert.Equal(640, info.Height);  // 비율(2:1)은 유지된다
        Assert.Null(info.Metadata.ExifProfile);
        Assert.DoesNotContain(TestImages.SecretSoftware, Encoding.ASCII.GetString(result.Content));
    }

    [Fact]
    public void ImageProcessor_AnimatedGif_KeepsFirstFrameOnly()
    {
        var input = TestImages.AnimatedGif();
        Assert.Equal(3, Image.Identify(input).FrameCount); // 전제: 원본은 3장면

        var result = _processor.Process(input);

        using var decoded = Image.Load(result.Content); // 정지 WebP는 Identify의 FrameCount가 0이라 직접 디코딩해서 센다
        Assert.Single(decoded.Frames);                  // 정책: 첫 장면만 정지 이미지로
    }

    [Fact]
    public void ImageProcessor_DoesNotEnlargeSmallImages()
    {
        var result = _processor.Process(TestImages.Png(64, 48));

        Assert.Equal((64, 48), (result.Width, result.Height));
    }
}
