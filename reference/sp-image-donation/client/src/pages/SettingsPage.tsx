import { useEffect, useState, type FormEvent } from 'react'
import { useOutletContext } from 'react-router'
import { donatePageUrl, getOverlayToken, getSettings, overlayUrl, rotateOverlayToken, saveSettings, type Settings } from '../api'
import type { StreamerContext } from '../components/StreamerLayout'

// /settings — 후원 방식, 자동 승인, 표시 시간, 간격, 금지어, 오버레이 주소 재발급, 치지직 연결
export default function SettingsPage() {
  const { me } = useOutletContext<StreamerContext>()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [bannedText, setBannedText] = useState('') // 금지어: 한 줄에 하나
  const [token, setToken] = useState('')
  const [notice, setNotice] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let ignore = false
    Promise.all([getSettings(), getOverlayToken()])
      .then(([s, t]) => {
        if (ignore) return
        setSettings(s)
        setBannedText(s.bannedWords.join('\n'))
        setToken(t.overlayToken)
      })
      .catch((e) => {
        if (!ignore) setLoadError(e instanceof Error ? e.message : '설정을 불러오지 못했어요.')
      })
    return () => {
      ignore = true
    }
  }, [])

  if (loadError) {
    return (
      <p role="alert" className="error">
        {loadError} 새로고침해 주세요.
      </p>
    )
  }
  if (!settings) return <p>불러오는 중…</p>

  // 입력 하나를 바꿀 때: 나머지 값은 그대로 두고 새 객체를 만든다
  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => (s ? { ...s, [key]: value } : s))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    try {
      const bannedWords = bannedText.split('\n').map((w) => w.trim()).filter((w) => w.length > 0)
      setSettings(await saveSettings({ ...settings, bannedWords }))
      setNotice('저장했어요.')
    } catch (err) {
      setNotice(err instanceof Error ? err.message : '저장하지 못했어요.')
    }
  }

  async function handleRotate() {
    if (!window.confirm('오버레이 주소를 새로 만들까요? OBS의 브라우저 소스 주소도 바꿔야 해요.')) return
    try {
      setToken((await rotateOverlayToken()).overlayToken)
      setNotice('새 오버레이 주소를 만들었어요. 옛 주소는 더 이상 동작하지 않아요.')
    } catch (e) {
      setNotice(e instanceof Error ? e.message : '재발급하지 못했어요. 다시 시도해 주세요.')
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(overlayUrl(token))
      setNotice('오버레이 주소를 복사했어요.')
    } catch {
      setNotice('복사하지 못했어요. 주소 칸을 직접 선택해서 복사해 주세요.')
    }
  }

  return (
    <section className="narrow">
      <h1>설정</h1>
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}

      <form className="stack" onSubmit={handleSave}>
        <fieldset>
          <legend>후원 방식</legend>
          <label>
            <input type="radio" name="mode" checked={settings.mode === 'Free'} onChange={() => update('mode', 'Free')} />
            무료 이미지 후원
          </label>
          <label>
            <input type="radio" name="mode" checked={settings.mode === 'Cheese'} onChange={() => update('mode', 'Cheese')} />
            치즈 후원 연동 (시청자가 치지직 후원 메시지에 코드를 넣음)
          </label>
        </fieldset>

        <label htmlFor="minCheese">최소 치즈</label>
        <input
          id="minCheese"
          type="number"
          min={0}
          disabled={settings.mode !== 'Cheese'}
          value={settings.minCheese}
          onChange={(e) => update('minCheese', Number(e.target.value))}
        />

        <label>
          <input type="checkbox" checked={settings.autoApprove} onChange={(e) => update('autoApprove', e.target.checked)} />
          자동 승인 (검수 없이 바로 방송에 표시)
        </label>

        <label htmlFor="displaySeconds">표시 시간 (3~30초)</label>
        <input
          id="displaySeconds"
          type="number"
          min={3}
          max={30}
          value={settings.displaySeconds}
          onChange={(e) => update('displaySeconds', Number(e.target.value))}
        />

        <label htmlFor="minIntervalSeconds">다음 이미지까지 간격 (0~60초)</label>
        <input
          id="minIntervalSeconds"
          type="number"
          min={0}
          max={60}
          value={settings.minIntervalSeconds}
          onChange={(e) => update('minIntervalSeconds', Number(e.target.value))}
        />

        <label htmlFor="maxFileMb">최대 파일 크기 (1~10MB)</label>
        <input
          id="maxFileMb"
          type="number"
          min={1}
          max={10}
          value={settings.maxFileMb}
          onChange={(e) => update('maxFileMb', Number(e.target.value))}
        />

        <label htmlFor="bannedWords">금지어 (한 줄에 하나)</label>
        <textarea id="bannedWords" rows={4} value={bannedText} onChange={(e) => setBannedText(e.target.value)} />

        <button type="submit">저장</button>
      </form>

      <h2>주소</h2>
      <p>
        후원 페이지: <a href={`/d/${me.streamer!.slug}`}>{donatePageUrl(me.streamer!.slug)}</a>
      </p>
      <label htmlFor="overlayUrl">OBS 오버레이 주소 (비밀)</label>
      <input id="overlayUrl" readOnly value={overlayUrl(token)} onFocus={(e) => e.target.select()} />
      <div className="actions">
        <button type="button" onClick={handleCopy}>
          복사
        </button>
        <button type="button" className="quiet" onClick={handleRotate}>
          재발급 (유출됐을 때)
        </button>
      </div>

      <h2>치지직 연결</h2>
      {me.chzzk ? (
        <p>
          연결됨: <strong>{me.chzzk.channelName}</strong> · 세션 소켓 {me.chzzk.sessionConnected ? '연결됨' : '연결 안 됨(치즈 모드에서 1분 안에 연결)'}
        </p>
      ) : (
        <p>
          <a className="button" href="/api/chzzk/login">
            치지직 계정 연결
          </a>{' '}
          <span className="hint">앱 승인 전에는 대시보드의 테스트 모드를 쓰세요.</span>
        </p>
      )}
    </section>
  )
}
