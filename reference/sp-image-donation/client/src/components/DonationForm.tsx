import { useState, type ChangeEvent, type FormEvent } from 'react'
import { uploadDonation, type CreateDonationResult, type PublicStreamer } from '../api'
import { useImagePreview } from '../hooks/useImagePreview'

interface Props {
  streamer: PublicStreamer
  onDone: (result: CreateDonationResult) => void
}

const MAX_NICKNAME = 20
const MAX_MESSAGE = 100

// 시청자 후원 입력: 이미지 선택·미리보기, 닉네임, 메시지, 업로드 진행률
export default function DonationForm({ streamer, onDone }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState<number | null>(null) // null이면 보내는 중이 아니다
  const [error, setError] = useState('')
  const preview = useImagePreview(file)

  // 크기는 서버가 다시 검사하지만, 먼저 알려 주면 시청자가 기다리지 않아도 된다
  const tooBig = file !== null && file.size > streamer.maxFileMb * 1024 * 1024
  const sending = progress !== null

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
    setError('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault() // 폼의 기본 동작(페이지 새로고침)을 막는다
    if (!file || tooBig) return

    const form = new FormData() // multipart/form-data로 보낼 내용
    form.append('image', file)
    form.append('nickname', nickname)
    form.append('message', message)

    setError('')
    setProgress(0)
    try {
      onDone(await uploadDonation(streamer.slug, form, setProgress))
    } catch (err) {
      setError(err instanceof Error ? err.message : '보내지 못했어요.')
    } finally {
      setProgress(null)
    }
  }

  return (
    <form className="donation-form" onSubmit={handleSubmit}>
      <label htmlFor="image">이미지</label>
      <input id="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} />
      <p className="hint">JPEG·PNG·WebP·GIF, {streamer.maxFileMb}MB까지. 움직이는 GIF는 첫 장면만 보여요.</p>
      {preview && <img className="preview" src={preview} alt="보낼 이미지 미리보기" />}

      <label htmlFor="nickname">닉네임</label>
      <input id="nickname" required maxLength={MAX_NICKNAME} value={nickname} onChange={(e) => setNickname(e.target.value)} />

      <label htmlFor="message">메시지 ({message.length}/{MAX_MESSAGE})</label>
      <textarea id="message" maxLength={MAX_MESSAGE} rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />

      {(tooBig || error) && (
        <p role="alert" className="error">
          {tooBig ? `이미지는 ${streamer.maxFileMb}MB까지 올릴 수 있어요.` : error}
        </p>
      )}
      {sending && <progress max={100} value={progress} aria-label="업로드 진행률" />}

      <button type="submit" disabled={!file || tooBig || sending}>
        보내기
      </button>
    </form>
  )
}
