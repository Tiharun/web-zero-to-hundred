# Dispatch templates (controller → subagent)

These are the exact prompt shapes the controller used in the 2026-11-05/06 sessions. Fill in every `{…}` placeholder. `{WS}` is the absolute path of the plan workspace: `<repo>/.superpowers/sdd/2026-11-01-web-zero-to-hundred`. `{REPO}` is the absolute repo root. `{SCRATCH}` is a scratch folder outside the repo, for example `{REPO}/../wzh-scratch`.

Rules the controller follows around every dispatch:
- Always set `model` explicitly.
  - opus: design/judgment work (outlines, reference code, integration reviews, final review).
  - sonnet: Day batches, batch reviews, mid-size re-reviews.
  - haiku: tiny re-reviews.
- Run at most 5 agents at once (R57). Parallel agents are NO GIT. The controller commits each task's paths itself.
- Record BASE (`git rev-parse --short HEAD`) before dispatching. The review diff is `git diff BASE HEAD -- <task paths>`.
- After every fix round there is a scoped re-review. Only after it passes, append `Task N: complete (commits A..B, review clean)` to `{WS}/progress.md` and copy the ledger to `docs/checkpoint/workspace/`.
- Every Minor that affects teaching or "getting stuck" is promoted into the fix round. A ledger `Ruling:` line records each promotion.

---

## A. Day-batch implementer (T16–T18 P2, T22–T26 P3, T30–T33 SP)

```
You are the implementer for Task {N} of a project that builds a single-HTML Korean textbook for a 0%-knowledge beginner on Windows 11 (1–2 h/day). Your batch writes the {PROJECT_DESC} Day files for **Days {A}–{B}**, batch name **`{BATCH}`**, Day ids {pid}-d{AA} … {pid}-d{BB}. The learner has finished {PRIOR}. Other writers write other Day ranges in parallel; you will not see their output, so the outline's "시작 상태" and "이미 배운 것" for Day {A} are your contract. Repo: {REPO}.

Read in this order:
1. Contract (binding — NO GIT, environment, report format): {WS}/implementer-contract.md
2. Brief — read this first, it is your requirements: {WS}/task-{REP}-brief.md (it covers several Tasks; you are Task {N}: Days {A}–{B}, `{BATCH}`). It says "steps as Task 9", so also read {WS}/task-9-brief.md; the project-specific verification method in task-{REP}-brief.md replaces Task 9's browser step where they differ.
3. Batch rules (binding): {WS}/content-batch-rules.md. Also apply these review lessons:
   (a) Every "아래 🧯 …" reference in a step must point to an item in that same Day's 🧯 section (or name the 모음 entry by its title).
   (b) Each Day's 🧯 has 3–6 items (CONTENT-GUIDE); extras go in your troubleshooting 모음 file only, and every 🧯 item also appears in the 모음.
   (c) End each Day with the learner's editor folder, terminal location, running servers and Git state equal to the next Day's 시작 상태; if an assignment opens another folder or changes files after the commit, require "과제 후 커밋" or say how to get back.
   (d) Keep learner-visible text equal to what later Days and the reference use; never invent page-text edits later Days won't carry.
   (e) Don't assume optional tools are installed (Chrome and OBS are optional in P1; Edge is the default browser).
   (f) Every method/syntax used must be taught before or on that Day (check the P1/P2 outlines' Day maps); if not, introduce it in one sentence at first use.
   (g) Do not edit shared docs (external-facts.md, CONTENT-GUIDE.md, outlines, glossaries); put newly verified facts with source+date in docs/verification/{BATCH}.md.
4. docs/CONTENT-GUIDE.md (all), textbook/content/p1/day-01.md (style/depth exemplar), textbook/content/{pid}/_outline.md (header sections up to the first Day block + Day {A-1}–{B+1} blocks only), the Day-map sections of earlier projects' outlines, reference/{REF}/ (README + files your Days touch), textbook/content/glossary/*.md, docs/research/external-facts.md.
5. Facts from earlier reviews: {WS}/task-{OUTLINE_TASK}-notes.md

Scratch folder: {SCRATCH}/t{N}
Report file: {WS}/task-{N}-report.md

Reply with ONLY (under 15 lines): Status (DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT), commits (none — NO GIT), one-line check + verification summary, outline problems found (count + one line), report path.
```

