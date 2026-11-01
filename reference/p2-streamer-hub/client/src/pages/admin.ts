// 관리자 화면 (#/admin): 방송 공지, 스트리머 관리, 방송 일정 관리 (Day 32, 33)
// 이 화면을 숨기는 것만으로는 안전하지 않아요. 관리자가 아니면 서버가 403으로 막아요.
import * as api from '../api.ts';
import { isAdmin } from '../auth.ts';
import type { Platform, Schedule, Streamer } from '../types.ts';
import {
  createElementWithText,
  errorMessage,
  formatKstDateTime,
  kstInputToUtcIso,
  platformNames,
  setStatus,
  utcIsoToKstInput,
} from '../ui.ts';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function renderAdmin(view: HTMLElement): Promise<void> {
  if (!isAdmin()) {
    view.innerHTML =
      '<h1>관리자</h1><p>관리자만 볼 수 있는 화면이에요. <a href="#/login">관리자 계정으로 로그인</a>해 주세요.</p>';
    return;
  }

  // 수정할 때는 숨은 칸(type="hidden")에 고치는 대상의 id를 넣어 둬요. 비어 있으면 새로 등록이에요
  view.innerHTML = `
    <h1>관리자</h1>

    <section class="panel">
      <h2>방송 공지</h2>
      <p>지금 공지: <strong id="current-notice">없음</strong></p>
      <form class="form" id="notice-form">
        <label for="notice-message">새 공지 (200자까지)</label>
        <input id="notice-message" required maxlength="200">
        <p class="actions"><button type="submit" class="button">공지 올리기</button></p>
        <p class="status" role="status"></p>
      </form>
      <p class="muted">OBS 브라우저 소스 주소: <a id="overlay-link" target="_blank" rel="noopener noreferrer"></a></p>
    </section>

    <section class="panel">
      <h2>스트리머</h2>
      <form class="form" id="streamer-form">
        <input type="hidden" id="streamer-id">
        <label for="streamer-name">이름</label>
        <input id="streamer-name" required maxlength="50">
        <label for="streamer-platform">플랫폼</label>
        <select id="streamer-platform">
          <option value="chzzk">치지직</option>
          <option value="youtube">YouTube</option>
          <option value="soop">SOOP</option>
          <option value="other">기타</option>
        </select>
        <label for="streamer-channel">채널 주소</label>
        <input id="streamer-channel" type="url" required maxlength="200" placeholder="https://">
        <label for="streamer-bio">소개</label>
        <textarea id="streamer-bio" required maxlength="500" rows="3"></textarea>
        <label for="streamer-avatar">프로필 사진 주소 (없어도 돼요)</label>
        <input id="streamer-avatar" type="url" maxlength="200" placeholder="https://">
        <p class="actions">
          <button type="submit" class="button" id="streamer-submit">스트리머 등록</button>
          <button type="button" class="button secondary" id="streamer-cancel" hidden>취소</button>
        </p>
        <p class="status" role="status"></p>
      </form>
      <ul class="item-list admin-list" id="streamer-admin-list"></ul>
    </section>

    <section class="panel">
      <h2>방송 일정</h2>
      <form class="form" id="schedule-form">
        <input type="hidden" id="schedule-id">
        <label for="schedule-streamer">스트리머</label>
        <select id="schedule-streamer" required></select>
        <label for="schedule-title">방송 제목</label>
        <input id="schedule-title" required maxlength="100">
        <label for="schedule-starts">시작 (한국 시간)</label>
        <input id="schedule-starts" type="datetime-local" required>
        <label for="schedule-duration">길이 (분)</label>
        <input id="schedule-duration" type="number" required min="10" max="1440" value="60">
        <p class="actions">
          <button type="submit" class="button" id="schedule-submit">일정 등록</button>
          <button type="button" class="button secondary" id="schedule-cancel" hidden>취소</button>
        </p>
        <p class="status" role="status"></p>
      </form>
      <p class="muted">앞으로 60일 동안의 일정이에요.</p>
      <ul class="item-list admin-list" id="schedule-admin-list"></ul>
    </section>
  `;

  setupNoticePanel(view);
  setupStreamerForm(view);
  setupScheduleForm(view);
  try {
    await reloadLists(view);
  } catch (error) {
    setStatus(view.querySelector<HTMLElement>('#streamer-form .status')!, errorMessage(error), true);
  }
}

// ---------- 공지 (Day 33) ----------

