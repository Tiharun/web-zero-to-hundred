// 서버 API를 부르는 함수 모음 (Day 8, 27)
// 화면 코드는 fetch를 직접 쓰지 않고 이 함수들만 불러요. 주소와 타입이 한곳에 모여 있어서 고치기 쉬워요.
// 주소가 /api로 시작하기만 하면 돼요. 개발 중에는 Vite가 서버로 넘겨 주고(vite.config.ts), 배포하면 같은 서버예요.
import type {
  Me,
  Notice,
  Paged,
  PostDetail,
  PostInput,
  PostListItem,
  Schedule,
  ScheduleInput,
  Streamer,
  StreamerDetail,
  StreamerInput,
} from './types.ts';

// 서버가 오류(4xx·5xx)로 답했을 때 던지는 오류. status로 401·403·404를 구분할 수 있어요
export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>; // 검증 오류: { 칸 이름: [메시지들] }

  constructor(status: number, message: string, errors: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// 서버의 오류 응답 모양 (ProblemDetails, Day 24)
interface ProblemDetails {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// 모든 요청이 지나가는 함수: 보내고, 실패면 ApiError를 던져요
async function request(method: string, url: string, body?: unknown): Promise<Response> {
  const options: RequestInit = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options); // 같은 주소라서 로그인 쿠키가 저절로 함께 가요
  if (!response.ok) {
    throw await toApiError(response);
  }
  return response;
}

async function toApiError(response: Response): Promise<ApiError> {
  let problem: ProblemDetails = {};
  try {
    problem = (await response.json()) as ProblemDetails;
  } catch {
    // 본문이 JSON이 아니면 빈 값으로 둬요
  }
  const errors = problem.errors ?? {};

  let message = problem.detail ?? problem.title ?? `오류가 났어요. (${response.status})`;
  if (response.status === 401) message = '로그인이 필요해요.';
  if (response.status === 403) message = '권한이 없어요.';
  if (response.status === 404) message = '찾을 수 없어요.';
  if (response.status === 429) message = '요청이 너무 많아요. 1분쯤 뒤에 다시 해 주세요.';
  if (response.status === 400 && Object.keys(errors).length > 0) {
    message = Object.values(errors).flat().join(' '); // 검증 메시지를 모두 이어 붙여요
  }
  return new ApiError(response.status, message, errors);
}

// <T>: 어떤 모양의 JSON이 올지 부르는 쪽이 알려 줘요 (제네릭, Day 6)
async function getJson<T>(url: string): Promise<T> {
  const response = await request('GET', url);
  return (await response.json()) as T;
}

// 204(내용 없음)이면 null
async function getJsonOrNull<T>(url: string): Promise<T | null> {
  const response = await request('GET', url);
  if (response.status === 204) {
    return null;
  }
  return (await response.json()) as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await request('POST', url, body);
  return (await response.json()) as T;
}

// ---------- 스트리머 ----------

export function getStreamers(q = ''): Promise<Streamer[]> {
  return getJson<Streamer[]>(`/api/streamers?q=${encodeURIComponent(q)}`);
}

export function getStreamer(id: number): Promise<StreamerDetail> {
  return getJson<StreamerDetail>(`/api/streamers/${id}`);
}

export function createStreamer(input: StreamerInput): Promise<Streamer> {
  return postJson<Streamer>('/api/streamers', input);
}

export async function updateStreamer(id: number, input: StreamerInput): Promise<void> {
  await request('PUT', `/api/streamers/${id}`, input);
}

export async function deleteStreamer(id: number): Promise<void> {
  await request('DELETE', `/api/streamers/${id}`);
}

// ---------- 방송 일정 ----------

// from ~ to 사이의 일정. Date를 toISOString()으로 바꾸면 UTC 문자열(…Z)이 돼요
export function getSchedules(from: Date, to: Date): Promise<Schedule[]> {
  const query = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
  return getJson<Schedule[]>(`/api/schedules?${query}`);
}

export function createSchedule(input: ScheduleInput): Promise<Schedule> {
  return postJson<Schedule>('/api/schedules', input);
}

export async function updateSchedule(id: number, input: ScheduleInput): Promise<void> {
  await request('PUT', `/api/schedules/${id}`, input);
}

export async function deleteSchedule(id: number): Promise<void> {
  await request('DELETE', `/api/schedules/${id}`);
}

// ---------- 팬 게시판 ----------

export function getPosts(page: number, pageSize = 20): Promise<Paged<PostListItem>> {
  return getJson<Paged<PostListItem>>(`/api/posts?page=${page}&pageSize=${pageSize}`);
}

export function getPost(id: number): Promise<PostDetail> {
  return getJson<PostDetail>(`/api/posts/${id}`);
}

export function createPost(input: PostInput): Promise<PostDetail> {
  return postJson<PostDetail>('/api/posts', input);
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  await request('PUT', `/api/posts/${id}`, input);
}

export async function deletePost(id: number): Promise<void> {
  await request('DELETE', `/api/posts/${id}`);
}

// ---------- 공지 ----------

export function getCurrentNotice(): Promise<Notice | null> {
  return getJsonOrNull<Notice>('/api/notices/current');
}

export function createNotice(message: string): Promise<Notice> {
  return postJson<Notice>('/api/notices', { message });
}

// ---------- 가입·로그인 ----------

export async function register(email: string, password: string): Promise<void> {
  await request('POST', '/api/auth/register', { email, password });
}

// ?useCookies=true: 토큰 대신 HttpOnly 쿠키로 로그인해요. 자바스크립트는 쿠키를 읽지도 저장하지도 않아요
export async function login(email: string, password: string): Promise<void> {
  await request('POST', '/api/auth/login?useCookies=true', { email, password });
}

export async function logout(): Promise<void> {
  await request('POST', '/api/auth/logout');
}

// 로그인하지 않았으면 null (서버가 204로 답해요)
export function getMe(): Promise<Me | null> {
  return getJsonOrNull<Me>('/api/me');
}

export async function updateMe(displayName: string): Promise<void> {
  await request('PUT', '/api/me', { displayName });
}
