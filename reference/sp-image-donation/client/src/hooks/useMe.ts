import { useEffect, useState } from 'react'
import { getMe, type Me } from '../api'

// 지금 로그인한 스트리머 정보. me가 null이면 로그인하지 않은 상태
export function useMe() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState(0) // 이 숫자를 바꾸면 다시 불러온다 (온보딩 직후 등)

  useEffect(() => {
    let ignore = false // 응답이 오기 전에 화면이 바뀌면 결과를 버린다
    getMe()
      .then((result) => {
        if (!ignore) setMe(result) // 로그인 안 했으면 서버가 본문 없이(204) 응답 → null
      })
      .catch(() => {
        if (!ignore) setMe(null)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [version])

  return { me, loading, reload: () => setVersion((v) => v + 1) }
}
