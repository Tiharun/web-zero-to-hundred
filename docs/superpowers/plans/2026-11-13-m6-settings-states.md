# M6 설정·상태 화면 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. 이 프로젝트는 Native(executing-plans)로 실행한다.

**Goal:** 설정 화면을 DESIGN.md 카드로 다시 입히고, `window.confirm`을 확인 Modal로 바꾸고, 진도 불러오기 실패에 Shake + 이유 문장을 붙이고, 상태 화면(404·잠김·준비 중·오류·저장 불가)을 같은 틀로 맞춘다.

**Architecture:** 확인 Modal은 `template.html`의 `<dialog id="confirm-dialog">` 하나를 `views/confirm.js`가 채워 쓰고, 열고 닫기는 M2·M5의 `views/overlay.js`(`setupDialog`·`openDialog`·`closeDialog`)를 그대로 쓴다. 화면은 `ctx.confirm(opts)`로만 부르고, 결과는 `Promise<boolean>`(확인만 `true`)이다. 상태 화면은 `views/common.js`의 404 틀(도트 아이콘 3배 + 제목 + lead + 주 버튼 하나 + 글자 링크)을 잠김·오류에도 쓴다.

**Tech Stack:** 바닐라 ESM, `<dialog>` `showModal`, `node:test`, 전역 Playwright 1.63.0(Chromium), pixelmatch 시각 테스트.

**Spec:** `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M6 행, 2장 결정 6, 6장 6·7, 7장 상태 표, 8장. 보조: `docs/superpowers/specs/2026-11-11-textbook-redesign-design.md` 5.2 Modal, 6.3 Shake, 9장.

## Global Constraints

- 색·글꼴·크기·간격·모서리·그림자·모션 값은 DESIGN.md 토큰(`var(--…)`)으로만 쓴다. 토큰 블록 밖에 색 값·`font-family`를 쓰지 않는다.
- DESIGN.md에 없는 부품(확인 Modal, 설정 카드, 상태 화면)은 아래 "DESIGN.md 추가안"을 이 계획서 승인으로 승인받은 것으로 보고 Task 1에서 그대로 넣는다. 그 밖의 새 값이 필요하면 멈추고 사용자 승인을 받는다.
- 위험(danger) 색은 미정(M8)이다. 초기화 버튼과 확인 Modal의 위험 버튼은 지금의 `.btn-danger`(legacy `--danger`)를 그대로 쓴다.
- 알림 상자 종류별 색도 미정(M8)이다. 결과 문장은 종류와 관계없이 DESIGN.md "알림 상자" 한 모양이다.
- 사이트 이름·주소는 `curriculum.json`의 `title`·`url`만 쓴다. 백업 식별자는 `progress.js`의 `BACKUP_APP` 하나만 쓴다.
- 파일 하나, 외부 요청 0건. 지어낸 수치 금지. 모델 식별자·개인정보 금지.
- Fluid Rule: 320px부터 가로 스크롤 0. 바뀌는 지점은 DESIGN.md 브레이크포인트(640px 등)만 쓴다.
- 모든 모션에 동작 줄이기 대체: Shake는 생략하고 이유 문장만 보인다. Modal은 바로 열리고 닫힌다.
- Shake 값은 DESIGN.md Motion(300ms, 좌우 4px, 네 번)이고 `motion.js`의 `shake(el)`만 쓴다. 반드시 이유 문장(`role="status"`)과 같이 쓴다.
- 확인용 Modal은 바깥 클릭·ESC로 닫혀도 "취소"다(아무것도 바뀌지 않는다). 처음 포커스는 취소 버튼이다(덜 위험한 쪽, [W3C APG Alert Dialog 예제](https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/alertdialog.html)).
- 기준선: `npm test`, `npm run check -- --allow-missing`, `npm run test:e2e`, `npm run test:visual`, `npm run check:site`가 모두 통과해야 완료다. 시각 기준 이미지는 사용자 승인 뒤에만 갱신한다.
- 커밋은 Task 경로만 고른다. push는 사용자가 요청할 때만 한다.

## Review Focus

1. 확인 Modal이 열린 채 브라우저 "뒤로"로 화면이 바뀌면 → Modal은 취소로 닫히고 진도는 그대로다. (Task 1 `back navigation while the confirm modal is open cancels it`)
2. 확인 Modal이 열린 채 Ctrl+K → 검색 Modal이 겹쳐 열리지 않는다. (Task 1 `ctrl+k does nothing while the confirm modal is open`)
3. 0바이트·빈 파일을 불러오면 → 오류 문장 + Shake, 진도 그대로. (Task 2 `an empty file shakes and explains without touching progress`)
4. 동작 줄이기에서 불러오기 실패 → Shake 없이 이유 문장만. (Task 2 `reduced motion: a failed import explains without shaking`)
5. 저장소를 쓸 수 없는 브라우저에서 불러오기 → 메모리 진도로 바뀌고, 설정의 저장 불가 알림과 맨 위 배너는 그대로다. (Task 2 `import works in memory when storage is blocked`)

## 범위 판정

- **잠김의 "Shake + 이유 문장"**: 잠긴 카드·행은 M2·M4에서 끝났다. M6은 깊은 링크의 잠금 화면 모양만 404 틀에 맞춘다(🔒 이모지 → 도트 `lock` 아이콘).
- **"다음 Day 미작성"**: 홈 퀘스트 카드의 준비 중 문구와 복습 버튼은 M3에서 끝났다. M6은 준비 중 Day 화면(빌드의 `PLACEHOLDER_HTML`)을 앱이 그리는 안내 칸으로 바꾸고 복습 링크를 붙인다. 준비 중 Day의 완료 버튼 동작은 바꾸지 않는다.
- **JS 꺼짐**: `template.html`의 `<noscript>`가 이미 있다. M6 범위가 아니다.
- **저장 불가 알림**: 맨 위 배너(`#storage-banner`)는 있다. M6은 설정 화면의 안내를 `notice()` 부품으로 바꾸고, 불러오기가 메모리에서 되는지 확인한다.
- **"다른 브라우저"**: e2e는 같은 Chromium의 새 컨텍스트(저장소가 완전히 따로)로 확인한다. Firefox·Safari·실기기는 확인하지 못함으로 보고한다.
- **내보내기 파일 이름**: 지금 `settings.js`가 `'web-zero-to-hundred'`를 따로 적는다. `BACKUP_APP`에서 만들도록 `backupFilename(date)`를 `progress.js`로 옮긴다(사이트 이름 `title`이 아니라 백업 식별자다).
- **기존 e2e**: `textbook.test.mjs`의 `window.confirm` 기반 테스트 3개(`corrupt backup keeps progress`, `reset clears progress after confirm`, `valid backup imports only after confirmation and reports skipped days`)는 Modal로 다시 써서 새 파일 `tests/e2e/settings.test.mjs`로 옮기고 원래 자리에서 지운다.

