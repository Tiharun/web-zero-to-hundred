import type { Donation, DonationStatus } from './api'

// 화면에 보여 줄 상태 이름
export const statusLabel: Record<DonationStatus, string> = {
  AwaitingCheese: '치즈 대기',
  Pending: '검수 대기',
  Approved: '승인됨',
  Shown: '방송 완료',
  Rejected: '거절됨',
  Expired: '만료됨',
}

// 목록에 후원 1건을 넣거나(새 것) 바꾼다(같은 id). 새 배열을 돌려준다 (state는 직접 고치지 않는다)
export function upsertDonation(list: Donation[], donation: Donation): Donation[] {
  return list.some((d) => d.id === donation.id)
    ? list.map((d) => (d.id === donation.id ? donation : d))
    : [donation, ...list]
}
