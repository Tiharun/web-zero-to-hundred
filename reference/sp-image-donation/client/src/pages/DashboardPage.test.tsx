import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import type { Donation } from '../api'
import DashboardPage from './DashboardPage'

vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  listDonations: vi.fn(),
  approveDonation: vi.fn(),
  rejectDonation: vi.fn(),
  clearOverlay: vi.fn(),
}))

// 실시간 연결(SignalR)은 이 테스트에서 쓰지 않는다
vi.mock('../hooks/useDashboardHub', () => ({ useDashboardHub: () => 'connected' }))

const pending: Donation = {
  id: 42, status: 'Pending', nickname: '시청자', message: '<b>굵게?</b>', imageUrl: '/media/abc.webp',
  code: null, cheeseAmount: null, createdAt: '2026-11-01T12:00:00Z', expiresAt: null,
}

describe('DashboardPage', () => {
  it('Dashboard_ApproveButtonCallsApi', async () => {
    vi.mocked(api.listDonations).mockResolvedValue([pending])
    vi.mocked(api.approveDonation).mockResolvedValue({ ...pending, status: 'Approved' })
    const user = userEvent.setup()
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    const card = (await screen.findByText('시청자')).closest('article')!
    expect(within(card).getByText('<b>굵게?</b>')).toBeInTheDocument() // HTML이 아니라 글자로 보인다
    await user.click(within(card).getByRole('button', { name: '승인' }))

    expect(api.approveDonation).toHaveBeenCalledWith(42)
    expect(await within(card).findByText('승인됨')).toBeInTheDocument()
  })

  it('emergency stop calls clear', async () => {
    vi.mocked(api.listDonations).mockResolvedValue([])
    vi.mocked(api.clearOverlay).mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    await screen.findByText(/아직 받은 후원이 없어요/)
    await user.click(screen.getByRole('button', { name: /긴급 정지/ }))

    expect(api.clearOverlay).toHaveBeenCalled()
  })
})
