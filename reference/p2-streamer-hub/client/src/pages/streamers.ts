// 스트리머 목록 (#/streamers, #/streamers?q=곰)
import * as api from '../api.ts';
import type { Params } from '../router.ts';
import type { Streamer } from '../types.ts';
import { createAvatar, createElementWithText, createLink, errorMessage, platformNames, setStatus } from '../ui.ts';

export async function renderStreamers(view: HTMLElement, _params: Params, query: URLSearchParams): Promise<void> {
  const keyword = query.get('q') ?? '';

  view.innerHTML = `
    <h1>스트리머</h1>
    <form class="search-form" role="search">
      <label for="streamer-search">이름으로 찾기</label>
      <input id="streamer-search" name="q" type="search" placeholder="예: 곰">
      <button type="submit" class="button">검색</button>
    </form>
    <p class="status" role="status">불러오는 중...</p>
    <ul class="card-grid" id="streamer-list"></ul>
  `;
  const form = view.querySelector('form')!;
  const input = view.querySelector<HTMLInputElement>('#streamer-search')!;
  const status = view.querySelector<HTMLElement>('.status')!;
  const list = view.querySelector<HTMLUListElement>('#streamer-list')!;
  input.value = keyword; // 사용자가 쓴 값은 value로 넣어요

  // 검색하면 주소를 #/streamers?q=... 로 바꿔요. 라우터가 이 화면을 다시 그리고, 뒤로 가기도 돼요
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    location.hash = `#/streamers?q=${encodeURIComponent(input.value.trim())}`;
  });

  try {
    const streamers = await api.getStreamers(keyword);
    list.append(...streamers.map(createStreamerCard));
    if (streamers.length === 0) {
      setStatus(
        status,
        keyword === '' ? '아직 등록된 스트리머가 없어요.' : `"${keyword}"(으)로 찾은 스트리머가 없어요.`,
      );
    } else {
      setStatus(status, `${streamers.length}명`);
    }
  } catch (error) {
    setStatus(status, errorMessage(error), true);
  }
}

function createStreamerCard(streamer: Streamer): HTMLLIElement {
  const card = document.createElement('li');
  card.className = 'card';

  const title = document.createElement('h2');
  title.append(createLink(`#/streamers/${streamer.id}`, streamer.name));

  card.append(
    createAvatar(streamer),
    title,
    createElementWithText('span', `badge ${streamer.platform}`, platformNames[streamer.platform]),
    createElementWithText('p', 'bio', streamer.bio),
  );
  return card;
}
