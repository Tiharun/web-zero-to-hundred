using System.Text;
using SkiaSharp;

namespace ImageDonation.Tests;

// 테스트 이미지는 파일로 두지 않고 코드로 만든다
public static class TestImages
{
    public const string SecretSoftware = "secret-camera-software";

    public static readonly SKColor Left = SKColors.Red;   // 그림 왼쪽 절반
    public static readonly SKColor Right = SKColors.Blue; // 그림 오른쪽 절반

    public static byte[] Png(int width = 64, int height = 48)
    {
        using var bitmap = TwoColors(width, height, SKColors.Orange, SKColors.Orange);
        return Encode(bitmap, SKEncodedImageFormat.Png);
    }

    // EXIF(제조사·소프트웨어·방향)를 직접 써 넣은 JPEG. 왼쪽 절반 빨강, 오른쪽 절반 파랑
    // orientation 6 = "시계 방향으로 90도 돌려서 보라"는 휴대폰 세로 사진의 흔한 값
    public static byte[] JpegWithExif(int width, int height, ushort orientation = 1)
    {
        using var bitmap = TwoColors(width, height, Left, Right);
        var jpeg = Encode(bitmap, SKEncodedImageFormat.Jpeg);
        // JPEG는 FF D8(SOI)로 시작한다. 그 바로 뒤에 EXIF(APP1) 조각을 끼워 넣는다
        return [.. jpeg.AsSpan(0, 2), .. ExifSegment(orientation), .. jpeg.AsSpan(2)];
    }

    // 3장면짜리 움직이는 GIF (빨강 → 초록 → 파랑). SkiaSharp은 GIF를 저장하지 못해서 바이트를 직접 쓴다
    public static byte[] AnimatedGif(int width = 40, int height = 30)
    {
        using var stream = new MemoryStream();
        using var w = new BinaryWriter(stream); // BinaryWriter는 리틀 엔디언: GIF와 같다
        w.Write("GIF89a"u8);
        w.Write((ushort)width);
        w.Write((ushort)height);
        w.Write((byte)0b1000_0001); // 전역 색상표 있음, 4색
        w.Write((byte)0);           // 배경색 번호
        w.Write((byte)0);           // 화면 비율
        w.Write([255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0]); // 색상표: 빨강, 초록, 파랑, 검정

        for (byte color = 0; color < 3; color++)
        {
            w.Write([0x21, 0xF9, 0x04, 0x00, 10, 0, 0x00, 0x00]); // 그래픽 제어 확장: 0.1초씩 보여 주기
            w.Write((byte)0x2C);                                   // 그림 시작
            w.Write((ushort)0);
            w.Write((ushort)0);
            w.Write((ushort)width);
            w.Write((ushort)height);
            w.Write((byte)0);
            w.Write((byte)2); // LZW 최소 코드 크기
            var lzw = SolidLzw(width * height, color);
            for (var i = 0; i < lzw.Length; i += 255) // 데이터는 255바이트 이하 조각으로 나눈다
            {
                var length = Math.Min(255, lzw.Length - i);
                w.Write((byte)length);
                w.Write(lzw, i, length);
            }
            w.Write((byte)0); // 이 그림의 데이터 끝
        }
        w.Write((byte)0x3B); // 파일 끝
        w.Flush();
        return stream.ToArray();
    }

    private static SKBitmap TwoColors(int width, int height, SKColor left, SKColor right)
    {
        var bitmap = new SKBitmap(width, height);
        using var canvas = new SKCanvas(bitmap);
        using var paint = new SKPaint { Color = left };
        canvas.DrawRect(0, 0, width / 2f, height, paint);
        paint.Color = right;
        canvas.DrawRect(width / 2f, 0, width - width / 2f, height, paint);
        return bitmap;
    }

    private static byte[] Encode(SKBitmap bitmap, SKEncodedImageFormat format)
    {
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(format, 95);
        return data.ToArray();
    }

    // EXIF = "Exif\0\0" + TIFF 구조(머리글 + IFD0 항목 3개 + 글자 데이터)
    private static byte[] ExifSegment(ushort orientation)
    {
        var make = Encoding.ASCII.GetBytes("TestCam\0");
        var software = Encoding.ASCII.GetBytes(SecretSoftware + "\0");
        const int entries = 3;
        const int dataStart = 8 + 2 + entries * 12 + 4; // 머리글 8 + 항목 수 2 + 항목들 + 다음 IFD 위치 4

        using var tiff = new MemoryStream();
        using var w = new BinaryWriter(tiff);
        w.Write("II"u8);      // 리틀 엔디언
        w.Write((ushort)42);
        w.Write(8u);          // IFD0 위치
        w.Write((ushort)entries);
        // 항목: 태그, 형식(2=글자, 3=숫자), 개수, 값(4바이트 이하) 또는 데이터 위치
        w.Write((ushort)0x010F); w.Write((ushort)2); w.Write((uint)make.Length); w.Write((uint)dataStart);                   // Make
        w.Write((ushort)0x0112); w.Write((ushort)3); w.Write(1u); w.Write((uint)orientation);                                 // Orientation
        w.Write((ushort)0x0131); w.Write((ushort)2); w.Write((uint)software.Length); w.Write((uint)(dataStart + make.Length)); // Software
        w.Write(0u);          // 다음 IFD 없음
        w.Write(make);
        w.Write(software);
        w.Flush();

        byte[] payload = [.. "Exif\0\0"u8, .. tiff.ToArray()];
        var length = payload.Length + 2; // 길이 칸(2바이트, 빅 엔디언)은 자기 자신을 포함한다
        return [0xFF, 0xE1, (byte)(length >> 8), (byte)length, .. payload];
    }

    // 한 가지 색으로 채운 그림의 LZW 데이터.
    // 글자 2개마다 Clear(4)를 넣어 사전이 커지지 않게 하면 코드 길이가 3비트로 고정된다 (압축은 안 되지만 올바른 GIF)
    private static byte[] SolidLzw(int pixelCount, byte colorIndex)
    {
        const int clear = 4, end = 5, bits = 3;
        var codes = new List<int>();
        for (var i = 0; i < pixelCount; i++)
        {
            if (i % 2 == 0) codes.Add(clear);
            codes.Add(colorIndex);
        }
        codes.Add(end);

        var output = new List<byte>();
        int buffer = 0, count = 0;
        foreach (var code in codes) // 코드를 낮은 비트부터 차례로 채운다
        {
            buffer |= code << count;
            count += bits;
            while (count >= 8)
            {
                output.Add((byte)buffer);
                buffer >>= 8;
                count -= 8;
            }
        }
        if (count > 0) output.Add((byte)buffer);
        return [.. output];
    }
}
