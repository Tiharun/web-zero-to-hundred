import { useEffect, useState, type CSSProperties } from 'react'
import type { OverlayDonation } from '../api'
import { useOverlayHub } from './useOverlayHub'

// OBS 화면에 이미지를 한 장씩 보여 준다.
// 대기열(queue)의 맨 앞이 지금 보이는 이미지: 표시 시간이 지나면 빼고, 간격만큼 쉰 뒤 다음 이미지를 보여 준다.
export default function Overlay({ token }: { token: string }) {
  const [queue, setQueue] = useState<OverlayDonation[]>([])
  const [restSeconds, setRestSeconds] = useState(0) // 0보다 크면 다음 이미지까지 쉬는 중
  const { status, markShown } = useOverlayHub(token, setQueue)

  const current = restSeconds > 0 ? null : (queue[0] ?? null)

  // 1) 지금 이미지를 displaySeconds 동안 보여 준다
  useEffect(() => {
    if (!current) return
    const timer = setTimeout(() => {
      markShown(current.id)
      setQueue((q) => q.slice(1)) // 맨 앞(다 보여 준 것)을 뺀다
      setRestSeconds(current.minIntervalSeconds)
    }, current.displaySeconds * 1000)
    return () => clearTimeout(timer) // 긴급 정지로 current가 사라지면 타이머도 취소된다
  }, [current, markShown])

  // 2) 쉬는 시간이 끝나면 다음 이미지
  useEffect(() => {
    if (restSeconds === 0) return
    const timer = setTimeout(() => setRestSeconds(0), restSeconds * 1000)
    return () => clearTimeout(timer)
  }, [restSeconds])

  return (
    <div className="overlay" data-status={status}>
      {status === 'failed' && <p className="overlay-error">오버레이 연결 실패: 주소(토큰)와 서버를 확인해 주세요.</p>}
      {current && (
        <figure key={current.id} className="donation" style={{ '--show-seconds': `${current.displaySeconds}s` } as CSSProperties}>
          <img src={current.imageUrl} alt="" />
          <figcaption>
            <strong>{current.nickname}</strong>
            {current.message && <span>{current.message}</span>}
          </figcaption>
        </figure>
      )}
    </div>
  )
}
