import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import * as api from '../api'
import DonatePage from './DonatePage'

// 서버 호출은 가짜로 바꾼다 (진짜 서버 없이 화면만 검사)
vi.mock('../api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../api')>()),
  getStreamer: vi.fn(),
  uploadDonation: vi.fn(),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/d/:slug" element={<DonatePage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('DonatePage', () => {
  it('DonatePage_ShowsCodeInCheeseMode', async () => {
    vi.mocked(api.getStreamer).mockResolvedValue({
      slug: 'cheese', displayName: '치즈 방송', mode: 'Cheese', minCheese: 1000, maxFileMb: 5,
    })
    vi.mocked(api.uploadDonation).mockImplementation(async (_slug, _form, onProgress) => {
      onProgress(100)
      return { id: 7, status: 'AwaitingCheese', code: '#AB12' }
    })
    const user = userEvent.setup()
    renderAt('/d/cheese')

    expect(await screen.findByRole('heading', { name: /치즈 방송/ })).toBeInTheDocument()
    await user.upload(screen.getByLabelText('이미지'), new File(['png'], 'cat.png', { type: 'image/png' }))
    await user.type(screen.getByLabelText('닉네임'), '시청자')
    await user.type(screen.getByLabelText(/메시지/), '귀여운 고양이')
    await user.click(screen.getByRole('button', { name: '보내기' }))

    // 코드와 안내(최소 치즈)가 보인다
    expect(await screen.findByText('#AB12')).toBeInTheDocument()
    expect(screen.getByText(/1,000치즈 이상/)).toBeInTheDocument()

    const [slug, form] = vi.mocked(api.uploadDonation).mock.calls[0]!
    expect(slug).toBe('cheese')
    expect(form.get('nickname')).toBe('시청자')
    expect(form.get('message')).toBe('귀여운 고양이')
    expect((form.get('image') as File).name).toBe('cat.png')
  })

  it('shows thank-you message without code in free mode', async () => {
    vi.mocked(api.getStreamer).mockResolvedValue({
      slug: 'free', displayName: '무료 방송', mode: 'Free', minCheese: 0, maxFileMb: 5,
    })
    vi.mocked(api.uploadDonation).mockResolvedValue({ id: 8, status: 'Pending' })
    const user = userEvent.setup()
    renderAt('/d/free')

    await screen.findByRole('heading', { name: /무료 방송/ })
    await user.upload(screen.getByLabelText('이미지'), new File(['png'], 'dog.png', { type: 'image/png' }))
    await user.type(screen.getByLabelText('닉네임'), '시청자')
    await user.click(screen.getByRole('button', { name: '보내기' }))

    expect(await screen.findByText(/스트리머가 확인하면 방송에 나와요/)).toBeInTheDocument()
    expect(screen.queryByText(/치즈 이상/)).not.toBeInTheDocument()
  })

  it('blocks files over the size limit before uploading', async () => {
    vi.mocked(api.getStreamer).mockResolvedValue({
      slug: 'free', displayName: '무료 방송', mode: 'Free', minCheese: 0, maxFileMb: 1,
    })
    vi.mocked(api.uploadDonation).mockClear()
    const user = userEvent.setup()
    renderAt('/d/free')

    await screen.findByRole('heading', { name: /무료 방송/ })
    const big = new File([new Uint8Array(1024 * 1024 + 1)], 'big.png', { type: 'image/png' })
    await user.upload(screen.getByLabelText('이미지'), big)

    expect(screen.getByRole('alert')).toHaveTextContent('1MB')
    expect(screen.getByRole('button', { name: '보내기' })).toBeDisabled()
  })
})
