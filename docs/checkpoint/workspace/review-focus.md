## Review Focus

1. 잠긴 프로젝트의 Day 주소(`#/day/p2-d01`)로 직접 접속 → 본문 대신 잠금 화면과 해금 조건이 보여야 한다. → Task 5 e2e `locked deep link shows lock screen`
2. `localStorage`를 쓸 수 없음(브라우저 설정·정책) → 교재는 정상 표시되고 "진도가 저장되지 않아요" 배너가 떠야 한다. → Task 4 unit `store falls back to memory when storage throws` + Task 5 e2e `storage unavailable banner`
3. 손상되었거나 다른 교재·버전의 백업 파일 불러오기 → 오류 메시지를 보여 주고 기존 진도를 보존하거나, 알 수 없는 Day만 제거하고 가져와야 한다. → Task 4 unit `importBackup rejects garbage / drops unknown days` + Task 5 e2e `corrupt backup keeps progress`
4. 본문 산문에 백틱 없이 쓴 HTML 태그(`<script>`, `<h1>`) → 글자 그대로 보여야 하고, 실행되거나 레이아웃이 깨지면 안 된다. → Task 2 unit `raw HTML in prose is escaped`
5. 360px 폭 휴대폰 + 긴 코드 줄 → 페이지 가로 스크롤이 없어야 하고, 코드 블록 안에서만 스크롤되어야 한다. → Task 5 e2e `no horizontal page scroll at 360px`

(추가 고정: 클립보드 API가 거부되는 환경에서도 코드 복사가 대체 경로로 동작해야 한다 → Task 5 e2e `copy falls back when clipboard denied`)

---

