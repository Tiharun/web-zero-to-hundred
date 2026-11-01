import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ApiError, login, register } from '../api'

// 치지직 로그인이 실패해서 돌아왔을 때 (/login?error=...)
const chzzkErrors: Record<string, string> = {
  'chzzk-config': '서버에 치지직 앱 설정(Client ID/Secret)이 없어요. 개발용 계정과 테스트 모드로 연습하세요.',
  'chzzk-state': '로그인 확인 값(state)이 맞지 않아요. 다시 시도해 주세요.',
}

// /login — 개발용 로컬 계정(가입·로그인) + 치지직 로그인
export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const errorCode = params.get('error')
  const [error, setError] = useState(errorCode ? (chzzkErrors[errorCode] ?? '치지직 로그인에 실패했어요. 다시 시도해 주세요.') : '')

  async function submit(isNew: boolean) {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.')
      return
    }
    setBusy(true)
    setError('')
    try {
      if (isNew) await register(email, password)
      await login(email, password) // 성공하면 서버가 로그인 쿠키를 준다
      navigate('/dashboard')
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setError('이메일 또는 비밀번호가 맞지 않아요.')
      else setError(e instanceof Error ? e.message : '로그인하지 못했어요.')
    } finally {
      setBusy(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    void submit(false)
  }

  return (
    <main className="page narrow">
      <h1>스트리머 로그인</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <label htmlFor="email">이메일</label>
        <input id="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="hint">개발용 로컬 계정이에요. 비밀번호는 6자 이상, 대문자·소문자·숫자·기호를 섞어 주세요.</p>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions">
          <button type="submit" disabled={busy}>
            로그인
          </button>
          <button type="button" className="quiet" disabled={busy} onClick={() => void submit(true)}>
            처음이에요 (가입하고 로그인)
          </button>
        </div>
      </form>

      <hr />
      {/* 치지직 로그인은 서버가 치지직 로그인 화면으로 보내 준다 (개발자 센터 앱 등록 필요) */}
      <a className="button" href="/api/chzzk/login">
        치지직으로 로그인
      </a>
      <p className="hint">치지직 앱 승인이 없으면 개발용 계정과 테스트 모드로 모든 흐름을 연습할 수 있어요.</p>
    </main>
  )
}
