// 서버(ASP.NET Core) API 호출 모음.
// 로그인은 쿠키로 하므로, 화면과 API가 같은 주소에 있어야 한다 (서버가 React 빌드를 제공하거나, 개발 서버 프록시).

export type DonationMode = 'Free' | 'Cheese'
export type DonationStatus = 'AwaitingCheese' | 'Pending' | 'Approved' | 'Shown' | 'Rejected' | 'Expired' | 'Cleared'

export interface Donation {
  id: number
  status: DonationStatus
  nickname: string
  message: string
  imageUrl: string | null
  code: string | null
  cheeseAmount: number | null
  createdAt: string
  expiresAt: string | null
  reported: boolean // 신고된 후원 (이미지는 증거로 7일 동안 보관되고 화면에는 나오지 않는다)
}

export interface PublicStreamer {
  slug: string
  displayName: string
  mode: DonationMode
  minCheese: number
  maxFileMb: number
}

export interface CreateDonationResult {
  id: number
  status: DonationStatus
  code?: string
}

export interface Settings {
  mode: DonationMode
  minCheese: number
  autoApprove: boolean
  displaySeconds: number
  minIntervalSeconds: number
  maxFileMb: number
  bannedWords: string[]
}

export interface Me {
  userName: string
  streamer: { id: number; slug: string; displayName: string } | null
  chzzk: { channelName: string; sessionConnected: boolean } | null
}

export interface OverlayDonation {
  id: number
  imageUrl: string
  nickname: string
  message: string
  displaySeconds: number
  minIntervalSeconds: number
}

// 서버가 실패를 돌려줬을 때 (status: 401, 413, 429 ...)
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// 서버의 오류 응답(ProblemDetails)에서 사람이 읽을 문장을 꺼낸다
function messageFrom(status: number, body: unknown): string {
  const problem = body as { detail?: string; title?: string; errors?: Record<string, string[]> } | null
  if (problem?.detail) return problem.detail
  if (problem?.errors) return Object.values(problem.errors).flat().join(' ')
  if (status === 401) return '로그인이 필요해요.'
  if (status === 413) return '파일이 너무 커요.'
  if (status === 429) return '너무 자주 보냈어요. 잠시 후 다시 시도해 주세요.'
  return problem?.title ?? `요청이 실패했어요 (${status}).`
}

// 본문을 JSON으로 읽는다. 본문이 없거나(204 등) JSON이 아니면(프록시 오류 화면 등) null
function parseBody(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin', ...init })
  const body = parseBody(await response.text())
  if (!response.ok) throw new ApiError(response.status, messageFrom(response.status, body))
  return body as T
}

function sendJson<T>(method: string, path: string, data?: unknown): Promise<T> {
  return request<T>(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

// ── 로그인 (개발용 로컬 계정)
export const getMe = () => request<Me>('/api/auth/me')
export const register = (email: string, password: string) => sendJson<void>('POST', '/api/auth/register', { email, password })
export const login = (email: string, password: string) =>
  sendJson<void>('POST', '/api/auth/login?useCookies=true', { email, password }) // useCookies: 쿠키로 로그인
export const logout = () => sendJson<void>('POST', '/api/auth/logout')
export const onboard = (slug: string, displayName: string) => sendJson<void>('POST', '/api/auth/onboarding', { slug, displayName })

// ── 후원 페이지 (로그인 없음)
export const getStreamer = (slug: string) => request<PublicStreamer>(`/api/public/streamers/${encodeURIComponent(slug)}`)

// 업로드는 진행률을 보여 주려고 XMLHttpRequest를 쓴다 (fetch는 업로드 진행률을 알려 주지 않는다)
export function uploadDonation(slug: string, form: FormData, onProgress: (percent: number) => void): Promise<CreateDonationResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/public/streamers/${encodeURIComponent(slug)}/donations`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      const body = parseBody(xhr.responseText)
      if (xhr.status >= 200 && xhr.status < 300) resolve(body as CreateDonationResult)
      else reject(new ApiError(xhr.status, messageFrom(xhr.status, body)))
    }
    xhr.onerror = () => reject(new ApiError(0, '네트워크 오류로 보내지 못했어요.'))
    xhr.send(form) // FormData를 넣으면 브라우저가 multipart/form-data로 보낸다
  })
}

// ── 검수 대시보드 (로그인 필요)
export const listDonations = () => request<Donation[]>('/api/dashboard/donations')
export const approveDonation = (id: number) => sendJson<Donation>('POST', `/api/dashboard/donations/${id}/approve`)
export const rejectDonation = (id: number) => sendJson<Donation>('POST', `/api/dashboard/donations/${id}/reject`)
export const blockSender = (id: number) => sendJson<Donation>('POST', `/api/dashboard/donations/${id}/block`)
// 신고: 서비스 운영자에게 알리고, 거절하고, 보낸 사람을 차단한다
export const reportDonation = (id: number, reason: string) =>
  sendJson<Donation>('POST', `/api/dashboard/donations/${id}/report`, { reason })
export const clearOverlay = () => sendJson<void>('POST', '/api/dashboard/overlay/clear')
export const sendTestDonation = (amount: number, message: string) =>
  sendJson<void>('POST', '/api/dashboard/test-donation', { amount, message, nickname: '테스트 후원자' })

// ── 설정
export const getSettings = () => request<Settings>('/api/dashboard/settings')
export const saveSettings = (settings: Settings) => sendJson<Settings>('PUT', '/api/dashboard/settings', settings)
export const getOverlayToken = () => request<{ overlayToken: string }>('/api/dashboard/overlay-token')
export const rotateOverlayToken = () => sendJson<{ overlayToken: string }>('POST', '/api/dashboard/overlay-token/rotate')

// 오버레이 주소: OBS 브라우저 소스에 붙여 넣는다 (토큰은 비밀번호처럼 다룬다)
export const overlayUrl = (token: string) => `${window.location.origin}/overlay.html?token=${encodeURIComponent(token)}`
export const donatePageUrl = (slug: string) => `${window.location.origin}/d/${slug}`
