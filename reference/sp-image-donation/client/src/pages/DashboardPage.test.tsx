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
  reportDonation: vi.fn(),
  clearOverlay: vi.fn(),
}))

// 실시간 연결(SignalR)은 이 테스트에서 쓰지 않는다
vi.mock('../hooks/useDashboardHub', () => ({ useDashboardHub: () => 'connected' }))

const pending: Donation = {
  id: 42, status: 'Pending', nickname: '시청자', message: '<b>굵게?</b>', imageUrl: '/media/abc.webp',
  code: null, cheeseAmount: null, createdAt: '2026-11-01T12:00:00Z', expiresAt: null, reported: false,
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

  it('report asks for a reason and calls the API', async () => {
    vi.mocked(api.listDonations).mockResolvedValue([{ ...pending, status: 'Shown' }])
    vi.mocked(api.reportDonation).mockResolvedValue({ ...pending, status: 'Rejected', imageUrl: null, reported: true })
    vi.spyOn(window, 'prompt').mockReturnValue('  부적절한 이미지  ')
    const user = userEvent.setup()
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    const card = (await screen.findByText('시청자')).closest('article')!
    await user.click(within(card).getByRole('button', { name: '신고' }))

    expect(api.reportDonation).toHaveBeenCalledWith(42, '부적절한 이미지')
    expect(await within(card).findByText('거절됨')).toBeInTheDocument()
    expect(await screen.findByText(/신고했어요/)).toBeInTheDocument()
    expect(within(card).getByText('증거로 보관 중 (7일 뒤 삭제)')).toBeInTheDocument()
    expect(within(card).queryByRole('button', { name: '신고' })).not.toBeInTheDocument() // 이미 신고함
  })

  it('report failure shows the error, not a success message', async () => {
    vi.mocked(api.listDonations).mockResolvedValue([{ ...pending, status: 'Shown' }])
    vi.mocked(api.reportDonation).mockRejectedValue(new api.ApiError(500, '서버 오류로 신고하지 못했어요.'))
    vi.spyOn(window, 'prompt').mockReturnValue('부적절한 이미지')
    const user = userEvent.setup()
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    const card = (await screen.findByText('시청자')).closest('article')!
    await user.click(within(card).getByRole('button', { name: '신고' }))

    expect(await screen.findByText('서버 오류로 신고하지 못했어요.')).toBeInTheDocument()
    expect(screen.queryByText(/신고했어요/)).not.toBeInTheDocument()
  })

  it('hides report when the image is already gone', async () => {
    vi.mocked(api.listDonations).mockResolvedValue([
      { ...pending, id: 1, nickname: '거절', status: 'Rejected', imageUrl: null },
      { ...pending, id: 2, nickname: '정지', status: 'Cleared', imageUrl: null },
      { ...pending, id: 3, nickname: '만료', status: 'Expired', imageUrl: null },
    ])
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)

    await screen.findByText('거절')
    expect(screen.queryByRole('button', { name: '신고' })).not.toBeInTheDocument()
    expect(screen.getAllByText('이미지 삭제됨')).toHaveLength(3)
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