## DESIGN.md 추가안 (Task 1에서 그대로 넣는다)

Components > Navigation, "검색 Modal" 다음 줄:

- **확인 Modal:** 되돌릴 수 없는 일(진도 복원 덮어쓰기, 진도 초기화) 앞에서만 쓴다. `<dialog role="alertdialog">`를 `showModal()`로 연다. 가운데(`margin: auto`), 폭 `min(28rem, calc(100% - var(--space-xl)))`, 안쪽 `var(--space-lg)`(640px 이하 `var(--space-md)`), `card` 바탕, 1px `rule`, 모서리 12px, 그림자 없음, 백드롭 `scrim`. 제목 Title small(800, `--text-h3`), 설명 Body(`ink-2`). 버튼 줄은 오른쪽 정렬·`var(--space-sm)` 간격·줄바꿈 허용: "취소"(`btn`) | 확인(복원은 주 버튼, 초기화는 위험 버튼). 처음 포커스는 "취소". ESC·바깥 클릭·"취소"는 모두 취소이고 아무것도 바뀌지 않는다. 열림·닫힘 모션은 검색 Modal과 같다. 닫히면 연 버튼으로 포커스가 돌아간다. 열려 있는 동안 Ctrl+K는 듣지 않고, 화면이 바뀌면 취소로 바로 닫힌다.

Components > Cards, "알림 상자" 다음 줄:

- **설정 카드:** 기본 카드, 안쪽 `var(--space-lg)`(640px 이하 `var(--space-md)`), 카드 사이 `var(--space-lg)`. 제목 Title small, 설명 Body `ink-2`. 결과 문장(백업 불러오기)은 알림 상자 모양이고 종류별 색은 알림 상자 색이 정해질 때(M8) 입힌다.
- **상태 화면(404·잠김·오류):** 도트 아이콘 3배(404·오류 렌치, 잠김 자물쇠) → 제목 → lead → 주 버튼 하나 + 글자 링크. 셸(상단 바·사이드바)은 그대로 둔다.
- **준비 중 Day 칸:** 점선 2px `rule`, 턱 없음, 바탕 `paper`, 모서리 12px, 글자 `ink-2`. "이 Day는 아직 준비 중이에요." + 복습 글자 링크(앞 Day가 있을 때) 또는 "홈으로".

Accessibility > 키보드 줄 끝에 덧붙인다: "확인 Modal도 `showModal`로 포커스를 가두고 처음 포커스는 취소다."

---

### Task 1: 확인 Modal과 초기화

**Files:**
- Create: `textbook/src/app/views/confirm.js`
- Create: `tests/e2e/settings.test.mjs`
- Modify: `textbook/src/template.html` (검색 dialog 다음에 confirm dialog)
- Modify: `textbook/src/app/main.js` (`ctx.confirm`, 화면을 그릴 때 `dismiss()`)
- Modify: `textbook/src/app/views/shell.js:154` (Ctrl+K 무시 조건)
- Modify: `textbook/src/app/views/settings.js` (`onReset`)
- Modify: `textbook/src/styles/shell.css` (`.confirm`, 검색 Modal 규칙과 표면 공유)
- Modify: `DESIGN.md` (위 추가안 전부)
- Modify: `tests/e2e/textbook.test.mjs` (`reset clears progress after confirm` 삭제)

**Interfaces:**
- Consumes: `setupDialog(dlg)`, `openDialog(dlg, opener)`, `closeDialog(dlg, { restoreFocus, immediate })` (`views/overlay.js`)
- Produces:
  - `createConfirm(dlg) → { ask(opts, opener?): Promise<boolean>, dismiss(): void, isOpen(): boolean }` (`views/confirm.js`)
  - `opts = { title: string, body: string, ok: string, danger?: boolean }`
  - `ctx.confirm(opts, opener?) → Promise<boolean>` (main.js가 `createConfirm`을 감싼다)
  - 마크업: `dialog#confirm-dialog.confirm[role=alertdialog][aria-labelledby=confirm-title][aria-describedby=confirm-body][data-testid=confirm-modal]` 안에 `h2#confirm-title`, `p#confirm-body`, `.confirm-actions` > `button[data-testid=confirm-cancel][autofocus]`("취소") + `button[data-testid=confirm-ok]`
- 동작 규칙: 결과는 dialog의 `close` 이벤트에서 한 번만 정한다(확인 버튼을 눌렀을 때만 `true`). 확인 버튼 class는 `danger`면 `btn btn-danger`, 아니면 `btn-primary`. 이미 열려 있을 때 `ask`가 다시 오면 앞의 약속은 `false`로 끝낸다. `dismiss()`는 열려 있을 때만 `closeDialog(dlg, { immediate: true })`로 닫는다(결과 `false`). `main.js`의 화면 그리기 맨 앞에서 `dismiss()`를 부른다.

- [ ] **Step 1: 실패하는 e2e를 쓴다** — `tests/e2e/settings.test.mjs`. 머리(`before`·`after`·`eventually`·`withPage`)는 `tests/e2e/search.test.mjs`와 같은 틀로 픽스처 교재를 빌드해 127.0.0.1로 연다. `withPage(hash, fn, { init, reducedMotion, viewport, progress })`이고 `fn(page, { context, errors })`를 받는다(끝에서 `errors`가 비어 있어야 한다). `textbook.test.mjs`의 `completeDay`·`sidebarState`·`stat`와 같은 도우미를 이 파일에 둔다.