Fill-ins per project:
| Project | REP brief | OUTLINE_TASK notes | REF | Verification note |
|---|---|---|---|---|
| P2 (T16–T18) | 15 | 14 | p2-streamer-hub | TS: scratch `tsc --noEmit` + run; C#: scratch `dotnet new` + build/run/test; server steps via curl of the .http requests |
| P3 (T22–T26) | 22 | 21 | p3-viewer-arena | see task-22-brief.md (cargo build/test, wasm-bindgen, Playwright for canvas pages; Docker steps "미실행" if no Docker) |
| SP (T30–T33) | 30 | 29 | sp-image-donation | see task-30-brief.md (dotnet test, client tsc/test/build, test-mode flow; 치지직 real server = 미검증) |

## B. Day-batch reviewer (spec + quality)

```
You are reviewing one task's output: first whether it matches its requirements, then whether it is well-built. This is a task-scoped gate.

Project: a single-HTML Korean textbook for a 0%-knowledge beginner on Windows 11 (1–2 h/day). The user's top requirement: the learner can follow alone without getting stuck ("중간에 막히지 않고 잘 따라갈 수 있는 것"). Task {N} = {PROJECT} Day files for Days {A}–{B} ({TOPICS}). Repo: {REPO}.

## What Was Requested
- Brief: {WS}/task-{REP}-brief.md (+ {WS}/task-9-brief.md for the steps)
- Batch rules (binding): {WS}/content-batch-rules.md, plus lessons (a)–(g) from dispatch-templates.md §A
- Binding per-Day contract: textbook/content/{pid}/_outline.md (header + Day {A-1}–{B+1} blocks)
- Facts from earlier reviews: {WS}/task-{OUTLINE_TASK}-notes.md
- Content rules + checklist: docs/CONTENT-GUIDE.md (anti-block rules (a)–(g), "## 7. 리뷰 체크리스트", 🧯 3–6)
- Exemplar textbook/content/p1/day-01.md; answer key reference/{REF}/; facts docs/research/external-facts.md; global constraints {WS}/global-constraints.md

## What the Implementer Claims
Report: {WS}/task-{N}-report.md (unverified claims). Judge each declared outline problem. Check the seam with the neighbouring batch: Day {A}'s start state vs the committed day-{A-1}.md end state (if it exists).

## Under Review
Files at the current HEAD: textbook/content/{pid}/day-{AA}.md … day-{BB}.md, textbook/content/troubleshooting/{BATCH}.md, docs/verification/{BATCH}.md. Read them directly. Read-only: do not mutate the working tree, index, HEAD or branch.

## You Do Not Dispatch Subagents

## Check, per Day
1. Outline conformance (title, minutes, 목표, start/end state, files, 과제 → 정답 요지, owned glossary terms introduced in prose, pitfalls cover the outline's candidates, end state = next Day's start).
2. No forward use (against the previous projects' outlines and earlier Days); back-links point at the right Day.
3. Anti-block: exact click/keystroke + expected screen, full Windows paths, recovery paths, 🧯 references resolve within the Day, 🧯 count 3–6.
4. Code correctness; partial blocks placed unambiguously; reference parity where the outline says so.
5. Facts: version-sensitive claims carry "작성 기준일 2026-11" + `--version`; no invented UI/CLI options; unverifiable items marked.
6. Format: h2 order, :::blocks, fence languages, [[용어]] exact case, no placeholders.
Don't re-run test suites; run a focused command only for a specific doubt.

## Output
Begin directly with the spec-compliance verdict (✅ or ❌ with Missing/Extra/Misunderstood). Then issues by severity (Critical / Important / Minor) with file:line. Important = a learner would get stuck, be misled, or meet something untaught, or the Day contradicts the outline. Then "Task quality: Approved | Needs fixes". No preamble, no closing summary.
```

## C. Fix-round message (to the original implementer; a fresh agent if the original is gone)

```
Fix round {R} for Task {N}. Your files are committed as {FIX_BASE}. The review found the items below. Fix ALL of them (Minors promoted, ruling {RID}). NO GIT; touch only your batch files; do not edit shared docs.

IMPORTANT
1. … (copy each finding verbatim with file:line and the suggested fix)
MINOR (promoted)
n. …

Re-run `cd textbook && npm run check -- --only {comma-separated Day ids}` (0 errors) and your verification for the changed Days; update docs/verification/{BATCH}.md; append "## Fix round {R}" to {WS}/task-{N}-report.md with a per-finding change list (file:line) and command output; reply with the short contract.
```

If the original agent no longer exists (new session), start a fresh implementer with template A, adding: "A prior implementer wrote these files and the review findings below; you own them now. Read the report file for what was tried, then apply the findings." Rounds 4–5 always use a fresh agent on a more capable model.

## D. Scoped re-review

