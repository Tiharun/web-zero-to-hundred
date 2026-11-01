using System.Threading.Channels;
using StreamerHub.Api.Dtos;

namespace StreamerHub.Api.Services;

// 새 공지를 "지금 연결된 모든 오버레이"에 나눠 주는 방송실 (Day 33)
// 오버레이가 하나 연결될 때마다 우편함(Channel)을 하나 만들어 두고,
// 공지가 올라오면 모든 우편함에 하나씩 넣어 줘요.
// 앱 전체에 딱 하나만 있어야 해서 Program.cs에서 AddSingleton으로 등록해요.
public class NoticeBroadcaster
{
    private readonly List<Channel<NoticeResponse>> _mailboxes = new List<Channel<NoticeResponse>>();

    public NoticeBroadcaster(IHostApplicationLifetime lifetime)
    {
        // 서버가 꺼질 때 모든 우편함을 닫아요. 그래야 열려 있던 SSE 연결이 끝나서 서버가 바로 꺼져요.
        lifetime.ApplicationStopping.Register(CloseAll);
    }

    // 새 우편함을 만들어 등록하고 돌려줘요
    public Channel<NoticeResponse> Subscribe()
    {
        var mailbox = Channel.CreateUnbounded<NoticeResponse>();
        // 여러 요청이 동시에 이 목록을 만질 수 있어서 lock으로 한 번에 하나씩만 들어가게 해요
        lock (_mailboxes)
        {
            _mailboxes.Add(mailbox);
        }
        return mailbox;
    }

    // 연결이 끊긴 오버레이의 우편함을 치워요
    public void Unsubscribe(Channel<NoticeResponse> mailbox)
    {
        lock (_mailboxes)
        {
            _mailboxes.Remove(mailbox);
        }
    }

    // 모든 우편함에 공지를 넣어요
    public void Publish(NoticeResponse notice)
    {
        lock (_mailboxes)
        {
            foreach (var mailbox in _mailboxes)
            {
                mailbox.Writer.TryWrite(notice);
            }
        }
    }

    private void CloseAll()
    {
        lock (_mailboxes)
        {
            foreach (var mailbox in _mailboxes)
            {
                mailbox.Writer.TryComplete();
            }
        }
    }
}