```js
test('reset asks in a modal; cancel, Escape and backdrop change nothing', TIMEOUT, async () => {
  await withPage('#/settings', async (page) => {
    const modal = page.getByTestId('confirm-modal');
    const reset = page.getByTestId('reset-button');
    for (const close of ['cancel', 'Escape', 'backdrop']) {
      await reset.click();
      await modal.waitFor();
      assert.equal(await modal.getAttribute('role'), 'alertdialog');
      assert.equal(await page.locator('#confirm-title').innerText(), '모든 진도를 지울까요?');
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.testid), 'confirm-cancel');
      if (close === 'cancel') await page.getByTestId('confirm-cancel').click();
      else if (close === 'Escape') await page.keyboard.press('Escape');
      else await page.mouse.click(5, 5);
      await modal.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => document.activeElement?.dataset.testid), 'reset-button', '연 버튼으로 돌아간다');
      assert.equal(await sidebarState(page, 'fa-d01'), 'done');
    }
  }, { progress: ['fa-d01'] });
});

test('reset confirms in the modal and goes home with no progress', TIMEOUT, async () => {
  // reset-button → confirm-ok(class에 btn-danger, 글자 '모두 지우기') → 주소 '#/', stat(days) '0 / 3', notice 에 '진도를 모두 지웠어요'
});

test('back navigation while the confirm modal is open cancels it', TIMEOUT, async () => {
  // '#/' → '#/settings' 로 이동 → reset-button → page.goBack() → '#/' 에서 #confirm-dialog 가 닫혀 있고 sidebarState('fa-d01') === 'done'
});

test('ctrl+k does nothing while the confirm modal is open', TIMEOUT, async () => {
  // reset-button → Control+k → #search-dialog[open] 개수 0, confirm-modal 은 열린 채
});

test('reduced motion: the confirm modal opens and closes at once', TIMEOUT, async () => {
  // reducedMotion 'reduce' → reset-button → confirm-cancel 클릭 직후(기다리지 않고) #confirm-dialog.open === false
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs`
Expected: 5개 FAIL(`confirm-modal`을 찾지 못함, 또는 `window.confirm`이 떠서 시간 초과).

- [ ] **Step 3: 구현한다** — 위 Interfaces 대로 `confirm.js`, template, `ctx.confirm`, `dismiss()` 호출, Ctrl+K 조건(`#confirm-dialog`가 열려 있으면 return), CSS를 넣는다. `.confirm`은 `.search`와 표면 규칙(1px `rule`, `--radius-card`, `card` 바탕, `scrim` 백드롭, pop-in·fade 애니메이션, `is-closing`)을 선택자 묶음으로 같이 쓰고, 위치·폭·안쪽만 따로 둔다. `:root:has(.confirm[open]) { overflow: hidden; }`. `onReset`은:

```js
async function onReset(event) {
  const ok = await ctx.confirm({ title: '모든 진도를 지울까요?', body: '완료한 Day와 체크리스트 기록이 모두 사라지고 되돌릴 수 없어요. 먼저 백업 파일을 내보내 두면 안전해요.', ok: '모두 지우기', danger: true }, event.currentTarget);
  if (!ok) return;
  // 이하 지금과 같다: commit(empty + theme) → setNotice → go('#/')
}
```

DESIGN.md에 추가안 네 곳을 넣는다. `textbook.test.mjs`의 `reset clears progress after confirm`을 지운다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs && npm test`
Expected: settings 5/5 PASS, 단위 278/278 PASS.

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/confirm.js textbook/src/template.html textbook/src/app/main.js textbook/src/app/views/shell.js textbook/src/app/views/settings.js textbook/src/styles/shell.css DESIGN.md tests/e2e/settings.test.mjs tests/e2e/textbook.test.mjs
git commit -m "feat(settings): confirm modal replaces window.confirm for reset"
```

### Task 2: 백업 불러오기 — Modal, Shake, 왕복

**Files:**
- Modify: `textbook/src/app/progress.js` (`backupFilename`)
- Modify: `textbook/src/app/views/settings.js` (`onImport`, 내보내기 파일 이름)
- Modify: `tests/unit/progress.test.mjs`
- Modify: `tests/e2e/settings.test.mjs`
- Modify: `tests/e2e/textbook.test.mjs` (`corrupt backup keeps progress`, `valid backup imports only after confirmation and reports skipped days` 삭제)

