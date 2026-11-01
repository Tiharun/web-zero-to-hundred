import { useEffect, useState, type FormEvent } from 'react'
import { Link, useOutletContext } from 'react-router'
import { donatePageUrl, getOverlayToken, onboard, overlayUrl } from '../api'
import type { StreamerContext } from '../components/StreamerLayout'

// /onboarding — 가입 직후: 후원 페이지 만들기 → 오버레이 주소 → OBS 설정 → 테스트 후원
export default function OnboardingPage() {
  const { me, reload } = useOutletContext<StreamerContext>()
  return me.streamer ? <OnboardingGuide slug={me.streamer.slug} /> : <CreateStreamerForm onCreated={reload} />
}

function CreateStreamerForm({ onCreated }: { onCreated: () => void }) {
  const [slug, setSlug] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await onboard(slug, displayName)
      onCreated() // 내 정보를 다시 불러오면 안내 화면으로 바뀐다
    } catch (err) {
      setError(err instanceof Error ? err.message : '만들지 못했어요.')
    }
  }

  return (
    <form className="stack narrow" onSubmit={handleSubmit}>
      <h1>후원 페이지 만들기</h1>
      <label htmlFor="slug">후원 페이지 주소</label>
      <input id="slug" required pattern="[a-z0-9\-]{3,30}" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <p className="hint">영문 소문자·숫자·-로 3~30자. 시청자는 {donatePageUrl(slug || '내주소')} 로 들어와요.</p>
      <label htmlFor="displayName">방송 이름</label>
      <input id="displayName" required maxLength={40} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button type="submit">만들기</button>
    </form>
  )
}

function OnboardingGuide({ slug }: { slug: string }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    getOverlayToken()
      .then((r) => {
        if (!ignore) setToken(r.overlayToken)
      })
      .catch((e) => {
        if (!ignore) setError(e instanceof Error ? e.message : '오버레이 주소를 불러오지 못했어요.')
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="narrow">
      <h1>시작 가이드</h1>
      <ol className="steps">
        <li>
          <h2>후원 페이지</h2>
          <p>이 주소를 방송 설명이나 채팅 공지에 올리세요.</p>
          <a href={`/d/${slug}`}>{donatePageUrl(slug)}</a>
        </li>
        <li>
          <h2>OBS 오버레이</h2>
          <p>
            OBS의 <strong>소스 목록</strong>에서 <strong>+</strong> → <strong>브라우저</strong>를 고르고, <strong>URL</strong> 칸에 아래
            주소를 붙여 넣으세요. <strong>너비</strong> 1920, <strong>높이</strong> 1080으로 바꾸세요. 이 주소는 비밀번호처럼 다루세요(유출되면
            설정에서 재발급).
          </p>
          {error ? (
            <p role="alert" className="error">
              {error} 설정 화면에서 다시 확인해 주세요.
            </p>
          ) : (
            <input readOnly aria-label="오버레이 주소" value={token ? overlayUrl(token) : '불러오는 중…'} onFocus={(e) => e.target.select()} />
          )}
        </li>
        <li>
          <h2>테스트 후원</h2>
          <p>
            <Link to="/settings">설정</Link>에서 후원 방식을 고르고, 후원 페이지에서 이미지를 보낸 뒤 <Link to="/dashboard">대시보드</Link>
            의 테스트 모드로 흐름을 확인하세요.
          </p>
        </li>
      </ol>
    </section>
  )
}
