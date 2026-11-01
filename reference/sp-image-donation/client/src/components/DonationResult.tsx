import type { CreateDonationResult, PublicStreamer } from '../api'

interface Props {
  result: CreateDonationResult
  streamer: PublicStreamer
  onAgain: () => void
}

// 후원을 보낸 뒤 화면. 치즈 모드면 치지직 후원 메시지에 넣을 코드를 크게 보여 준다
export default function DonationResult({ result, streamer, onAgain }: Props) {
  return (
    <section className="result">
      {result.code ? (
        <>
          <h2>거의 다 됐어요!</h2>
          <p>
            치지직에서 <strong>{streamer.minCheese.toLocaleString('ko-KR')}치즈 이상</strong> 후원하면서, 후원 메시지에 아래 코드를
            넣어 주세요.
          </p>
          <p className="code" aria-label="후원 코드">
            {result.code}
          </p>
          <p className="hint">30분 안에 후원해야 해요. 코드가 확인되면 방송에 나와요(스트리머 검수가 있을 수 있어요).</p>
        </>
      ) : (
        <>
          <h2>보냈어요!</h2>
          <p>{result.status === 'Approved' ? '곧 방송에 나와요.' : '스트리머가 확인하면 방송에 나와요.'}</p>
        </>
      )}
      <button type="button" onClick={onAgain}>
        다른 이미지 보내기
      </button>
    </section>
  )
}