**Interfaces:**
- Consumes: `ctx.confirm(opts, opener)` (Task 1), `shake(el)` (`motion.js`), `importBackup(text, cur)`, `exportBackup(prog, nowIso)`
- Produces: `backupFilename(date: Date) → string` = `` `${BACKUP_APP}-progress-${YYYY-MM-DD}.json` ``(그 기기의 날짜)

- [ ] **Step 1: 실패하는 테스트를 쓴다**

단위(`tests/unit/progress.test.mjs`):

```js
test('backupFilename uses the backup app id and the local date', () => {
  assert.equal(backupFilename(new Date(2026, 0, 5, 23, 30)), 'web-zero-to-hundred-progress-2026-01-05.json');
});
```

e2e(`tests/e2e/settings.test.mjs`). 애니메이션 기록은 init 스크립트로 `Element.prototype.animate`를 감싸 `window.__anims`에 `{ id: options?.id, testid: this.dataset?.testid, cls: this.className }`를 쌓아 센다(300ms 안에 끝나는 Shake를 놓치지 않는다).

```js
test('a backup round-trips into a fresh browser with the same home', TIMEOUT, async () => {
  // 컨텍스트 A: fa-d01·fa-d02 완료 → '#/settings' → export-button 다운로드(이름 /^web-zero-to-hundred-progress-\d{4}-\d{2}-\d{2}\.json$/)
  // 컨텍스트 A 홈: stat(days), stat(xp), continue-button href 기록
  // 새 컨텍스트 B(빈 저장소): '#/settings' → import-input 에 그 파일 → confirm-modal 제목 '지금 진도를 백업 파일의 진도로 바꿀까요?' → confirm-ok(class btn-primary, 글자 '백업으로 바꾸기')
  // import-message 에 '완료한 Day 2개' → B 홈의 세 값이 A 와 같다 → B 새로고침 뒤에도 같다
});

test('cancelling the import modal keeps progress and says so', TIMEOUT, async () => {
  // fa-d01 완료 상태, fa-d02 도 끝낸 백업 → confirm-cancel → import-message '가져오기를 취소했어요. 지금 진도는 그대로예요.', sidebarState('fa-d02') === 'today'
  // 포커스는 진도 불러오기 칸(import-input)으로 돌아온다
});

test('unknown days are skipped after confirming and counted', TIMEOUT, async () => {
  // 백업에 'zz-d99' 추가 → confirm-body 에 '건너뛰어요' → confirm-ok → import-message 에 '이 교재에 없는 Day 1개는 건너뛰었어요.'
});

test('a broken or foreign file shakes the import button and explains without touching progress', TIMEOUT, async () => {
  // fa-d01 완료. '{"app":"other"}' → confirm-modal 은 열리지 않는다, import-message[data-kind=error] 에 importBackup 의 '다른 교재' 오류 문장,
  // __anims 에 { id: 'shake' } 가 .file-btn 에서 1개, sidebarState('fa-d01') === 'done'
  // 'not json' 도 같은 방식(오류 문장만 다르다)
});

test('an empty file shakes and explains without touching progress', TIMEOUT, async () => {
  // 0바이트 'empty.json' → import-message[data-kind=error] 비어 있지 않음, shake 1개, 진도 그대로
});

test('reduced motion: a failed import explains without shaking', TIMEOUT, async () => {
  // reducedMotion 'reduce', '{"app":"other"}' → 오류 문장은 보이고 __anims 에 shake 0개
});

test('import works in memory when storage is blocked', TIMEOUT, async () => {
  // init: localStorage getter 가 SecurityError (textbook.test 'storage unavailable banner' 와 같은 방식)
  // '#/settings' → .settings .notice 에 '저장할 수 없어요', 유효한 백업 → confirm-ok → sidebarState('fa-d02') === 'done', storage-banner 는 보인 채
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && npm test -- --test-name-pattern=backupFilename && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs`
Expected: 단위 FAIL(`backupFilename` 없음), e2e 새 7개 FAIL(Task 1의 5개는 PASS). `import works in memory…`는 `.settings .notice`가 없어 FAIL.

