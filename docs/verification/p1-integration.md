# P1 통합 수정 검증 기록 (Task 12)

## Days 1–10 구간 (2026-11-07)

| 주장 | 근거 | 상태 |
|---|---|---|
| Live Preview는 기본으로 편집하는 즉시 미리 보기를 갱신하고, `livePreview.autoRefreshPreview`로 저장 시/끄기로 바꿀 수 있다 | 검색: [microsoft/vscode-livepreview](https://github.com/microsoft/vscode-livepreview) README (2026-11-07 검색 요약) | 확인됨. 교재는 "저장하면 저절로 바뀌어요"로 씀 |
| Live Preview 툴바에 새로 고침 버튼이 있다 | 검색에서 확인되지 않음 | **미확인**. 교재에 쓰지 않음. 대신 "미리 보기 닫고 Show Preview로 다시 열기"만 안내(항상 최신 파일을 읽음) |
| VS Code에서 `F5`=디버깅 시작, `Ctrl+F5`=디버깅 없이 실행 | 검색: [vscode#81195](https://github.com/microsoft/vscode/issues/81195), 포럼 보고 (공식 단축키 표는 이번 검색에서 직접 못 봄) | 부분 확인. 교재는 "엉뚱한 선택 창이 떠요"라고만 씀 |
| `git push`가 `remote: Repository not found.`를 낸다(주소 아이디·이름 오류, 다른 계정일 때도) | 검색: [codemia](https://codemia.io/knowledge-hub/path/git_push_error_repository_not_found), [GitHub community](https://github.community/t/fatal-repository-not-found/1180) | 확인됨(커뮤니티) |
| 403 `Permission to … denied`, `fatal: Authentication failed` 문구 | 검색에서 공식 문서 못 찾음. P2 day-02의 기존 문구와 일치 | **미확인(공식)**. 교재에 "문구는 버전에 따라 달라요" 표기 |
| 한국어 Windows 11 PowerShell 5.1(코드페이지 65001, Git 2.56.0.windows.1)에서 한글 커밋 메시지가 `git log --oneline`에 정상 표시 | 측정: 이 PC, 2026-11-07, 임시 저장소에서 실행 | 이 환경에서는 재현 안 됨. 다른 코드페이지에서의 깨짐 보고는 검색(1차 리뷰 출처)만. 교재는 "깨져 보여도 기록은 정상, GitHub에는 정상 표시"로 안내(Git은 UTF-8로 저장하므로 일반 지식) |
| GitHub 새 저장소 화면의 `Add a README file`/`Choose a license` 문구 | 확인 못 함 | **미확인**. 교재에 "문구가 조금 달라도 해당 항목은 그대로 둬요" 추가 |
| 가입 직후 설문·재로그인 화면 | 확인 못 함 | **미확인**. "설문은 건너뛰어도 돼요, 로그인 화면이 나오면 로그인" 일반 안내만 |
| 탐색기 하위 폴더에서 새 파일 아이콘 위치 | 확인 못 함 | **미확인**. 오른쪽 클릭 → 새 파일로 통일(기본 컨텍스트 메뉴, Day 15·19가 이미 사용) |
