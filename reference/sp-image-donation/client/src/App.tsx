import { Link, Navigate, Route, Routes } from 'react-router'
import StreamerLayout from './components/StreamerLayout'
import DashboardPage from './pages/DashboardPage'
import DonatePage from './pages/DonatePage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import SettingsPage from './pages/SettingsPage'

// 주소 → 화면. 오버레이는 OBS용 별도 페이지(overlay.html)라 여기에 없다
export default function App() {
  return (
    <Routes>
      <Route path="/d/:slug" element={<DonatePage />} />
      <Route path="/login" element={<LoginPage />} />
      {/* 로그인이 필요한 화면은 StreamerLayout 안에 둔다 */}
      <Route element={<StreamerLayout />}>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="*"
        element={
          <main className="page narrow">
            <p>없는 페이지예요.</p>
            <Link to="/dashboard">대시보드로</Link>
          </main>
        }
      />
    </Routes>
  )
}