- [ ] **Step 3: 구현한다**
  - `progress.js`에 `backupFilename`을 export하고 `settings.js`의 `localDate`·직접 쓴 이름을 지운다.
  - `onImport`: 읽기 실패·`!result.ok`면 `showMessage(문장, 'error')` 뒤 `shake(input.closest('.file-btn'))`. 성공이면 `ctx.confirm({ title: '지금 진도를 백업 파일의 진도로 바꿀까요?', body, ok: '백업으로 바꾸기' }, input)`. `body` = `` `백업 파일에는 완료한 Day가 ${days}개 있어요. 지금 진도는 사라지고 되돌릴 수 없어요.` `` + (`dropped > 0`이면 `` ` 이 교재에 없는 Day ${dropped}개는 건너뛰어요.` ``). 취소·성공 문장과 `ctx.announce`, 테마 유지는 지금과 같다.
  - 저장 불가 안내 문장(`warn-text`)을 `notice(같은 문장)`로 바꾼다(`views/common.js`의 `notice`).
  - `textbook.test.mjs`에서 위 두 테스트를 지운다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs`
Expected: 단위 279/279 PASS, settings e2e 12/12 PASS.

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/progress.js textbook/src/app/views/settings.js tests/unit/progress.test.mjs tests/e2e/settings.test.mjs tests/e2e/textbook.test.mjs
git commit -m "feat(settings): import confirm modal, shake on a bad backup, round-trip test"
```

### Task 3: 설정 화면 새 모양

**Files:**
- Modify: `textbook/src/app/views/settings.js` (섹션 → `card()`, class 정리)
- Modify: `textbook/src/styles/pages.css:10-80` (`.settings`, `.panel`, `.message`, `.warn-text` → 설정 카드 규칙)
- Modify: `tests/e2e/settings.test.mjs`

**Interfaces:**
- Consumes: `card(props, ...children)`, `notice()` (`views/common.js`)
- Produces: `div.settings` > `h1` "설정" + `section.card.settings-card` 4개(`aria-labelledby`로 각 h2와 잇는다). 기존 `data-testid`(`export-button`, `import-input`, `import-message`, `reset-button`)와 테마 라디오(`input[name=theme]`)는 그대로.

- [ ] **Step 1: 실패하는 e2e를 쓴다**

```js
test('settings cards follow DESIGN.md: basic card, title small, notice-style message', TIMEOUT, async () => {
  // .settings-card 4개, 각 getComputedStyle: borderTopWidth '2px', borderTopLeftRadius '12px', boxShadow 에 '4px'
  // h2 fontSize === 토큰 --text-h3 값(20px), fontWeight '800'
  // 실패 문장을 띄운 뒤 import-message: borderTopWidth '1px', borderTopLeftRadius '12px', borderLeftWidth '1px'(옛 6px 띠가 없다)
});

test('settings has no sideways scroll from 320px up', TIMEOUT, async () => {
  // 320·375·768·1280 폭마다 '#/settings' 에서 documentElement.scrollWidth <= clientWidth, 확인 Modal 을 연 상태도 같다
});
```

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" node --test --test-name-pattern="settings cards|sideways" ../tests/e2e/settings.test.mjs`
Expected: `settings cards…` FAIL(`.settings-card` 0개). `sideways` 는 PASS일 수 있다(지키는 선 고정용).

- [ ] **Step 3: 구현한다** — DESIGN.md "설정 카드" 값대로. `.panel`·`.message`의 legacy 별칭(`--surface`, `--border`, `--radius`, `--surface-2`, `--warn-*`, `--success-*`)을 이 화면에서 쓰지 않는다. `.message`는 알림 상자 값(1px `ink-2`, `--radius-card`, `--text-ui`, 줄간격 1.5, 안쪽 `var(--space-sm) var(--space-md)`)이고 `:empty`면 숨긴다. 640px 이하 안쪽은 `var(--space-md)`. 다른 화면이 `.panel`을 쓰는지 `grep -rn "panel" textbook/src/app`로 보고, 안 쓰면 `.panel` 규칙을 지운다.

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs`
Expected: 단위 279/279, settings e2e 14/14 PASS. (`npm run test:visual`의 settings 6장은 Task 5에서 승인 뒤 갱신하므로 지금은 다르게 나온다.)

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/settings.js textbook/src/styles/pages.css tests/e2e/settings.test.mjs
git commit -m "feat(settings): DESIGN.md cards and notice-style result message"
```

