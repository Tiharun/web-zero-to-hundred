import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Overlay from './Overlay'
import './overlay.css'

// OBS 브라우저 소스가 여는 페이지: overlay.html?token=<오버레이 토큰>
const token = new URLSearchParams(window.location.search).get('token')

createRoot(document.getElementById('overlay-root')!).render(
  <StrictMode>
    {token ? (
      <Overlay token={token} />
    ) : (
      <p className="overlay-error">오버레이 주소에 토큰이 없어요. 설정 화면의 주소를 그대로 붙여 넣으세요.</p>
    )}
  </StrictMode>,
)
