import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ApiError, getStreamer, type CreateDonationResult, type PublicStreamer } from '../api'
import DonationForm from '../components/DonationForm'
import DonationResult from '../components/DonationResult'

// /d/:slug — 시청자가 이미지를 보내는 공개 페이지 (로그인 없음, 휴대폰에서도 쓰기 좋게)
export default function DonatePage() {
  const { slug = '' } = useParams() // 주소의 :slug 부분
  const [streamer, setStreamer] = useState<PublicStreamer | null>(null)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CreateDonationResult | null>(null)

  useEffect(() => {
    let ignore = false
    getStreamer(slug)
      .then((s) => {
        if (!ignore) setStreamer(s)
      })
      .catch((e) => {
        if (!ignore) setError(e instanceof ApiError && e.status === 404 ? '없는 후원 페이지예요.' : '후원 페이지를 불러오지 못했어요.')
      })
    return () => {
      ignore = true
    }
  }, [slug])

  if (error) {
    return (
      <main className="page narrow">
        <p role="alert">{error}</p>
      </main>
    )
  }
  if (!streamer) {
    return <main className="page narrow">불러오는 중…</main>
  }

  return (
    <main className="page narrow">
      <h1>{streamer.displayName}에게 이미지 후원</h1>
      {streamer.mode === 'Cheese' && !result && (
        <p className="notice">이 방송은 치지직 치즈 후원과 연동돼요. 이미지를 보내면 후원 코드가 나와요. 이 사이트는 돈을 받지 않아요.</p>
      )}
      {result ? (
        <DonationResult result={result} streamer={streamer} onAgain={() => setResult(null)} />
      ) : (
        <DonationForm streamer={streamer} onDone={setResult} />
      )}
    </main>
  )
}
