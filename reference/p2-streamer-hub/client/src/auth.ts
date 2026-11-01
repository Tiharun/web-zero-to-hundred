// 지금 로그인한 사람의 정보를 들고 있는 곳 (Day 31)
// 로그인 쿠키는 HttpOnly라서 자바스크립트가 읽을 수 없어요. 그래서 "누구인지"는 /api/me에 물어봐서 알아내요.
import * as api from './api.ts';
import type { Me } from './types.ts';

let currentUser: Me | null = null;
const listeners: Array<() => void> = [];

export function getCurrentUser(): Me | null {
  return currentUser;
}

// 화면에서 관리자 메뉴를 보여 줄지 정할 때만 써요. 진짜 권한 검사는 서버가 해요 (Day 32)
export function isAdmin(): boolean {
  return currentUser !== null && currentUser.roles.includes('Admin');
}

// 로그인 상태가 바뀔 때 부를 함수를 등록해요 (main.ts가 위쪽 메뉴를 다시 그려요)
export function onAuthChange(listener: () => void): void {
  listeners.push(listener);
}

function setCurrentUser(user: Me | null): void {
  currentUser = user;
  for (const listener of listeners) {
    listener();
  }
}

export async function loadCurrentUser(): Promise<void> {
  setCurrentUser(await api.getMe());
}

export async function login(email: string, password: string): Promise<void> {
  await api.login(email, password);
  await loadCurrentUser();
}

// 가입 → 바로 로그인 → 닉네임 저장
// (Identity의 /register는 이메일·비밀번호만 받아서, 닉네임은 로그인한 뒤 PUT /api/me로 따로 저장해요)
export async function register(email: string, password: string, displayName: string): Promise<void> {
  await api.register(email, password);
  await api.login(email, password);
  await api.updateMe(displayName);
  await loadCurrentUser();
}

export async function logout(): Promise<void> {
  await api.logout();
  setCurrentUser(null);
}
