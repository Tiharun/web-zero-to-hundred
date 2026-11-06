### Task 3: 커리큘럼 로더, 용어 병합, 조립, 빌드 CLI

**Files:**
- Create: `textbook/lib/curriculum.mjs`, `textbook/lib/glossary.mjs`, `textbook/lib/assemble.mjs`, `textbook/build.mjs`, `textbook/src/template.html`, `textbook/src/app/main.js`(이 Task에서는 빈 진입점), `tests/fixtures/content/**`
- Test: `tests/unit/curriculum.test.mjs`, `tests/unit/glossary.test.mjs`, `tests/build/build.test.mjs`

**Interfaces:**
- Consumes: Task 2의 `renderMarkdown`, `validateDaySource`, `slugify`
- Produces:
  - `curriculum.json` 스키마:
    `{ version:1, title, writtenAt:"2026-11", validation:{ minDayChars:number }, projects:[{ id, order, track:'main'|'special', title, subtitle, folder, stack:string[], requires:string[], summary, outcome, days:[{ title, minutes, summary, keywords:string[] }] }], pages:[{ id, title, requires?:string[], file?:string, generated?:'glossary'|'troubleshooting' }] }`
  - `loadCurriculum(contentDir) → Promise<{ curriculum, errors: BuildError[] }>`: Day에 `id = `${pid}-d${NN}``, `num`, `file = <contentDir>/<pid>/day-NN.md`를 붙인다. 오류 코드: `E_CUR_SCHEMA`, `E_CUR_DUP_ID`, `E_CUR_REQUIRES`(없는 프로젝트를 참조하거나 순환), `E_CUR_FILE_MISSING`, `E_CUR_ORPHAN_FILE`(커리큘럼에 없는 `day-NN.md`)
  - `parseGlossary(files: {file, src}[]) → { entries: {term, slug, md, file}[], errors }`: `### 용어` 단위로 나눈다. 대소문자를 무시한 중복은 `E_TERM_DUPLICATE`
  - `parseTroubleshooting(files) → { groups: {project, entries:{title, md}[]}[], errors }`: 파일명 접두어(`p1`, `p2`, …)로 그룹을 나눈다.
  - `assemble({ templateHtml, css, js, data, templates: {id, html}[] }) → string`: 자리표시자 `<!--WZH:CSS-->`, `<!--WZH:DATA-->`, `<!--WZH:TEMPLATES-->`, `<!--WZH:JS-->`를 채운다. data JSON은 `</`→`<\/`, U+2028/2029 escape. 템플릿 id는 `t-day-<dayId>`, `t-page-<pageId>`
  - 임베드 data: `{ title, writtenAt, builtAt, projects:[{…메타, days:[{id,num,title,minutes,summary,checkCount}]}], pages:[{id,title,requires}], search:[{id, kind:'day'|'page', project:string|null, title, text}] }`(파일 경로 제외)
  - CLI: `node build.mjs [--check] [--only id1,id2] [--content <dir>] [--out <file>]`. 기본값은 content `./content`, out `../index.html`. 오류가 있으면 `파일:줄 CODE 메시지`를 출력하고 exit 1. 성공하면 Day 수와 결과 크기(MB)를 출력한다. `--check`는 파일을 쓰지 않는다. `--only`는 지정 Day만 렌더·검증한다(용어·route 집합은 전체 기준).
- 픽스처 `tests/fixtures/content/`: 프로젝트 `fa`(Day 2개, requires []) → `fb`(Day 1개, requires [`fa`]), 페이지 `start`(file), `secret`(file, requires [`fb`]), `glossary`(generated). `validation.minDayChars: 200`. fa Day 1에는 긴 코드 한 줄(300자 이상), 일반 문단의 `<b>굵게아님</b>`, `:::answer`, 체크리스트 3개, `[[픽스처용어]]`를 넣는다. fb Day 1에는 고유 단어 `비밀단어zz`를 넣는다.

- [ ] **Step 1: 실패하는 테스트를 쓴다.**
  - `curriculum.test.mjs`: `fixture loads with derived ids`(`fa-d01`, `fa-d02`, `fb-d01`), `requires cycle is an error`, `missing day file is an error`, `orphan day file is an error`, `underscore files are ignored`
  - `glossary.test.mjs`: `entries are split by h3 and slugged`, `duplicate term across files is an error`
  - `build.test.mjs`: ① `fixture builds to single file`: `--content tests/fixtures/content --out <tmp>/index.html` → exit 0, 파일이 있다. `<template id="t-day-fa-d01">`, `<script id="wzh-data" type="application/json">`이 있다. `<script src=`와 `<link rel="stylesheet" href=`가 없다. 크기 < 16MB ② `invalid content fails build`: 임시 복사본의 fa Day 1에서 `## ✅ 정답`을 삭제 → exit 1, stdout에 `E_SECTION_MISSING` ③ `check mode writes nothing`
- [ ] **Step 2: 실행해서 실패를 확인한다** — `cd textbook && npm test` → FAIL
- [ ] **Step 3: 구현한다.** `template.html`은 설계서 4장의 쉘 구조다: skip 링크, `header.topbar`(메뉴 버튼·브랜드·검색 입력·테마 토글·설정 링크), `nav#sidebar`, `main#main[tabindex=-1]`, `div#storage-banner[hidden]`, 자리표시자 4개. `<html lang="ko">`, viewport meta, `<title>웹 제로 투 헌드레드</title>`. JS는 esbuild `bundle:true, format:'iife', minify:true, target:'es2020', write:false`로 번들한다.
- [ ] **Step 4: 실행해서 통과를 확인한다** — `npm test` → PASS
- [ ] **Step 5: 커밋** — `feat(textbook): curriculum loader, glossary merge, single-file assembler`