### Task 4: 상태 화면 — 오류, 잠김, 준비 중

**Files:**
- Modify: `textbook/src/app/views/common.js` (`errorScreen`, `lockScreen` 아이콘)
- Modify: `textbook/src/app/main.js:126-130` (오류 화면)
- Modify: `textbook/src/app/views/day.js` (준비 중 칸)
- Modify: `textbook/src/styles/components.css:284-366` (`.lock-icon` 삭제), `textbook/src/styles/day.css:552` (`.coming-soon` 토큰)
- Modify: `tests/e2e/settings.test.mjs`, `tests/e2e/textbook.test.mjs` (단위 테스트는 DOM이 없어 화면 부품은 e2e로 본다)

**Interfaces:**
- Produces:
  - `errorScreen({ homeHref = '#/' } = {}) → HTMLElement`: `section.notfound[data-testid=error-screen][aria-labelledby=error-title]` > `px('wrench', { cls: 'notfound-icon', scale: 3 })`, `h1#error-title` '화면을 그리다 문제가 생겼어요', `p.lead` '새로고침하면 대부분 해결돼요. 계속되면 설정에서 진도를 백업해 두세요.', `.lock-actions` > `primaryButton(homeHref, '홈으로 가기')` + `textLink('#/settings', '설정 · 진도 백업')`
  - `main.js`는 예외 때 `errorScreen({ homeHref: siteBase || '#/' })`를 붙인다(셸은 그대로).
  - `lockScreen`: `p.lock-icon` 이모지 대신 `px('lock', { cls: 'notfound-icon', scale: 3 })`. 글자·버튼은 그대로.
  - 준비 중 Day(`day.ready === false`): 템플릿 본문 대신 `section.coming-soon[data-testid=coming-soon]` > `p` '이 Day는 아직 준비 중이에요.' + `p` '내용은 지금 쓰는 중이에요. 그동안 지난 Day를 복습해 두면 좋아요.' + 앞 Day가 있으면 `textLink('#/day/<앞 id>', 'Day n 복습하기')`, 없으면 `textLink('#/', '홈으로')`. 머리·완료 줄은 그대로.

- [ ] **Step 1: 실패하는 테스트를 쓴다**

e2e(`tests/e2e/settings.test.mjs`):

```js
test('a view that throws shows the error screen with a way home and keeps the shell', TIMEOUT, async () => {
  // init: HTMLTemplateElement.prototype.content getter 를 감싸 id 가 't-day-' 로 시작하면 throw new Error('boom') (아이콘 템플릿은 그대로)
  // '#/day/fa-d01' → error-screen, h1 문구, .notfound-icon 1개, .btn-primary 1개(href '#/'), .text-link href '#/settings', #sidebar 보임
  // 홈 버튼 → 퀘스트 카드가 보인다. errors 에 'boom' 1건을 확인한 뒤 비운다
});
```

e2e(`tests/e2e/textbook.test.mjs`):
- `locked deep link shows lock screen`에 덧붙인다: `lock-screen` 안 `.notfound-icon` 1개, `innerText`에 '🔒' 없음.
- `special days count toward the level panel and placeholder days are styled`에 덧붙인다: `fs-d02`에서 `getByTestId('coming-soon')`에 '준비 중', 링크 'Day 1 복습하기' href `#/day/fs-d01`, 칸 배경이 `--color-paper` 계산값과 같다.

- [ ] **Step 2: 실패를 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" node --test --test-name-pattern="throws|locked deep link|placeholder" ../tests/e2e/settings.test.mjs ../tests/e2e/textbook.test.mjs`
Expected: 3개 FAIL(`error-screen` 없음, `.notfound-icon` 0개, `coming-soon` testid 없음).

- [ ] **Step 3: 구현한다** — Interfaces 대로. `.coming-soon`은 DESIGN.md "준비 중 Day 칸" 값(2px dashed `--color-rule`, `--radius-card`, `--color-paper`, `--color-ink-2`, 안쪽 `var(--space-lg)`)으로 바꾼다. 빌드의 `PLACEHOLDER_HTML`은 그대로 둔다(검색 색인·빌드 검사용).

