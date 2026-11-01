using System.Diagnostics;
using System.Text;

namespace ImageDonation.Tests;

// tools/chzzk-emulator/emulator.cjs(socket.io 2.5.0)를 빈 포트로 띄우고, 끝나면 그 프로세스만 끈다
public sealed class ChzzkEmulator : IAsyncDisposable
{
    private readonly Process _process;
    private readonly StringBuilder _output = new();

    private ChzzkEmulator(Process process) => _process = process;

    public int Port { get; private set; }

    public string Output
    {
        get { lock (_output) return _output.ToString(); }
    }

    public static async Task<ChzzkEmulator> StartAsync()
    {
        var dir = FindEmulatorDirectory();
        if (!Directory.Exists(Path.Combine(dir, "node_modules", "socket.io")))
        {
            // 처음 한 번은 에뮬레이터 의존성(socket.io@2.5.0)을 설치한다
            await RunAsync("npm", "ci --no-audit --no-fund", dir);
        }

        var process = Process.Start(new ProcessStartInfo("node", "emulator.cjs 0")
        {
            WorkingDirectory = dir,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
        })!;
        var emulator = new ChzzkEmulator(process);
        var listening = new TaskCompletionSource<int>();

        process.OutputDataReceived += (_, e) =>
        {
            if (e.Data is null) return;
            lock (emulator._output) emulator._output.AppendLine(e.Data);
            if (e.Data.StartsWith("LISTENING ")) listening.TrySetResult(int.Parse(e.Data["LISTENING ".Length..]));
        };
        process.ErrorDataReceived += (_, e) =>
        {
            if (e.Data is not null) lock (emulator._output) emulator._output.AppendLine(e.Data);
        };
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();

        emulator.Port = await listening.Task.WaitAsync(TimeSpan.FromSeconds(20));
        return emulator;
    }

    public async ValueTask DisposeAsync()
    {
        if (!_process.HasExited)
        {
            _process.Kill(entireProcessTree: true);
            await _process.WaitForExitAsync();
        }
        _process.Dispose();
    }

    private static string FindEmulatorDirectory()
    {
        // 테스트 실행 폴더(bin/...)에서 위로 올라가며 tools/chzzk-emulator를 찾는다
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            var candidate = Path.Combine(dir.FullName, "tools", "chzzk-emulator");
            if (File.Exists(Path.Combine(candidate, "emulator.cjs"))) return candidate;
        }
        throw new DirectoryNotFoundException("tools/chzzk-emulator 폴더를 찾지 못했어요.");
    }

    private static async Task RunAsync(string file, string args, string dir)
    {
        // Windows에서 npm은 npm.cmd라서 셸을 통해 실행한다
        var psi = OperatingSystem.IsWindows()
            ? new ProcessStartInfo("cmd.exe", $"/c {file} {args}")
            : new ProcessStartInfo(file, args);
        psi.WorkingDirectory = dir;
        using var process = Process.Start(psi)!;
        await process.WaitForExitAsync();
        if (process.ExitCode != 0) throw new InvalidOperationException($"{file} {args} 실패 (exit {process.ExitCode})");
    }
}
