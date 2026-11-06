## Global Constraints

- 학습자 환경: **Windows 11**. 터미널은 **PowerShell**. 경로는 항상 전체 경로로 쓴다.
- 학습자 작업 폴더: P1 `C:\dev\my-creator-site`, P2 `C:\dev\streamer-hub`, P3 `C:\dev\viewer-arena`, SP `C:\dev\image-donation`.
- Day 수: `p1` 30, `p2` 40, `p3` 45, `sp` 40. Day당 `minutes`는 60~120.
- 해금: `p1` requires [], `p2` [`p1`], `p3` [`p2`], `sp` [`p2`]. 페이지 `roadmap` requires [`p3`].
- track: `p1`·`p2`·`p3` = `main`, `sp` = `special`.
- 진도 저장 키: `wzh:v1:progress`.
- Day 필수 h2 순서(정확히 이 문자열, U+FE0F 유무는 무시): `🎯 오늘의 목표` → `📖 개념 이해` → `🛠️ 따라하기` → `✍️ 과제` → `✅ 정답` → `🧯 자주 막히는 곳` → `📝 오늘의 체크리스트` → (선택) `📚 더 알아보기`.
- 확장 블록: `:::tip`, `:::warn`, `:::info`, `:::path`, `:::success`, `:::answer <제목>`. 중첩 금지.
- 결과물 `index.html`: 런타임 외부 요청 0건(CDN·웹폰트 없음), 16MB 미만, `file://`로 더블클릭해도 동작(Windows 11 기본 브라우저인 Edge = Chromium).
- 문체: 해요체. 버전에 민감한 내용에는 "작성 기준일 2026-11"을 표기하고 `--version` 확인법을 함께 둔다. 존재하지 않는 API·옵션을 쓰지 않는다.
- SP는 결제를 다루지 않는다. 테스트 모드(가짜 후원 이벤트)로 전체 흐름을 실습할 수 있어야 한다.
- 리포지토리의 어떤 파일에도 모델 식별자를 쓰지 않는다. 커밋 메시지는 시스템이 지정한 attribution 줄로 끝낸다.
- 병렬로 실행하는 작업 에이전트는 **git 커밋·푸시를 하지 않는다**(인덱스 충돌 방지). 커밋·푸시는 오케스트레이터가 리뷰를 통과한 뒤에 한다. 컨테이너는 휘발성이므로 **각 Task가 끝날 때마다 커밋·푸시**한다.

