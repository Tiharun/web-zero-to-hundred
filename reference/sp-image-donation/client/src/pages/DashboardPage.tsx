import { useEffect, useState } from 'react'
import {
  approveDonation,
  blockSender,
  clearOverlay,
  listDonations,
  rejectDonation,
  reportDonation,
  type Donation,
  type DonationStatus,
} from '../api'
import DonationCard from '../components/DonationCard'
import TestDonationPanel from '../components/TestDonationPanel'
import { upsertDonation } from '../donationList'
import { useDashboardHub, type HubState } from '../hooks/useDashboardHub'

type Filter = 'all' | DonationStatus

const filters: { value: Filter; label: string; empty: string }[] = [
  { value: 'all', label: '전체', empty: '아직 받은 후원이 없어요.' },
  { value: 'Pending', label: '검수 대기', empty: '검수할 후원이 없어요.' },
  { value: 'AwaitingCheese', label: '치즈 대기', empty: '치즈를 기다리는 후원이 없어요.' },
]

const hubText: Record<HubState, string> = {
  connecting: '연결 중…',
  connected: '실시간 연결됨',
  reconnecting: '다시 연결 중…',
  disconnected: '실시간 연결 끊김 (새로고침해 주세요)',
}

// /dashboard — 검수 대기열. 새 후원은 SignalR로 바로 나타난다
export default function DashboardPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [notice, setNotice] = useState('')
  const hubState = useDashboardHub(setDonations)

  useEffect(() => {
    let ignore = false
    listDonations()
      .then((list) => {
        if (ignore) return
        setDonations((current) => list.reduce(upsertDonation, current)) // 그 사이 실시간으로 온 것과 합친다
        setLoaded(true)
      })
      .catch((e) => {
        if (!ignore) setNotice(e instanceof Error ? e.message : '목록을 불러오지 못했어요.')
      })
    return () => {
      ignore = true
    }
  }, [])

  // 승인·거절·차단·신고: 서버가 돌려준 새 상태로 카드를 바꾼다. 성공했는지(true/false)를 돌려준다
  async function act(action: (id: number) => Promise<Donation>, id: number): Promise<boolean> {
    try {
      const updated = await action(id)
      setDonations((list) => upsertDonation(list, updated))
      return true
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '처리하지 못했어요.')
      return false
    }
  }

  function handleBlock(id: number) {
    if (window.confirm('이 후원을 보낸 사람을 차단할까요? 같은 곳에서 오는 후원을 더 받지 않아요.')) void act(blockSender, id)
  }

  // 신고: 사유를 받아서 운영자에게 보낸다 (거절·차단도 함께 된다)
  function handleReport(id: number) {
    const reason = window.prompt('신고 사유를 적어 주세요 (200자까지). 이 후원은 거절되고 보낸 사람은 차단돼요.')?.trim()
    if (!reason) return
    void act((donationId) => reportDonation(donationId, reason.slice(0, 200)), id).then((ok) => {
      if (ok) setNotice('신고했어요. 이미지는 운영자 확인용으로 7일 동안 보관돼요.') // 실패했으면 act가 보여 준 오류를 덮어쓰지 않는다
    })
  }

  async function handleClear() {
    try {
      await clearOverlay()
      setNotice('오버레이 화면을 비웠어요. 아직 나가지 않은 승인 후원도 모두 내렸어요.')
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '긴급 정지에 실패했어요. 다시 눌러 주세요.')
    }
  }

  const visible = filter === 'all' ? donations : donations.filter((d) => d.status === filter)
  const firstPending = visible.find((d) => d.status === 'Pending')
  const waitingCode = donations.find((d) => d.status === 'AwaitingCheese')?.code ?? null

  // 단축키: A = 맨 위 검수 대기 승인, R = 거절 (글자를 입력하는 중에는 무시)
  // 의존성 배열을 비워 두지 않고 아예 생략: 화면을 그릴 때마다 다시 등록해서 항상 최신 목록을 본다
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!firstPending || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'a') void act(approveDonation, firstPending.id)
      if (e.key === 'r') void act(rejectDonation, firstPending.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section>
      <div className="toolbar">
        <h1>검수 대시보드</h1>
        <span className={`hub hub-${hubState}`}>{hubText[hubState]}</span>
        <button type="button" className="danger" onClick={handleClear}>
          긴급 정지 (오버레이 비우기)
        </button>
      </div>
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}

      <TestDonationPanel waitingCode={waitingCode} />

      <nav className="tabs" aria-label="상태로 거르기">
        {filters.map((f) => (
          <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </nav>
      <p className="hint">단축키: A 승인 · R 거절 (맨 위 검수 대기 후원)</p>

      {!loaded ? (
        <p>불러오는 중…</p>
      ) : visible.length === 0 ? (
        <p>{filters.find((f) => f.value === filter)?.empty}</p>
      ) : (
        <div className="cards">
          {visible.map((d) => (
            <DonationCard
              key={d.id}
              donation={d}
              onApprove={(id) => void act(approveDonation, id)}
              onReject={(id) => void act(rejectDonation, id)}
              onBlock={handleBlock}
              onReport={handleReport}
            />
          ))}
        </div>
      )}
    </section>
  )
}
