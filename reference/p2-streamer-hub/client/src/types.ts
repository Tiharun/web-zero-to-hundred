// 서버와 주고받는 데이터의 모양 (Day 5, 27)
// 서버의 C# DTO와 이름·모양을 맞춰요. (C#의 Name → JSON의 name처럼 첫 글자만 소문자)
// 시각은 JSON에서 문자열이에요. 예: "2026-11-02T11:00:00Z" (끝의 Z = UTC)

// 유니온 타입: 이 네 글자 중 하나만 들어갈 수 있어요
export type Platform = 'chzzk' | 'youtube' | 'soop' | 'other';

export interface Streamer {
  id: number;
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null; // 사진이 없으면 null
  createdAt: string;
}

// 상세 화면용: Streamer의 모든 칸 + 다가오는 일정
export interface StreamerDetail extends Streamer {
  schedules: Schedule[];
}

// 등록·수정할 때 보내는 값 (id와 createdAt은 서버가 정해요)
export interface StreamerInput {
  name: string;
  platform: Platform;
  channelUrl: string;
  bio: string;
  avatarUrl: string | null;
}

export interface Schedule {
  id: number;
  streamerId: number;
  streamerName: string;
  title: string;
  startsAt: string; // UTC
  durationMinutes: number;
}

export interface ScheduleInput {
  streamerId: number;
  title: string;
  startsAt: string; // UTC. Date의 toISOString()으로 만들어요
  durationMinutes: number;
}

// 게시판 목록의 한 줄
export interface PostListItem {
  id: number;
  title: string;
  authorName: string;
  createdAt: string;
}

export interface PostDetail {
  id: number;
  title: string;
  body: string;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
  canEdit: boolean; // 지금 보는 사람이 고칠 수 있는지 (작성자 또는 관리자)
}

export interface PostInput {
  title: string;
  body: string;
}

// 제네릭: 무엇의 목록이든 같은 모양으로 담아요 (Day 6)
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Notice {
  id: number;
  message: string;
  createdAt: string;
}

// GET /api/me
export interface Me {
  email: string;
  displayName: string;
  roles: string[];
}
