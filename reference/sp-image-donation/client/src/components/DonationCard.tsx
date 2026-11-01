import type { Donation } from '../api'
import { statusLabel } from '../donationList'

interface Props {
  donation: Donation
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onBlock: (id: number) => void
  onReport: (id: number) => void
}

const timeText = (iso: string) => new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

// 검수 카드 1장. 닉네임·메시지는 {} 로 넣으므로 React가 글자로 출력한다(HTML로 해석하지 않음)
export default function DonationCard({ donation: d, onApprove, onReject, onBlock, onReport }: Props) {
  return (
    <article className={`card status-${d.status}`}>
      {d.imageUrl ? (
        <img src={d.imageUrl} alt={`${d.nickname}님이 보낸 이미지`} loading="lazy" />
      ) : (
        <div className="no-image">{d.reported ? '증거로 보관 중 (7일 뒤 삭제)' : '이미지 삭제됨'}</div>
      )}
      <div className="card-body">
        <p className="who">
          <strong>{d.nickname}</strong> <span className="badge">{statusLabel[d.status]}</span>
          {d.reported && <span className="badge"> 신고됨</span>}
        </p>
        {d.message && <p className="message">{d.message}</p>}
        {d.status === 'AwaitingCheese' && d.code && (
          <p className="meta">
            코드 <strong>{d.code}</strong>
            {d.expiresAt && ` · ${timeText(d.expiresAt)}까지`}
          </p>
        )}
        {d.cheeseAmount !== null && <p className="meta">치즈 {d.cheeseAmount.toLocaleString('ko-KR')}개 확인</p>}
        <div className="actions">
          {d.status === 'Pending' && (
            <>
              <button type="button" onClick={() => onApprove(d.id)}>
                승인
              </button>
              <button type="button" onClick={() => onReject(d.id)}>
                거절
              </button>
              <button type="button" className="quiet" onClick={() => onBlock(d.id)}>
                차단
              </button>
            </>
          )}
          {/* 신고는 이미지가 남아 있을 때만: 운영자가 볼 증거가 있어야 한다 (방송에 나간 뒤에도 가능).
              거절·만료·긴급 정지된 후원은 이미지가 이미 지워졌고, 신고된 후원은 이미 신고했다 */}
          {d.imageUrl !== null && (
            <button type="button" className="quiet" onClick={() => onReport(d.id)}>
              신고
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
