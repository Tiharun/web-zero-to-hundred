using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using StreamerHub.Api.Data;

namespace StreamerHub.Tests;

// 단위 테스트용 데이터베이스: 메모리 안에만 있는 SQLite (Day 35)
// 연결을 열어 두는 동안만 DB가 살아 있어요. 테스트가 끝나면 Dispose에서 닫혀 사라져요.
public sealed class TestDb : IDisposable
{
    private readonly SqliteConnection _connection;

    public AppDbContext Context { get; }

    public TestDb()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(_connection)
            .Options;
        Context = new AppDbContext(options);
        Context.Database.Migrate(); // 실제 앱과 같은 마이그레이션으로 테이블을 만들어요
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}
