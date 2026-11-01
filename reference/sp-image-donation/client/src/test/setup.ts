// Vitest 공통 준비: 모든 테스트 파일보다 먼저 실행된다
import '@testing-library/jest-dom/vitest' // toBeInTheDocument() 같은 DOM 확인 함수
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup()) // 테스트마다 화면을 비운다
