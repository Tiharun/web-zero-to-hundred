using System.Buffers.Binary;
using System.IO.Compression;
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

    // 3장면짜리 움직이는 GIF (4×3픽셀, 빨강 → 초록 → 파랑). SkiaSharp은 GIF를 저장하지 못해서 바이트를 그대로 적어 둔다 (113바이트)
    public static byte[] AnimatedGif() => Convert.FromHexString(
        "47494638396104000300810000" +                                     // "GIF89a", 4×3, 전역 색상표 4색
        "FF000000FF000000FF000000" +                                       // 색상표: 빨강, 초록, 파랑, 검정
        "21F904000A0000002C0000000004000300000208040810204080400100" +     // 장면 1: 0.1초, 모두 빨강
        "21F904000A0000002C00000000040003000002084C983061C284490100" +     // 장면 2: 모두 초록
        "21F904000A0000002C0000000004000300000208942851A24489520100" +     // 장면 3: 모두 파랑
        "3B");                                                            // 파일 끝

    // 머리글(IHDR)에는 width×height라고 적혀 있지만 픽셀 데이터는 거의 없는 PNG.
    // 디코딩 전에 크기만 보고 거절하는지 확인할 때 쓴다 (실제로 그만큼 메모리를 쓰는 그림을 만들 필요가 없다)
    public static byte[] PngHeaderClaiming(int width, int height)
    {
        var header = new byte[13];
        BinaryPrimitives.WriteInt32BigEndian(header, width);
        BinaryPrimitives.WriteInt32BigEndian(header.AsSpan(4), height);
        header[8] = 8; // 비트 깊이
        header[9] = 6; // RGBA
        using var zlib = new MemoryStream();
        using (var z = new ZLibStream(zlib, CompressionLevel.Fastest, leaveOpen: true)) z.Write(new byte[16]);
        return [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, .. PngChunk("IHDR", header), .. PngChunk("IDAT", zlib.ToArray()), .. PngChunk("IEND", [])];
    }

    // 큰 JPEG (예: 5000×4000 휴대폰 사진)
    public static byte[] LargeJpeg(int width, int height)
    {
        using var bitmap = TwoColors(width, height, Left, Right);
        return Encode(bitmap, SKEncodedImageFormat.Jpeg);
    }

    private static byte[] PngChunk(string type, byte[] data)
    {
        byte[] typeAndData = [.. Encoding.ASCII.GetBytes(type), .. data];
        var length = new byte[4];
        var crc = new byte[4];
        BinaryPrimitives.WriteInt32BigEndian(length, data.Length);
        BinaryPrimitives.WriteUInt32BigEndian(crc, Crc32(typeAndData)); // PNG는 조각마다 CRC를 검사한다
        return [.. length, .. typeAndData, .. crc];
    }

    private static uint Crc32(ReadOnlySpan<byte> bytes)
    {
        var crc = 0xFFFFFFFFu;
        foreach (var b in bytes)
        {
            crc ^= b;
            for (var bit = 0; bit < 8; bit++) crc = (crc & 1) != 0 ? (crc >> 1) ^ 0xEDB88320u : crc >> 1;
        }
        return ~crc;
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
}
