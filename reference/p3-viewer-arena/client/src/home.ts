// index.html: 스트리머는 방을 만들고, 시청자는 방 코드로 참가해요.

import './style.css';
import { createRoom, isLocalOnlyAddress, normalizeCode } from './net';

const createButton = document.querySelector<HTMLButtonElement>('#create')!;
const created = document.querySelector<HTMLElement>('#created')!;
const codeText = document.querySelector<HTMLElement>('#room-code')!;
const hostLink = document.querySelector<HTMLAnchorElement>('#host-link')!;
const playLink = document.querySelector<HTMLAnchorElement>('#play-link')!;
const lanTip = document.querySelector<HTMLElement>('#lan-tip')!;
const joinForm = document.querySelector<HTMLFormElement>('#join-form')!;
const codeInput = document.querySelector<HTMLInputElement>('#code')!;
const statusText = document.querySelector<HTMLElement>('#status')!;

// 127.0.0.1로 열면 QR 주소도 127.0.0.1이 되어 휴대폰이 들어올 수 없어요.
lanTip.hidden = !isLocalOnlyAddress();

function setLink(link: HTMLAnchorElement, url: string): void {
  link.href = url;
  link.textContent = url;
}

createButton.addEventListener('click', async () => {
  createButton.disabled = true;
  statusText.textContent = '';
  try {
    const code = await createRoom();
    codeText.textContent = code;
    setLink(hostLink, `${location.origin}/host.html?room=${code}`);
    setLink(playLink, `${location.origin}/play.html?room=${code}`);
    created.hidden = false;
  } catch (error) {
    statusText.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    createButton.disabled = false;
  }
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault(); // 폼의 기본 동작(페이지 새로 고침)을 막아요
  const code = normalizeCode(codeInput.value);
  if (!/^[A-Z]{4}$/.test(code)) {
    statusText.textContent = '방 코드는 영문 4자예요. 예) ABCD';
    return;
  }
  location.href = `/play.html?room=${code}`;
});