```
You are re-reviewing one task's fix round. Verdict each finding and inspect the fix diff — nothing else. Read-only: do not mutate the working tree, index, HEAD or branch. Do not dispatch subagents.

Context: {one paragraph: what the files are, the top requirement, the contract}.

## Findings Under Verification (line numbers refer to the PREVIOUS version, {FIX_BASE})
1. … (verbatim)

## The Fix
Implementer report ("## Fix round {R}" at the end): {WS}/task-{N}-report.md
Fix base: {FIX_BASE}. Head: {HEAD}. Diff file: {WS}/review-t{N}-fix{R}.diff (create it with `git diff -U4 {FIX_BASE} {HEAD} -- <paths> > that file`). Read it once; read current files for context.

## Scope
Verdict every finding. Check the fix diff for new breakage: 🧯 count outside 3–6, "아래 🧯" refs that no longer resolve, end state ≠ next Day's start, minutes changed, format violations. Issues outside the diff → Out-of-Scope Observations. Don't re-run suites.

## Output (begin directly)
### Finding Verdicts
### New Breakage in the Fix Diff
### Out-of-Scope Observations
### Verdict
**Fix round:** All findings addressed, no new Critical/Important breakage | Findings remain open — list them.
```

## E. Integration review (T12 / T19 / T27 / T34): two reviewers in parallel, opus

E1. Beginner simulation:
```
You are reviewer ① for Task {N}, the {PROJECT} integration review gate — the **beginner simulation**.

Project: a single-HTML Korean textbook for a 0%-knowledge learner on Windows 11 (1–2 h/day). The user's top requirement: "중간에 막히지 않고 잘 따라갈 수 있는 것". {PROJECT} has {K} Days ({ONE-LINE SUMMARY}). Every Day already passed its own batch review; your job is to find what per-batch reviews miss — problems a real beginner hits across the whole sequence.

Repo: {REPO}. Read-only: do not modify any file, the index, HEAD or branch. Do not dispatch subagents.

Read {for P1: textbook/content/pages/start.md and help.md first, then} textbook/content/{pid}/day-01.md → day-{K}.md IN ORDER, as the learner would. Use textbook/content/troubleshooting/*.md, textbook/content/glossary/*.md, textbook/content/{pid}/_outline.md and docs/CONTENT-GUIDE.md as references. You may open the built book {REPO}/index.html with Playwright.

Simulate: a Windows 11 user who has never opened a terminal or code editor (for P2+: who finished the earlier projects). For every step ask: do I know exactly what to click/type, what I should see, and what to do if it differs? Track state across Days (open folder, files and content, Git state, what is installed, which servers/tabs are running). Flag every place where yesterday's real end state differs from what today assumes, any concept used before it is explained, unexplained terms, instructions depending on unseen screens, Days whose real effort clearly exceeds their stated minutes, difficulty jumps, and missing recovery at known frustration points (installs, first push, first error, deployment). Ignore style nits.

Output — begin directly with a table: `Day | 단계/위치 (file:line) | 이유 | 수정안 | 심각도 (Critical / Important / Minor)`, sorted by Day. Then "Cross-Day state issues" and "Top 5 to fix first". No preamble.
```

E2. Technical accuracy:
```
You are reviewer ② for Task {N}, the {PROJECT} integration review gate — **technical accuracy**.

Repo: {REPO}. Read-only; do not dispatch subagents. Review textbook/content/{pid}/day-*.md against: reference/{REF}/ (the answer key), docs/research/external-facts.md, docs/verification/*.md (the writers' verification logs), and official documentation ({DOCS: P1 MDN; P2 Microsoft Learn; P3 The Rust Book, Axum, Tokio; SP 치지직 docs, Microsoft Learn, React}). Also review tests/e2e/smoke.test.mjs if this is T12.

Check:
- every code block is valid and matches the reference where the outline says parity;
- every API, CLI flag, option, menu name and version claim exists and is current (as of 2026-11), or is marked as unverified;
- explanations are technically correct (no wrong mental models);
- security advice is sound;
- verification logs actually support the claims;
- the textbook behaves offline as a single file.

Output — begin directly: issues by severity (Critical / Important / Minor) with file:line, each with the correct statement and a source. Then "Verified OK" (short list). No preamble.
```

After both: send every finding to ONE fix implementer (sonnet; it may touch any Day file of that project, plus glossary/troubleshooting if needed), then run one scoped re-review. Then:
- `npm run check`, `npm run build`, `npm test`, `npm run test:e2e`;
- commit;
- for T12, rebuild the preview index.html (only reviewed Day files, R55) and send it to the user.
