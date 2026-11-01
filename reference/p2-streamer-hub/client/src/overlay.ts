// OBS 공지 오버레이 (Day 33)
// 관리자가 공지를 올리면 방송 화면에 바로 떠요. overlay.html을 OBS의 "브라우저" 소스로 추가해서 써요.
//
// 처음에는 "폴링"으로 만들어요: 3초마다 /api/notices/current에 "새 공지 있어요?" 하고 묻기
//   setInterval(async () => { const notice = await getCurrentNotice(); ... }, 3000);
// 이 파일은 그다음 단계인 SSE 버전이에요: 연결을 하나 열어 두면 서버가 공지가 생길 때 먼저 보내 줘요.
// EventSource는 연결이 끊기면 몇 초 뒤에 알아서 다시 연결하고, 서버는 연결되자마자 지금 공지를 보내 줘요.
import type { Notice } from './types.ts';

const noticeElement = document.querySelector<HTMLParagraphElement>('#notice')!;

function showNotice(notice: Notice): void {
  // textContent: 공지에 <b>나 <script>가 들어 있어도 글자로만 보여요 (XSS 방지)
  noticeElement.textContent = notice.message;
  noticeElement.hidden = false;
}

const source = new EventSource('/api/notices/stream');

// 서버가 "event: notice"로 보낸 메시지만 받아요. data에는 공지 JSON이 들어 있어요
source.addEventListener('notice', (event) => {
  const notice = JSON.parse(event.data) as Notice;
  showNotice(notice);
});
