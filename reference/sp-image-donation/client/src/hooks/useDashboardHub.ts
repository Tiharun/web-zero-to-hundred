import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { Donation } from '../api'
import { upsertDonation } from '../donationList'

export type HubState = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'

// 검수 대시보드의 실시간 연결: 서버가 보내는 새 후원·바뀐 후원을 목록(state)에 바로 반영한다.
// setDonations(useState의 setter)는 React가 항상 같은 함수를 주므로 effect가 한 번만 연결한다.
export function useDashboardHub(setDonations: Dispatch<SetStateAction<Donation[]>>): HubState {
  const [state, setState] = useState<HubState>('connecting')

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl('/hubs/dashboard') // 로그인 쿠키가 함께 가므로 내 그룹의 소식만 온다
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connection.on('DonationCreated', (d: Donation) => setDonations((list) => upsertDonation(list, d)))
    connection.on('DonationUpdated', (d: Donation) => setDonations((list) => upsertDonation(list, d)))
    connection.onreconnecting(() => setState('reconnecting'))
    connection.onreconnected(() => setState('connected'))
    connection.onclose(() => setState('disconnected'))

    connection
      .start()
      .then(() => setState('connected'))
      .catch(() => setState('disconnected'))

    // 화면을 떠나면 연결을 끊는다.
    // 개발 모드(StrictMode)는 effect를 일부러 두 번 실행해서, 첫 연결이 협상 중에 끊겼다는 오류가
    // 콘솔에 한 번 보일 수 있다. 빌드한 화면에서는 나오지 않는다.
    return () => {
      void connection.stop()
    }
  }, [setDonations])

  return state
}
