// 홈 화면 (#/): 다가오는 방송 3개와 게시판 새 글 5개
import * as api from '../api.ts';
import type { PostListItem, Schedule } from '../types.ts';
import { createElementWithText, createLink, errorMessage, formatKstDate, formatKstDateTime, setStatus } from '../ui.ts';

export async function renderHome(view: HTMLElement): Promise<void> {
  // 틀은 innerHTML로 한 번에 만들어요. 여기에는 우리가 쓴 글자만 넣고, 서버에서 온 값은 넣지 않아요
  view.innerHTML = `
    <section class="hero">
      <h1>스트리머 허브</h1>
      <p>좋아하는 스트리머의 방송 일정을 확인하고, 팬끼리 이야기를 나눠요.</p>
      <p class="actions">
        <a class="button" href="#/schedule">이번 주 방송 일정</a>
        <a class="button secondary" href="#/streamers">스트리머 보기</a>
      </p>
    </section>
    <p class="status" role="status">불러오는 중...</p>
    <h2>다가오는 방송</h2>
    <ul class="item-list" id="upcoming"></ul>
    <h2>팬 게시판 새 글</h2>
    <ul class="item-list" id="latest-posts"></ul>
  `;
  const upcomingList = view.querySelector<HTMLUListElement>('#upcoming')!;
  const postList = view.querySelector<HTMLUListElement>('#latest-posts')!;
  const status = view.querySelector<HTMLElement>('.status')!;

  try {
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    // 두 요청을 동시에 보내고 둘 다 올 때까지 기다려요 (Day 8)
    const [schedules, posts] = await Promise.all([api.getSchedules(now, weekLater), api.getPosts(1, 5)]);

    upcomingList.append(...schedules.slice(0, 3).map(createScheduleItem));
    if (schedules.length === 0) {
      upcomingList.append(createElementWithText('li', 'muted', '일주일 안에 잡힌 방송이 없어요.'));
    }

    postList.append(...posts.items.map(createPostItem));
    if (posts.items.length === 0) {
      postList.append(createElementWithText('li', 'muted', '아직 글이 없어요. 첫 글을 써 보세요!'));
    }
    setStatus(status, '');
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

function createScheduleItem(schedule: Schedule): HTMLLIElement {
  const item = document.createElement('li');
  const link = createLink(`#/streamers/${schedule.streamerId}`, `${schedule.streamerName} · ${schedule.title}`);
  item.append(link, ' ', createElementWithText('span', 'muted', formatKstDateTime(schedule.startsAt)));
  return item;
}

function createPostItem(post: PostListItem): HTMLLIElement {
  const item = document.createElement('li');
  const link = createLink(`#/board/${post.id}`, post.title);
  item.append(
    link,
    ' ',
    createElementWithText('span', 'muted', `${post.authorName} · ${formatKstDate(post.createdAt)}`),
  );
  return item;
}
