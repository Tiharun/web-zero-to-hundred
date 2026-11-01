import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { logout, type Me } from '../api'
import { useMe } from '../hooks/useMe'

// 자식 화면이 useOutletContext()로 꺼내 쓰는 값
export interface StreamerContext {
  me: Me
  reload: () => void
}

// 스트리머 화면(대시보드·설정·온보딩)의 공통 틀: 로그인 확인 + 위쪽 메뉴
export default function StreamerLayout() {
  const { me, loading, reload } = useMe()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) return <main className="page">불러오는 중…</main>
  if (!me) return <Navigate to="/login" replace /> // 로그인하지 않았으면 로그인 화면으로
  if (!me.streamer && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <header className="topbar">
        <strong>이미지 후원</strong>
        {me.streamer && (
          <nav>
            <NavLink to="/dashboard">대시보드</NavLink>
            <NavLink to="/settings">설정</NavLink>
            <NavLink to="/onboarding">시작 가이드</NavLink>
          </nav>
        )}
        <span className="grow" />
        <span className="hint">{me.userName}</span>
        <button type="button" className="quiet" onClick={handleLogout}>
          로그아웃
        </button>
      </header>
      <main className="page">
        <Outlet context={{ me, reload } satisfies StreamerContext} />
      </main>
    </>
  )
}
