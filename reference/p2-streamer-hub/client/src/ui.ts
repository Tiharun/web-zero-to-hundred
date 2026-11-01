// 여러 화면이 함께 쓰는 작은 도우미들
import { ApiError } from './api.ts';
import type { Platform, Streamer } from './types.ts';

// ---------- 시간 (Day 29) ----------
// 서버는 UTC로 주고, 화면에는 한국 시간으로 보여 줘요.
// 한국은 서머타임이 없어서 언제나 UTC보다 9시간 빨라요.
export const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

const kstDateTimeFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  month: 'long',
  day: 'numeric',
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

const kstDateFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const kstTimeFormat = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  hour: 'numeric',
  minute: '2-digit',
});

// "2026-11-02T11:00:00Z" → "11월 2일 (월) 오후 8:00"
export function formatKstDateTime(iso: string): string {
  return kstDateTimeFormat.format(new Date(iso));
}

// "2026-11-02T11:00:00Z" → "2026년 11월 2일"
export function formatKstDate(iso: string): string {
  return kstDateFormat.format(new Date(iso));
}

// "2026-11-02T11:00:00Z" → "오후 8:00"
export function formatKstTime(iso: string): string {
  return kstTimeFormat.format(new Date(iso));
}

// 어떤 순간이 한국 날짜로 며칠인지 "YYYY-MM-DD"로 (9시간을 더한 뒤 UTC 날짜를 읽는 방법)
export function toKstDateString(date: Date): string {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

// <input type="datetime-local">의 값 "2026-11-07T20:00"을 한국 시간으로 읽어서 UTC 문자열로
export function kstInputToUtcIso(value: string): string {
  return new Date(`${value}:00+09:00`).toISOString();
}

// 반대로 UTC 문자열 → datetime-local 입력칸에 넣을 한국 시간 "2026-11-07T20:00"
export function utcIsoToKstInput(iso: string): string {
  return new Date(new Date(iso).getTime() + KST_OFFSET_MS).toISOString().slice(0, 16);
}

// ---------- 스트리머 ----------

export const platformNames: Record<Platform, string> = {
  chzzk: '치지직',
  youtube: 'YouTube',
  soop: 'SOOP',
  other: '기타',
};

// http:// 또는 https:// 주소인지 확인해요. 서버도 검사하지만 화면도 한 번 더 지켜요 (Day 34)
// (javascript:alert(1) 같은 주소를 href나 src에 넣으면 위험해요)
export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value); // 완전한 주소가 아니면 오류가 나요
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// 프로필 사진. 주소가 없거나 http(s)가 아니면 이름 첫 글자를 동그라미에 넣어요
export function createAvatar(streamer: Streamer): HTMLElement {
  if (streamer.avatarUrl !== null && isHttpUrl(streamer.avatarUrl)) {
    const image = document.createElement('img');
    image.className = 'avatar';
    image.src = streamer.avatarUrl;
    image.alt = '';
    image.width = 64;
    image.height = 64;
    return image;
  }
  const initial = document.createElement('span');
  initial.className = 'avatar';
  initial.setAttribute('aria-hidden', 'true');
  initial.textContent = streamer.name.slice(0, 1);
  return initial;
}

// ---------- 상태·오류 문장 ----------

// <p role="status">에 문장을 넣어요. 화면 읽기 프로그램도 읽어 줘요
export function setStatus(element: HTMLElement, message: string, isError = false): void {
  element.textContent = message;
  element.classList.toggle('error', isError);
}

// 오류에서 사람에게 보여 줄 문장을 꺼내요
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  // fetch 자체가 실패하면(서버가 꺼져 있음 등) TypeError가 나요
  return '서버에 연결하지 못했어요. 서버가 켜져 있는지 확인해 주세요.';
}

// P1에서 만든 도우미를 TypeScript로 옮겼어요. 매개변수와 돌려주는 값에 타입만 붙였어요.
// textContent라서 사용자가 쓴 <script>도 글자로만 보여요 (XSS 방지, Day 34)
export function createElementWithText(tagName: string, className: string, text: string): HTMLElement {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

// 링크(<a>)를 만들어요. href를 넣어야 해서 HTMLElement가 아니라 HTMLAnchorElement로 돌려줘요
export function createLink(href: string, text: string, className = ''): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = href;
  link.className = className;
  link.textContent = text;
  return link;
}
