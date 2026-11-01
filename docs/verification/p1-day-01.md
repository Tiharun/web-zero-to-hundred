# 검증 기록: p1-day-01

- 검증일: 2026-11-01
- 환경: Linux 샌드박스, Node v22.23.4, Playwright Chromium 153.0.8010.12 (Windows 11의 Edge와 같은 Chromium 계열)
- 방법 요약: `textbook/content/p1/day-01.md`에서 📄 캡션이 붙은 코드 블록을 **원문 그대로** 꺼내 스크래치 폴더에 캡션 경로대로 저장하고, 더블클릭과 같은 `file://` 방식으로 1280px·360px에서 열었어요. 확인 항목: 탭 제목, `h1`, 문단 수, 문자 인코딩(UTF-8), 가로 스크롤 없음, 콘솔 오류 0. 블록 꺼내기는 `docs/CONTENT-GUIDE.md` 6.2절의 `extract-blocks.mjs`, 브라우저 확인은 6.4절의 `verify-p1.mjs`(`--file` 방식과 정적 서버 방식)로 했어요.
- Windows 화면 절차는 이 환경에서 실행할 수 없어서 공식 문서 대조로 기록했어요. 공식 지원 문서 호스트(`support.microsoft.com`)는 이 환경에서 직접 열리지 않아, 그 호스트로 범위를 한정한 웹 검색 결과 요약으로 대조했어요.

