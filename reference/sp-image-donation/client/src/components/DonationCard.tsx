import type { Donation } from '../api'
import { statusLabel } from '../donationList'

interface Props {
  donation: Donation
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onBlock: (id: number) => void
}

const timeText = (iso: string) => new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

// 검수 카드 1장. 닉네임·메시지는 {} 로 넣으므로 React가 글자로 출력한다(HTML로 해석하지 않음)
export default function DonationCard({ donation: d, onApprove, onReject, onBlock }: Props) {
  return (
    <article className={`card status-${d.status}`}>
      {d.imageUrl ? (
        <img src={d.imageUrl} alt={`${d.nickname}님이 보낸 이미지`} loading="lazy" />
      ) : (
        <div className="no-image">이미지 삭제됨</div>
      )}
      <div className="card-body">
        <p className="who">
          <strong>{d.nickname}</strong> <span className="badge">{statusLabel[d.status]}</span>
        </p>
        {d.message && <p className="message">{d.message}</p>}
        {d.status === 'AwaitingCheese' && d.code && (
          <p className="meta">
            코드 <strong>{d.code}</strong>
            {d.expiresAt && ` · ${timeText(d.expiresAt)}까지`}
          </p>
        )}
        {d.cheeseAmount !== null && <p className="meta">치즈 {d.cheeseAmount.toLocaleString('ko-KR')}개 확인</p>}
        {d.status === 'Pending' && (
          <div className="actions">
            <button type="button" onClick={() => onApprove(d.id)}>
              승인
            </button>
            <button type="button" onClick={() => onReject(d.id)}>
              거절
            </button>
            <button type="button" className="quiet" onClick={() => onBlock(d.id)}>
              차단
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