function setupNoticePanel(view: HTMLElement): void {
  const form = view.querySelector<HTMLFormElement>('#notice-form')!;
  const input = view.querySelector<HTMLInputElement>('#notice-message')!;
  const status = form.querySelector<HTMLElement>('.status')!;
  const current = view.querySelector<HTMLElement>('#current-notice')!;

  const overlayLink = view.querySelector<HTMLAnchorElement>('#overlay-link')!;
  overlayLink.href = `${location.origin}/overlay.html`;
  overlayLink.textContent = overlayLink.href;

  api
    .getCurrentNotice()
    .then((notice) => {
      if (notice !== null) {
        current.textContent = notice.message;
      }
    })
    .catch((error) => setStatus(status, errorMessage(error), true));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const notice = await api.createNotice(input.value.trim());
      current.textContent = notice.message;
      input.value = '';
      setStatus(status, '공지를 올렸어요. 열려 있는 오버레이에 바로 떠요.');
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    }
  });
}

// ---------- 스트리머 (Day 32) ----------

function setupStreamerForm(view: HTMLElement): void {
  const form = view.querySelector<HTMLFormElement>('#streamer-form')!;
  const status = form.querySelector<HTMLElement>('.status')!;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = view.querySelector<HTMLInputElement>('#streamer-id')!.value;
    const avatarUrl = view.querySelector<HTMLInputElement>('#streamer-avatar')!.value.trim();
    const input = {
      name: view.querySelector<HTMLInputElement>('#streamer-name')!.value.trim(),
      platform: view.querySelector<HTMLSelectElement>('#streamer-platform')!.value as Platform,
      channelUrl: view.querySelector<HTMLInputElement>('#streamer-channel')!.value.trim(),
      bio: view.querySelector<HTMLTextAreaElement>('#streamer-bio')!.value.trim(),
      avatarUrl: avatarUrl === '' ? null : avatarUrl, // 빈칸이면 "사진 없음"(null)
    };

    try {
      if (id === '') {
        await api.createStreamer(input);
        setStatus(status, `${input.name}을(를) 등록했어요.`);
      } else {
        await api.updateStreamer(Number(id), input);
        setStatus(status, `${input.name}의 정보를 고쳤어요.`);
      }
      fillStreamerForm(view, null);
      await reloadLists(view);
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    }
  });

  view.querySelector('#streamer-cancel')!.addEventListener('click', () => fillStreamerForm(view, null));
}

// 수정 버튼을 누르면 폼에 그 스트리머의 값을 채워요. null이면 빈 폼(새로 등록)으로 되돌려요
function fillStreamerForm(view: HTMLElement, streamer: Streamer | null): void {
  view.querySelector<HTMLInputElement>('#streamer-id')!.value = streamer === null ? '' : String(streamer.id);
  view.querySelector<HTMLInputElement>('#streamer-name')!.value = streamer?.name ?? '';
  view.querySelector<HTMLSelectElement>('#streamer-platform')!.value = streamer?.platform ?? 'chzzk';
  view.querySelector<HTMLInputElement>('#streamer-channel')!.value = streamer?.channelUrl ?? '';
  view.querySelector<HTMLTextAreaElement>('#streamer-bio')!.value = streamer?.bio ?? '';
  view.querySelector<HTMLInputElement>('#streamer-avatar')!.value = streamer?.avatarUrl ?? '';
  view.querySelector('#streamer-submit')!.textContent = streamer === null ? '스트리머 등록' : '고친 내용 저장';
  view.querySelector<HTMLElement>('#streamer-cancel')!.hidden = streamer === null;
}

// ---------- 방송 일정 (Day 32) ----------

function setupScheduleForm(view: HTMLElement): void {
  const form = view.querySelector<HTMLFormElement>('#schedule-form')!;
  const status = form.querySelector<HTMLElement>('.status')!;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = view.querySelector<HTMLInputElement>('#schedule-id')!.value;
    const input = {
      streamerId: Number(view.querySelector<HTMLSelectElement>('#schedule-streamer')!.value),
      title: view.querySelector<HTMLInputElement>('#schedule-title')!.value.trim(),
      // 입력칸의 한국 시간을 UTC 문자열로 바꿔서 보내요 (Day 29)
      startsAt: kstInputToUtcIso(view.querySelector<HTMLInputElement>('#schedule-starts')!.value),
      durationMinutes: Number(view.querySelector<HTMLInputElement>('#schedule-duration')!.value),
    };

    try {
      if (id === '') {
        await api.createSchedule(input);
        setStatus(status, `"${input.title}" 일정을 등록했어요.`);
      } else {
        await api.updateSchedule(Number(id), input);
        setStatus(status, `"${input.title}" 일정을 고쳤어요.`);
      }
      fillScheduleForm(view, null);
      await reloadLists(view);
    } catch (error) {
      setStatus(status, errorMessage(error), true);
    }
  });

  view.querySelector('#schedule-cancel')!.addEventListener('click', () => fillScheduleForm(view, null));
}

