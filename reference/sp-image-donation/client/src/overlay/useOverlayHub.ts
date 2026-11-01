import { HubConnectionBuilder, LogLevel, type HubConnection } from '@microsoft/signalr'
import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { OverlayDonation } from '../api'

export type OverlayStatus = 'connecting' | 'connected' | 'reconnecting' | 'failed'

const RETRY_MS = 5000

// 오버레이의 실시간 연결: ShowDonation → 대기열 뒤에 추가, Clear → 대기열 비우기
export function useOverlayHub(token: string, setQueue: Dispatch<SetStateAction<OverlayDonation[]>>) {
  const [status, setStatus] = useState<OverlayStatus>('connecting')
  const connectionRef = useRef<HubConnection | null>(null) // 화면을 다시 그려도 같은 연결을 쓰기 위해 ref에 둔다

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`/hubs/overlay?token=${encodeURIComponent(token)}`) // 로그인 대신 토큰으로 들어간다
      .withAutomaticReconnect() // OBS는 몇 시간씩 켜 두므로, 서버가 잠깐 끊겨도 다시 붙는다
      .configureLogging(LogLevel.Warning)
      .build()
    connectionRef.current = connection

    // 같은 후원이 두 번 오면(재연결 등) 한 번만 넣는다
    connection.on('ShowDonation', (d: OverlayDonation) => setQueue((q) => (q.some((x) => x.id === d.id) ? q : [...q, d])))
    connection.on('Clear', () => setQueue([])) // 긴급 정지
    connection.onreconnecting(() => setStatus('reconnecting'))
    connection.onreconnected(() => setStatus('connected'))

    let stopped = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined
    // 처음 연결에 실패하면(서버가 아직 안 켜짐 등) 5초마다 다시 시도한다
    const start = () =>
      connection
        .start()
        .then(() => setStatus('connected'))
        .catch(() => {
          if (stopped) return
          setStatus('failed')
          retryTimer = setTimeout(start, RETRY_MS)
        })
    connection.onclose(() => {
      if (stopped) return
      setStatus('failed')
      retryTimer = setTimeout(start, RETRY_MS)
    })
    void start()

    return () => {
      stopped = true
      clearTimeout(retryTimer)
      void connection.stop()
    }
  }, [token, setQueue])

  // 다 보여 준 후원을 서버에 알린다 (Approved → Shown). 실패해도 화면에는 영향이 없다
  // useCallback: 함수를 한 번만 만들어 둔다 → 이 함수를 쓰는 effect가 쓸데없이 다시 실행되지 않는다
  const markShown = useCallback((id: number) => {
    connectionRef.current?.invoke('MarkShown', id).catch(() => {})
  }, [])

  return { status, markShown }
}
