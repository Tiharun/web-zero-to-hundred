import { useState, type FormEvent } from 'react'
import { sendTestDonation } from '../api'

// 테스트 모드: 치지직 없이 "치즈 후원이 들어왔다"를 흉내 낸다 (돈은 오가지 않는다)
export default function TestDonationPanel({ waitingCode }: { waitingCode: string | null }) {
  const [amount, setAmount] = useState(1000)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await sendTestDonation(amount, message)
      setStatus('가짜 치즈 후원을 보냈어요. 코드와 금액이 맞으면 목록의 상태가 바뀌어요.')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : '보내지 못했어요.')
    }
  }

  return (
    <section className="panel">
      <h2>테스트 모드</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <label>
          치즈
          <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
        <label className="grow">
          후원 메시지
          <input value={message} maxLength={100} placeholder="메시지에 #코드를 넣어 보세요" onChange={(e) => setMessage(e.target.value)} />
        </label>
        {waitingCode && (
          <button type="button" className="quiet" onClick={() => setMessage(`이미지 부탁해요 ${waitingCode}`)}>
            대기 중인 코드 넣기
          </button>
        )}
        <button type="submit">가짜 치즈 후원 보내기</button>
      </form>
      <p role="status" className="hint">
        {status}
      </p>
    </section>
  )
}