function fillScheduleForm(view: HTMLElement, schedule: Schedule | null): void {
  const streamerSelect = view.querySelector<HTMLSelectElement>('#schedule-streamer')!;
  view.querySelector<HTMLInputElement>('#schedule-id')!.value = schedule === null ? '' : String(schedule.id);
  if (schedule !== null) {
    streamerSelect.value = String(schedule.streamerId);
  }
  view.querySelector<HTMLInputElement>('#schedule-title')!.value = schedule?.title ?? '';
  view.querySelector<HTMLInputElement>('#schedule-starts')!.value =
    schedule === null ? '' : utcIsoToKstInput(schedule.startsAt);
  view.querySelector<HTMLInputElement>('#schedule-duration')!.value = String(schedule?.durationMinutes ?? 60);
  view.querySelector('#schedule-submit')!.textContent = schedule === null ? '일정 등록' : '고친 내용 저장';
  view.querySelector<HTMLElement>('#schedule-cancel')!.hidden = schedule === null;
}

// ---------- 목록 ----------

// 스트리머나 일정이 바뀔 때마다 두 목록과 일정 폼의 스트리머 선택 상자를 다시 그려요
async function reloadLists(view: HTMLElement): Promise<void> {
  const now = new Date();
  const [streamers, schedules] = await Promise.all([
    api.getStreamers(),
    api.getSchedules(now, new Date(now.getTime() + 60 * DAY_MS)),
  ]);

  const streamerList = view.querySelector<HTMLUListElement>('#streamer-admin-list')!;
  streamerList.replaceChildren(
    ...streamers.map((streamer) =>
      createAdminRow(
        `${streamer.name} (${platformNames[streamer.platform]})`,
        () => fillStreamerForm(view, streamer),
        async () => {
          if (confirm(`${streamer.name}을(를) 지울까요? 이 스트리머의 방송 일정도 함께 지워져요.`)) {
            await api.deleteStreamer(streamer.id);
            await reloadLists(view);
          }
        },
      ),
    ),
  );

  // 일정 폼의 스트리머 선택 상자. 고르고 있던 값은 그대로 둬요
  const streamerSelect = view.querySelector<HTMLSelectElement>('#schedule-streamer')!;
  const selected = streamerSelect.value;
  streamerSelect.replaceChildren(
    ...streamers.map((streamer) => {
      const option = createElementWithText('option', '', streamer.name);
      option.value = String(streamer.id);
      return option;
    }),
  );
  if (selected !== '') {
    streamerSelect.value = selected;
  }

  const scheduleList = view.querySelector<HTMLUListElement>('#schedule-admin-list')!;
  scheduleList.replaceChildren(
    ...schedules.map((schedule) =>
      createAdminRow(
        `${formatKstDateTime(schedule.startsAt)} · ${schedule.streamerName} · ${schedule.title}`,
        () => fillScheduleForm(view, schedule),
        async () => {
          if (confirm(`"${schedule.title}" 일정을 지울까요?`)) {
            await api.deleteSchedule(schedule.id);
            await reloadLists(view);
          }
        },
      ),
    ),
  );
}

// 목록 한 줄: 글자 + 수정 버튼 + 삭제 버튼
function createAdminRow(text: string, onEdit: () => void, onDelete: () => Promise<void>): HTMLLIElement {
  const row = document.createElement('li');
  const editButton = createElementWithText('button', 'button secondary small', '수정');
  editButton.type = 'button';
  editButton.addEventListener('click', onEdit);
  const deleteButton = createElementWithText('button', 'button danger small', '삭제');
  deleteButton.type = 'button';
  deleteButton.addEventListener('click', () => {
    onDelete().catch((error) => alert(errorMessage(error)));
  });
  row.append(createElementWithText('span', 'admin-row-text', text), editButton, deleteButton);
  return row;
}