| Day | 블록(캡션) | 방법 | 결과 |
|---|---|---|---|
| p1-d01 | C:\dev\hello\hello.html (6단계, 줄 222) | file:// + Chromium, 1280/360px. 제목 "나의 첫 웹페이지", h1 "안녕하세요!", 문단 1개, UTF-8 | 통과 (콘솔 오류 0, 가로 스크롤 없음) |
| p1-d01 | 8단계 수정: `<h1>안녕하세요, 저는 달빛곰이에요!</h1>` | 6단계 블록의 h1 줄만 바꿔 file:// 로 열기 | 통과 (h1이 바뀐 문장으로 보임) |
| p1-d01 | C:\dev\hello\hello.html (과제 1 정답, 줄 327) | file:// + Chromium, 1280/360px. 제목 "달빛곰의 자기소개", h1 "달빛곰", 문단 3개 | 통과 (콘솔 오류 0) |
| p1-d01 | C:\dev\hello\favorites.html (과제 2 정답, 줄 352) | file:// + Chromium, 1280/360px. 제목 "내가 좋아하는 것", h1 "내가 좋아하는 것 3가지", 문단 3개 | 통과 (콘솔 오류 0) |
| p1-d01 | 오늘 끝 상태 전체 코드: hello.html (줄 384), favorites.html (줄 401) | file:// 와 정적 서버(http) 두 방식 + Chromium. 과제 정답 블록과 바이트 단위로 같은지 `cmp` | 통과 (두 블록이 정답과 같음) |
| p1-d01 | 끝 상태 코드를 CRLF 줄바꿈으로 저장한 경우 | 메모장처럼 CRLF로 저장해 file:// 로 열기 | 통과 (LF와 같은 결과) |
| p1-d01 | 🧯 "한글이 �ȳ��ϼ��� 처럼 깨져 보여요" | `<meta charset="utf-8">`가 있는 파일을 CP949(ANSI)로 저장해 열기 | 통과 (화면에 `�ȳ��ϼ���!`가 실제로 보임. UTF-8 저장은 정상) |
| p1-d01 | 문제 해결 "큰 제목 아래 글씨까지 전부 크게 보여요" | `</h1>`의 `/`를 빠뜨린 파일 열기 | 통과 (아래 문단이 32px로 커짐) |
| p1-d01 | 문제 해결 "꺾쇠 표시가 글자 그대로 보여요" | `.txt` 파일을 브라우저로 열기, 여는 `<` 빠뜨리기 | 통과 (코드 전체가 글자로 보임 / `h1>`이 보임) |
| p1-d01 | 문제 해결 "제목이나 문장이 통째로 사라졌어요" | `<h1안녕하세요!</h1>`처럼 `>`를 빠뜨린 파일 열기 | 통과 (제목 글자가 화면에서 사라짐) |
| p1-d01 | 과제 1 해설 "`<head>`는 글을 쓰는 곳이 아니에요" | `<head>` 안에 글을 쓴 파일 열기 | 통과 (브라우저가 그 글을 본문으로 옮겨 보여 줌 → "안 보인다"가 아니라 "쓰는 곳이 아니다"로 서술) |
| p1-d01 | 2단계 보기 → 표시 → 파일 확장명 | 공식 문서 대조: https://support.microsoft.com/ko-kr/windows/experience/storage-filemanagement/common-file-name-extensions-in-windows (보기 > 표시 > 파일 이름 확장명, 보기 > 옵션 > 폴더 및 검색 옵션 변경의 "알려진 파일 형식의 파일 확장명 숨기기"), 한국어 메뉴 표기 "파일 확장명"은 한국어 사용 안내 글로 교차 확인 | 대조 (실기 미확인, 본문에 "버전에 따라 이름이 조금 다를 수 있어요" 표기) |
| p1-d01 | 3단계 새로 만들기 → 폴더, `Ctrl + Shift + N` | 공식 문서 대조: https://developer.mozilla.org/ko/docs/Learn_web_development/Getting_started/Environment_setup/Dealing_with_files (원문 `mdn/content` 저장소: "selecting the New button in the File Explorer window and selecting Folder (or pressing Ctrl + Shift + N)", Windows 11 기준 작성) | 대조 (실기 미확인) |
| p1-d01 | 확장자는 마지막 점 뒤 (`hello.html.txt`의 확장자는 `.txt`) | 공식 문서 대조: 위 MDN 문서 "the last dot is assumed to be the start of the file extension" | 대조 |
| p1-d01 | 5단계 메모장 저장 창(파일 형식 "모든 파일", 파일 이름 따옴표, 인코딩 UTF-8) | 공식 문서를 찾지 못함(지원 호스트 차단). 메모장 버전마다 저장 창이 달라질 수 있어, 본문을 따옴표 + 파일 형식 + 저장 직후 확인 + 이름 바꾸기 해결 순서로 이중 대비 | 미검증 (Windows 실기 불가) |
| p1-d01 | 3단계 `C:\` 맨 위 폴더 만들기 권한, 문제 해결의 관리자 권한·저장 권한 대화 상자 문구 | Windows 실기 불가. 영어 원문은 널리 알려진 대화 상자 문구, 한국어 문구는 "버전에 따라 조금 다를 수 있어요"로 표기 | 미검증 (Windows 실기 불가) |
| p1-d01 | 교재 렌더 | `cd textbook && npm run check -- --only p1-d01`, `npm run build -- --allow-missing --out <스크래치>/index.html`, 굵게 검사 스크립트 | 통과 (오류 0, 굵게가 풀리지 않은 곳 없음) |
| p1-d01 | 화면 확인 | Playwright로 `index.html#/day/p1-d01`을 1280px·360px로 열어 스크린샷(`p1-day-01.jpg`, `p1-day-01-mobile.jpg`). h2 8개, 코드 상자 9개 = 복사 버튼 9개, 체크박스 7개, 정답 3개, 용어 링크 15개, 360px 가로 스크롤 없음, 콘솔 오류 0, 외부 요청 0. 데스크톱 그림은 전체 페이지 캡처라 왼쪽 고정 사이드바가 첫 화면 높이까지만 찍혀요(캡처 방식 때문이고 실제 화면에서는 사이드바가 항상 보여요). 휴대폰 그림은 Chromium 캡처 높이 한도 때문에 4000px씩 찍어 이어 붙였어요 | 통과 |

## 개요와 달라진 점

- P1 상세 개요(`_outline.md`)는 아직 없어요(다음 Task). Day 1의 끝 상태는 `C:\dev\hello\hello.html`(자기소개)과 `C:\dev\hello\favorites.html`이고, Day 2는 이 `C:\dev\hello` 폴더를 VS Code로 여는 것으로 예고했어요.
- Day 1이 처음 정의하는 용어(15개): 인터넷, 웹, 브라우저, 서버, URL, 웹페이지, 웹사이트, HTML, 코드, 텍스트 편집기, 파일, 폴더, 확장자, 경로, UTF-8.