- [ ] **Step 4: 통과를 확인한다**

Run: `cd textbook && npm test && NODE_PATH="$(npm root -g)" node --test ../tests/e2e/settings.test.mjs ../tests/e2e/textbook.test.mjs ../tests/e2e/layout.test.mjs`
Expected: 단위 279/279, 세 파일 모두 PASS(404 테스트 포함).

- [ ] **Step 5: 커밋**

```bash
git add textbook/src/app/views/common.js textbook/src/app/main.js textbook/src/app/views/day.js textbook/src/styles/components.css textbook/src/styles/day.css tests/e2e/settings.test.mjs tests/e2e/textbook.test.mjs
git commit -m "feat(states): error screen with a way home, dot lock icon, coming-soon day with review link"
```

### Task 5: 시각 기준 이미지, 전체 기준선, 문서

**Files:**
- Modify: `tests/visual/visual.test.mjs` (`SCENES`)
- Modify: `tests/visual/baseline/` (승인 뒤)
- Modify: `docs/CHECKPOINT.md`, `docs/checkpoint/workspace/progress.md`, `docs/superpowers/specs/2026-11-12-unified-roadmap-design.md` 11장 M8 행

- [ ] **Step 1: 장면을 더한다**

```js
{ id: 'confirm', hash: '#/settings', progress: null, open: '[data-testid="reset-button"]', waitFor: '#confirm-dialog[open]' },
{ id: 'locked', hash: `#/day/${LOCKED_DAY}`, progress: null, widths: [375, 1280] },
```

`LOCKED_DAY`는 `curriculum.json`을 `order`로 정렬한 두 번째 프로젝트의 첫 Day id다(파일 위 `ALL_DONE`과 같은 방식으로 만든다).

- [ ] **Step 2: 새 이미지를 만들어 보여 주고 멈춘다 — 사용자 승인**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: settings 6장 차이로 FAIL, confirm 6장·locked 4장은 기준 없음. 차이 이미지와 새 이미지 16장(settings·confirm 3폭 × 2테마, locked 2폭 × 2테마)을 사용자에게 보이고 승인을 기다린다.

- [ ] **Step 3: 승인 뒤 기준 이미지를 갱신하고 확인한다**

Run: `cd textbook && NODE_PATH="$(npm root -g)" npm run test:visual:update && NODE_PATH="$(npm root -g)" npm run test:visual`
Expected: 64/64 PASS(장면 이미지 62장 + 비교 단위 2개).

- [ ] **Step 4: 전체 기준선과 전 페이지 점검**

Run: `cd textbook && npm test && npm run check -- --allow-missing && NODE_PATH="$(npm root -g)" npm run test:e2e && npm run build:site`, 그다음 `_site`를 별도 프로세스 정적 서버로 띄워 `NODE_PATH="$(npm root -g)" npm run check:site -- http://127.0.0.1:<port>/`
Expected: 단위 279/279, "검사 통과: Day 155개, 페이지 4개", e2e 실패 0, check:site 4폭 각 168개 문제 0.

- [ ] **Step 5: 문서와 커밋**
  - `CHECKPOINT.md`: "M6 완료, 다음은 M7".
  - `progress.md`: M6 한 줄(커밋 범위, 테스트 수).
  - 로드맵 M8 행 끝: `(M6에서 넘김: 설정 결과 문장(import-message)과 알림 상자의 종류별 색은 알림 상자 색이 정해지면 입힌다. 초기화 버튼과 확인 Modal의 위험 버튼은 지금 legacy --danger 다)`.

```bash
git add tests/visual/visual.test.mjs tests/visual/baseline docs/CHECKPOINT.md docs/checkpoint/workspace/progress.md docs/superpowers/specs/2026-11-12-unified-roadmap-design.md
git commit -m "test(visual): settings, confirm and locked scenes; docs: M6 complete"
```

- [ ] **Step 6: 배포본 왕복(사용자가 push를 요청했을 때만)** — push 후 Pages 배포가 끝나면 scratchpad의 일회용 Playwright 스크립트로 공개 주소(`curriculum.json`의 `url`)에서 Task 2 왕복 시나리오를 돌려 결과를 보고한다(로드맵 2장 결정 6 "배포본에서 왕복을 확인").
