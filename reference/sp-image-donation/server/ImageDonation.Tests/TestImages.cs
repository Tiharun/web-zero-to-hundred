using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Metadata.Profiles.Exif;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace ImageDonation.Tests;

// 테스트 이미지는 파일로 두지 않고 코드로 만든다
public static class TestImages
{
    public const string SecretSoftware = "secret-camera-software";

    // EXIF(기기 정보)가 들어 있는 JPEG
    public static byte[] JpegWithExif(int width, int height)
    {
        using var image = new Image<Rgba32>(width, height);
        image.Mutate(x => x.BackgroundColor(Color.CornflowerBlue));

        var exif = new ExifProfile();
        exif.SetValue(ExifTag.Make, "TestCam");
        exif.SetValue(ExifTag.Software, SecretSoftware);
        image.Metadata.ExifProfile = exif;

        using var output = new MemoryStream();
        image.SaveAsJpeg(output);
        return output.ToArray();
    }

    // 3장면짜리 움직이는 GIF
    public static byte[] AnimatedGif(int width = 40, int height = 30)
    {
        using var image = new Image<Rgba32>(width, height);
        image.Mutate(x => x.BackgroundColor(Color.Red));
        image.Frames.CreateFrame();
        image.Frames.CreateFrame();
        using var output = new MemoryStream();
        image.SaveAsGif(output);
        return output.ToArray();
    }

    public static byte[] Png(int width = 64, int height = 48)
    {
        using var image = new Image<Rgba32>(width, height);
        image.Mutate(x => x.BackgroundColor(Color.Orange));
        using var output = new MemoryStream();
        image.SaveAsPng(output);
        return output.ToArray();
    }
}
