// 스트리머 상세 (#/streamers/3): 소개 + 채널 링크 + 다가오는 방송
import * as api from '../api.ts';
import type { Params } from '../router.ts';
import {
  createAvatar,
  createElementWithText,
  errorMessage,
  formatKstDateTime,
  isHttpUrl,
  platformNames,
  setStatus,
} from '../ui.ts';

export async function renderStreamerDetail(view: HTMLElement, params: Params): Promise<void> {
  view.innerHTML = `
    <p><a href="#/streamers">← 스트리머 목록</a></p>
    <p class="status" role="status">불러오는 중...</p>
    <article class="profile" hidden>
      <div class="profile-head">
        <div id="avatar-slot"></div>
        <div>
          <h1 id="streamer-name"></h1>
          <span id="streamer-platform" class="badge"></span>
        </div>
      </div>
      <p id="streamer-bio" class="bio"></p>
      <p><a id="channel-link" class="button" target="_blank" rel="noopener noreferrer">채널로 가기</a></p>
      <h2>다가오는 방송</h2>
      <ul class="item-list" id="schedule-list"></ul>
    </article>
  `;
  const status = view.querySelector<HTMLElement>('.status')!;
  const profile = view.querySelector<HTMLElement>('.profile')!;

  try {
    const streamer = await api.getStreamer(Number(params.id));

    view.querySelector('#avatar-slot')!.replaceWith(createAvatar(streamer));
    view.querySelector('#streamer-name')!.textContent = streamer.name;
    const platform = view.querySelector<HTMLElement>('#streamer-platform')!;
    platform.textContent = platformNames[streamer.platform];
    platform.classList.add(streamer.platform);
    view.querySelector('#streamer-bio')!.textContent = streamer.bio;
    // 서버가 [HttpUrl]로 http·https 주소만 저장하지만, 화면도 한 번 더 확인하고 href에 넣어요 (javascript: 차단, Day 34)
    const channelLink = view.querySelector<HTMLAnchorElement>('#channel-link')!;
    if (isHttpUrl(streamer.channelUrl)) {
      channelLink.href = streamer.channelUrl;
    } else {
      channelLink.hidden = true;
    }

    const list = view.querySelector<HTMLUListElement>('#schedule-list')!;
    for (const schedule of streamer.schedules) {
      const item = document.createElement('li');
      item.append(
        createElementWithText('strong', '', schedule.title),
        ' ',
        createElementWithText(
          'span',
          'muted',
          `${formatKstDateTime(schedule.startsAt)} · ${schedule.durationMinutes}분`,
        ),
      );
      list.append(item);
    }
    if (streamer.schedules.length === 0) {
      list.append(createElementWithText('li', 'muted', '잡힌 방송이 없어요.'));
    }

    profile.hidden = false;
    setStatus(status, '');
  } catch (error) {
    if (error instanceof api.ApiError && error.status === 404) {
      setStatus(status, '없는 스트리머예요.', true);
    } else {
      setStatus(status, errorMessage(error), true);
    }
  }
}
