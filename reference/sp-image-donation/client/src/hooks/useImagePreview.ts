import { useEffect, useState } from 'react'

// 고른 파일을 올리기 전에 미리 보여 줄 주소(data:image/...)를 만든다
export function useImagePreview(file: File | null): string | null {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null)

  useEffect(() => {
    if (!file) return
    const reader = new FileReader() // 내 PC의 파일을 브라우저 안에서만 읽는다 (서버로 가지 않음)
    reader.onload = () => setPreview({ file, url: reader.result as string })
    reader.readAsDataURL(file)
    return () => reader.abort() // 다 읽기 전에 다른 파일을 고르면 읽기를 멈춘다
  }, [file])

  // 지금 고른 파일의 미리보기만 돌려준다 (파일을 바꾸는 순간 옛 미리보기는 숨긴다)
  return preview && preview.file === file ? preview.url : null
}
