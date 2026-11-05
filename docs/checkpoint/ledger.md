# SDD ledger — plan: docs/superpowers/plans/2026-11-01-web-zero-to-hundred.md

Spec: docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md (read; binding authority)
Start commit (merge base for final review): 105a5eb^ = root; plan commit = see git log
Branch: claude/gifted-goldberg-u1f9c6 (harness-mandated feature branch, not main)

## Setup rulings
- Ruling: work directly on the harness-mandated feature branch instead of creating a worktree — branch is already isolated from main and pushes must go to it — cost if wrong: none (no main branch exists).
- Ruling: parallel implementers ARE allowed (plan's parallel groups, user-approved) but only when file sets are disjoint; parallel implementers never run git add/commit/push; controller commits each task's paths as ONE commit right after the report, so BASE=commit^ HEAD=commit gives an exact review package; fix rounds are committed by path and re-review packages are generated with path filters when other commits interleave — cost if wrong: occasional manual diff packaging.
- Ruling: "most capable model" = opus (session model, well-understood); judgment/design tasks (T6, outlines, references P2/P3/SP, final review) use opus; engine, P1 reference, content batches, task reviews use sonnet — cost if wrong: some quality/cost mismatch, fixable in review loop.

## Pre-flight scan
| Pair / Task | Produces → Consumes | Finding |
|---|---|---|
| T2→T3 | renderMarkdown/validateDaySource/slugify | consistent |
| T2 self | heading id `p1-d01-따라하기` vs slugify("🛠️ 따라하기") = "-따라하기" | Ruling R1 |
| T2 self | npm test glob `tests/build/**` absent until T3 | Ruling R2 |
| T3→T4 | embedded data (days[].checkCount) | consistent |
| T3 self | Global minutes 60..120 not in loader checks | Ruling R3 |
| T3→T6/T8/T14… | full build fails while later Day files don't exist yet | Ruling R4 |
| T4→T5 | progress/search/router functions | consistent |
| T3↔T5 | template.html shell (T3) filled by views (T5); main.js empty (T3) → modified (T5) | consistent |
| T5↔T7 | tests/helpers/static-server.mjs + browser.mjs: plan says T5 creates, T7 (runs earlier, parallel) consumes | Ruling R5 |
| T6↔T8 | curriculum pages `start`,`help` listed in T6 but files created in T8 | Ruling R6 |
| T6↔T8 | glossary/p1.md created T6 (Day1 terms) then rewritten T8 | consistent (T8 owns full file) |
| T8→T9..11 | _outline.md, glossary/p1.md; batches write disjoint day/troubleshooting/verification files | consistent |
| T9..11 | task-brief only extracts "Task 9 / 10 / 11" heading for N=9 | Ruling R7 |
| T12 self | smoke test needs strict full build; P1 only in curriculum at that point | consistent |
| T1→T2 | build deps versions: T2 runs parallel with T1 | Ruling R8 |
| T1→T13/T20/T28 | research facts | consistent (refs start after T1) |
| T14/21/29, 15-18/22-26/30-33, 19/27/34 | "same as Task 8/9/12" references | Ruling R7 (send referenced brief too) |
| T35→T36 | pages + README/HANDOFF | consistent |
| T37 self | `node --test tests/reference/` directory arg | implementer may use glob; minor |
| Each task self (T1,T4,T5,T7,T13,T20,T28,T35,T36) | tests vs code/files | consistent |

## Rulings
- Ruling R1: slugify trims leading/trailing '-' and collapses repeats, so "🛠️ 따라하기" → "따라하기" and heading id = `p1-d01-따라하기` — matches the plan's test — cost if wrong: none.
- Ruling R2: T2's npm test script may reference tests/build; if Node errors on an unmatched glob, T2 runs only unit globs until T3 adds build tests — cost if wrong: trivial script edit.
- Ruling R3: loader reports E_CUR_SCHEMA when a day's minutes is outside 60..120 (Global Constraint) — cost if wrong: none.
- Ruling R4: build.mjs gets `--allow-missing` (missing day files → warning + "준비 중" placeholder template) for previews; `--only` mode ignores missing files of non-listed days; default/full mode stays strict (E_CUR_FILE_MISSING) — cost if wrong: one extra flag.
- Ruling R5: T7 creates tests/helpers/static-server.mjs and tests/helpers/browser.mjs with the plan's T5 signatures; T5 consumes/extends them; T5 dispatched only after T7 completes — cost if wrong: none.
- Ruling R6: T6's curriculum lists only pages whose files exist (glossary, troubleshooting generated); T8 adds `start` and `help` entries with their files — cost if wrong: none.
- Ruling R7: for tasks defined as "same as Task X", dispatch both the task's own brief and Task X's brief; for batch tasks 10/11 (and similar) use Task 9's brief plus explicit batch parameters in the dispatch — cost if wrong: none.
- Ruling R8: T2 pins marked/highlight.js/esbuild exact versions itself via `npm view <pkg> version`; T1 records the same versions in research item 14 — cost if wrong: none.

## Progress
- Parallel group G0 dispatched at BASE 885e2f7: T1 (sonnet, agent a618b8fc6159acbc8), T2 (sonnet, agent ab7f5271e4d70e656), T7 (sonnet, agent a3c96498ba0936f89). All NO GIT; controller commits by path.
- T2 implementer DONE_WITH_CONCERNS; controller committed 7250704 (+ root .gitignore). Review dispatched (sonnet, agent aa68ed2d05f7195d7).
- Ruling R9: E_PLACEHOLDER also scans code fences; content guide (T6) must tell authors to write starter-code hints as "// 여기에 코드를 작성하세요" instead of TODO — keeps the unfinished-content guard strict — cost if wrong: authors hit a build error and reword.
- Ruling R10: markdown images rejected (E_IMAGE_UNSUPPORTED) accepted pending review — single offline file cannot carry relative images; diagrams use text/inline means — cost if wrong: later add data-URI/inline-SVG support.
- T2 review: Spec ✅, quality Approved; 0 Critical/Important; 5 Minor.
- Ruling R11: promote T2 Minor #1 (invisible U+FEFF/U+FE0F literals in regex → escapes), #2 (indented `:::` / `::::` silently render as text → must be build error), #3 (document headings[].text is plain text) into a fix round — #2 would silently break ~155 content files — cost if wrong: one small extra round.
- Task 2: minor (deferred): countNewlines/BuildError factory duplicated between markdown.mjs and validate.mjs; validate pulls hljs via markdown.mjs.
- Task 2: minor (deferred): markdown.test.mjs:131 asserts hljs-name span markup (coupled to pinned highlight.js).
- Task 2: minor (deferred): search `text` includes :::answer bodies — search UI should be aware.
- Task 2: fix round 1/5 dispatched (resume ab7f5271e4d70e656; R11 items 1–3; FIX_BASE 7250704).
- T3 dispatched (sonnet, agent a1a288e61786ea5e1), NO GIT, in parallel with T2 fix (disjoint files). Rulings R3, R4 carried.
- Task 2: fix round 1 committed 111735f (pushed); scoped re-review dispatched (haiku, agent a81a55108194f2bba).
- Task 2: fix round 1/5 (3 addressed, 0 open; commits 7250704..111735f)
- Task 2: minor (deferred): indented close marker inside open box reports E_CONTAINER_INDENT + E_CONTAINER_UNCLOSED cascade; markdown.test.mjs:288 asserts only errors[0].
- Task 2: complete (commits 885e2f7..111735f, review clean)
- T7 implementer DONE_WITH_CONCERNS; controller committed a29862b (pushed). Review dispatched (sonnet, agent af177cc7677ceb335).
- Note for T8 (outline): reference uses try/catch in Day-22 theme code before Day-25 topic, Seoul-time helper introduced Day 26 and copied into overlay Day 27; YouTube IDs are unverified examples — outline/days must tell learners to use their own video IDs.
- T7 review: Spec ✅, quality Approved; 0 Critical/Important; 9 Minor.
- Ruling R12: promote T7 Minors #1 (aria-pressed+label swap), #2 (try/catch forward-ref comment), #3 (h1→h3), #4 (dense UTC time math → local time; overlay regex → split), #5 (use template literals/arrow functions taught in Days 16/18), #6 (pre-load filter state, stale aria-live, redundant aria-live), #7 (add `pattern` per spec Day 24) into fix round — the reference is the answer key a 0% beginner rebuilds; teachability is the user's top priority — cost if wrong: one extra round.
- Ruling R13: P1 time code uses browser local time (learner PC is in Korea) with a comment; correct timezone handling is taught in P2 Day 29 — cost if wrong: overlay off by TZ for a learner whose PC is not set to KST (comment warns).
- Task 7: minor (deferred): static-server traversal guard has no automated test; networkidle usage; schedule.html table duplicated with schedule.json (sync test mitigates); theme flash on load; og:image omitted; YouTube IDs unverified examples.
- Task 7: fix round 1/5 dispatched (resume a3c96498ba0936f89; FIX_BASE a29862b).
- T1 implementer DONE_WITH_CONCERNS (many doc hosts blocked; CHZZK details partly 미확인; installed dotnet-sdk-10.0 via apt; ran pkill -x node once — T3/T7 agents notified). Controller committed 0326afd (pushed). Review dispatched (sonnet, agent a6710f6a5a73657c3).
- Ruling R14: start references T13/T20/T28 only after T1 review is clean — they consume T1 facts — cost if wrong: a few minutes of idle parallel capacity.
- T3 implementer DONE_WITH_CONCERNS; controller committed 8f71f0c (pushed). Review dispatched (sonnet, agent a116b193fa4c50f20).
- T4 dispatched in parallel with T3 review (disjoint files; consumes plan-specified data shape).
- T4 dispatched (sonnet, agent a65ea520d4d446b01), NO GIT.
- Task 7: fix round 1 committed fa134f8 (pushed); path-filtered re-review dispatched (sonnet, agent ac4c4f13d0fcd826b).
- T3 review: Spec ✅, quality Approved; 0 Critical/Important.
- Task 3: complete (commits 0326afd..8f71f0c, review clean)
- Ruling R15: carry into T5: W_NO_CSS becomes an error (E_NO_CSS) once styles.css exists; builtAt uses date only (YYYY-MM-DD) to reduce index.html churn — both touch build.mjs which T5 already modifies — cost if wrong: trivial.
- Ruling R16: keep :::answer bodies in the search index (search is a "where did I read this" tool; snippets ≤80 chars and the answer gate is a soft motivational device) — cost if wrong: occasional spoiler in a snippet.
- Task 3: minor (deferred): infra throws (missing template, assemble guard) bypass `path CODE message` format; curriculum.json BOM gives opaque error; test gaps (_ files in glossary/troubleshooting, --only+--allow-missing, bad term link case, vacuous 'id' needle); three error factories; byLine NaN; `--only ""` → full build; troubleshooting prefix case collision; term routes exist without glossary page; [[term]] lookup is exact-case.
- Task 7: fix round 1/5 (7 addressed, 0 open; commits a29862b..fa134f8)
- Task 7: minor (deferred): isValidStart Number() accepts "20.5"/whitespace parts; validity.patternMismatch must be introduced in Day 24 lesson; showStatus skips identical text re-announce.
- Task 7: complete (commits 111735f..fa134f8, review clean)
- T1 review: Needs fixes — 1 Important (missing `rustup target add wasm32-unknown-unknown`), 9 Minor.
- Ruling R17: promote T1 Minors #1–#9 (evidence tags, softened CHZZK claims, wasm-pack wording, vite dev check, Node version lines, Windows 11 Home Docker support + Docker-free PostgreSQL fallback, Appendix A completeness, create-vite prompts/@types/node, PowerShell execution policy) into fix round 1 — each one is a place a 0% beginner would get stuck — cost if wrong: one longer round.
- Ruling R18: Docker stays the primary path for P3/SP (spec), but every Docker-dependent lesson must offer a Docker-free path (native PostgreSQL + run server directly), and the Docker install lesson starts with a Windows edition check — carry into T20/T21/T28/T29 — cost if wrong: extra lesson text.
- Task 1: fix round 1/5 dispatched (resume a618b8fc6159acbc8; FIX_BASE 0326afd).
- Ruling R19: start T13 now (its facts §6/§7 were re-verified clean by the T1 reviewer); T20/T28 still wait for T1 fix — cost if wrong: small rework if §6/§7 change.
- T13 dispatched (opus, agent ad9e7076270900140), NO GIT.
- T4 implementer DONE_WITH_CONCERNS; controller committed ca0fb77 (pushed).
- Ruling R20: locked PAGES (unmet requires, e.g. roadmap) must not leak snippets in search either — same treatment as locked projects (spec §4 intent: locked content shows title only) — cost if wrong: none.
- T4 review dispatched (sonnet, agent a0f9e78f79ae835f8).
- T4 review: Needs fixes — 1 Important (R20 locked pages leak snippets), 8 Minor.
- Ruling R21: search signature becomes `search(index, query, isItemLocked: (item)=>boolean, limit=30)` (supersedes plan's isProjectUnlocked(pid)) so pages and days are gated uniformly; T5 must pass the predicate — cost if wrong: none (T5 not started).
- Ruling R22: promote T4 Minors #1 (U+FEFF literal), #2 (readable vs writable storage), #5 (importBackup must not return ok:true with empty progress / all-unknown ids) — they protect learner progress — cost if wrong: small.
- Task 4: minor (deferred): probe doesn't read back; normalize doesn't enforce prerequisite consistency (cosmetic); search re-folds per call; untested empty-curriculum paths; store.available is a getter (read each time).
- Task 4: fix round 1/5 dispatched (resume a65ea520d4d446b01; FIX_BASE ca0fb77).
- Task 4: fix round 1 committed dc3e978 (pushed); re-review dispatched (haiku, agent ada045aa1bfe9d4da).
- Task 4: fix round 1/5 (4 addressed, 0 open; commits ca0fb77..dc3e978)
- Task 4: minor (deferred): importBackup ok:true when known ids but all values invalid (normalizes to empty, dropped 0) — T5 confirms before replacing; storage `readable` not probed at creation; normalize-throw message blames user's file. Callers of normalizeWithStats verified: only normalizeProgress(:82) and importBackup(:213).
- Task 4: complete (commits fa134f8..dc3e978, review clean)
- T5 dispatched (sonnet, agent a6eba4a6dc9fca8cb), NO GIT; carries R15, R21, import confirm, coming-soon style.
- Task 1: fix round 1 committed 8c1884c (pushed); re-review dispatched (sonnet, agent ab32c2ecb56126b93). Still 미확인: Docker Desktop on Win11 Home (current docs omit Home), CHZZK live server, npm.cmd bypass on real Windows.
- Task 1: fix round 1/5 (10 addressed, 0 open; commits 0326afd..8c1884c)
- Task 1: minor (deferred): react-ts linter choice (Oxlint vs ESLint prompt) not decided — SP outline should pick; Appendix A mixes 해소 rows; Set-ExecutionPolicy Y/A prompt not mentioned (lesson detail); Appendix B stale "JSON 문자열" log line.
- Task 1: complete (commits a29862b..8c1884c, review clean)
- Controller infra: started local PostgreSQL 16 (role wzh/wzh, dbs viewer_arena[_test], image_donation[_test]); started dockerd with registry mirror mirror.gcr.io (Docker Hub 429); contract updated.
- T20 dispatched (opus, agent ae50958b017c47a7f), NO GIT.
- T28 dispatched (opus, agent a7f59b1ca81698002), NO GIT.
- Ruling R23: SP React client keeps the react-ts template's default linter (Oxlint), no ESLint — fewer moving parts for beginners — cost if wrong: lessons mention ESLint as alternative.
- T5 implementer DONE_WITH_CONCERNS (extra views/common.js, inline theme-init script, #live region); controller committed 08e71d9 (pushed). Review dispatched (sonnet, agent a6f33a27bcce96580). Controller visual check of fixture (desktop/mobile/dark): clean, readable.
- T6 dispatched in parallel with T5 review (disjoint: docs/CONTENT-GUIDE.md + textbook/content/**).
- T6 dispatched (opus, agent a9d177f117ee3befb), NO GIT; carries R4/R6/R9/R10/R13/R18 + E_CONTAINER_INDENT rules.
- T13 implementer DONE_WITH_CONCERNS (deviations: /api/me 204 anon, PUT /api/me, #/board/:id/edit, ui.ts, SSE sends current notice first, rate limit per IP incl. auth, logout anon-allowed; Mvc.Testing 10.0.14 + Prettier not in research doc); controller committed 356116c (pushed).
- T5 review: Needs fixes — 1 Important (scrollIntoView on sidebar link moves focus start; first Tab skips skip link), 7 Minor.
- Ruling R24: promote T5 Minors 1 (stale theme radios), 2 (anchor containment guard), 3 (theme-init behavior test), 7 (comment test hook) into fix round 1 — reviewer-recommended, cheap — cost if wrong: small.
- Task 5: minor (deferred): ok:true 0-day import warning could be sharper; unlock banner + announce double speech; byte-identical rebuild test straddling 00:00 UTC.
- Task 5: fix round 1/5 dispatched (resume a6eba4a6dc9fca8cb; FIX_BASE 08e71d9).
- T13 review dispatched (sonnet, agent a71119fea60cc674f).
- Task 5: fix round 1 committed 1cb0557 (pushed); re-review dispatched (haiku, agent a97a2f09372b9ab96).
- Task 5: fix round 1/5 (5 addressed, 0 open; commits 08e71d9..1cb0557)
- Task 5: parked — page.js anchor `scrollIntoView` on glossary deep links moves the sequential-focus start to the target — Ruling: keep; landing focus near the term the learner asked for is the desired behavior for term links, and the skip-link case on plain routes is fixed/tested — cost if wrong: keyboard users press Shift+Tab once on deep-link loads.
- Task 5: minor (deferred): anchorTarget uses document.getElementById (first match in document); test hardcodes storage key; drawer path untested below fold.
- Task 5: complete (commits 8c1884c..1cb0557, review clean)
- T13 review: Needs fixes — 1 Important (admin seed promotes pre-registered account without password check), 10 Minor; all 7 declared deviations accepted by reviewer.
- Ruling R25: promote T13 Minors 1 ([Url] accuracy + http/https check), 2 (HTTP-level authz tests), 3 (429 on normal write + forwarded-headers note), 4 (register trim/half-registered), 5 (router decode in try), 6 (random test passwords), 7 (Content-Type 404 note), 8 (tsconfig strict, simpler generic helper, AsNoTracking) into fix round 1 — answer key accuracy and security habits — cost if wrong: one longer round.
- Note for T14 (P2 outline): /api/me returns 204 when anonymous (teach that, not 401); Day 27 CORS and Day 34 HTTPS/CSRF have no code counterpart — outline must supply demos/explanations.
- Task 13: minor (deferred): ValidationProblem key casing mix; SSE endpoint unauthenticated unbounded channel; nickname can impersonate "관리자"; sample streamers seeded in all envs; Mvc.Testing/xunit runner pins missing from research doc.
- Task 13: fix round 1/5 dispatched (resume ad9e7076270900140; FIX_BASE 356116c).
- Task 13: fix round 1 committed 7648078 (pushed); re-review dispatched (sonnet, agent accc645a52cddb9d9).
- Task 13: fix round 1/5 (9 addressed, 0 open; commits 356116c..7648078)
- Task 13: minor (deferred → P2 outline/lesson notes): forwarded-headers README lacks ForwardedHeaders=XForwardedFor + order before UseRateLimiter (Day 39); register partial-success retry hits DuplicateUserName; nickname-retry branch untested; HttpUrlAttribute needs override/is/out-var intro in Day 23/34 or a "읽기 전용" box; error text says https:// while http accepted; rate-limit test coupled to helper's 2 permits; server doesn't trim DisplayName; README could say to delete a squatter account.
- Task 13: complete (commits 08e71d9..7648078, review clean)
- T20 implementer DONE_WITH_CONCERNS (extra files/crates: tower-http, dotenvy, test-only tungstenite/reqwest; Docker verified via scratch Dockerfile with proxy cert — committed Dockerfile unchanged; soft correction instead of input replay; day leaderboard = rolling 24h); controller committed bf9ac3f (pushed).
- T6 implementer DONE_WITH_CONCERNS (MS support/MDN blocked → Windows UI wording partly unconfirmed & hedged; research doc's "VS Code on P1 Day 1 / Git Day 2" note contradicts spec 3.1 — spec followed; bold-before-Korean-particle trap only caught by a scratch check-bold.mjs); controller converted 4.5MB PNG screenshots to downscaled JPEG (1.5MB) and committed e81daf6 (pushed).
- Ruling R26: screenshots stored as downscaled JPEG (not PNG) — keeps repo small — cost if wrong: lower-fidelity evidence images.
- Ruling R27: add a build-time rule E_BOLD_UNRENDERED (literal ** left in rendered prose text) to the renderer so the CJK bold trap is caught by  for all 155 days instead of a scratch script — cost if wrong: small engine change.
- T6 review dispatched (opus, agent a92626c36cd7ba5cb) — beginner simulation + technical lenses.
- T20 review dispatched (sonnet, agent a2c97b6ed3ff940f7).
- T2 follow-up (R27 E_BOLD_UNRENDERED) dispatched by resuming ab7f5271e4d70e656.
- T28 implementer DONE_WITH_CONCERNS (ImageSharp 4.1.3 Release builds need a Six Labors license key; animated GIF → first frame; extra endpoints block/overlay-token/MarkShown/auth me|logout|onboarding/healthz; /api/auth/me 204 anon); controller committed snapshot 070f5df (pushed) before a pre-review fix.
- Ruling R28: replace ImageSharp with SkiaSharp (MIT) — no license-key step for beginners and no revenue-threshold commercial license for the learner's future MCN company; update research §12 accordingly — cost if wrong: rework of ImageProcessor/tests now.
- Ruling R29: animated GIF policy = first frame only (accepted) — simplest safe behavior — cost if wrong: animated GIFs show static.
- R27 E_BOLD_UNRENDERED committed 2cb312d (pushed); small review dispatched (haiku, agent a69d608e74b5aa275).
- R27 review: Needs fixes — I1 autolink false positive, I2 titles false negative; minors M1 line offsets, M2 stray-** message promoted; M3 raw HTML blocks unchecked (deferred, raw HTML is escaped text anyway), M4 `*`/`__` out of scope (deferred), M5 CONTENT-GUIDE error table/§1.5/§6.3 stale → carry into T6 fix round, M6 test brittleness (deferred).
- R27 fix round 1/5 dispatched (resume ab7f5271e4d70e656; FIX_BASE 2cb312d).
- R27 fix round 1 committed 02ae6e8 (pushed); re-review dispatched (haiku, agent ae1c110aeddcb982b).
- T20 review: Spec ✅, quality Approved; 0 Critical/Important; 11 Minor. All declared deviations accepted.
- Ruling R30: promote T20 Minors 1–10 (unfalsifiable speed test, idle timeout/heartbeat + registry drop guard, binary-frame limiter bypass, flaky flood test, 24h label, nickname format chars + duplicates, module cycle, Docker caching wording, README wording, client edge cases) — answer key quality before 45 lessons are written from it — cost if wrong: one longer round.
- Task 20: minor (deferred): DB tests silently skip without TEST_DATABASE_URL (lessons should say so); client pure logic has no unit tests.
- Task 20: fix round 1/5 dispatched (resume ae50958b017c47a7f; FIX_BASE bf9ac3f).
- T6 review: Needs fixes — 4 Important beginner stuck points (rename desyncs Notepad; F2 deletes whole name; no reopen-in-Notepad; no wrong-folder recovery) + minors.
- Ruling R31: promote all T6 Minors (사용자/Users, 한/영 note, Notepad tab restore, open-with prompt, stale bold-check text incl. R27 M5, relax one-app rule + why-before-how, troubleshooting raw <h1> + positional reference, research doc VS Code/Git Day numbers, remove stray .webp, English menu names) — the exemplar is copied by ~155 Days — cost if wrong: one longer round.
- Task 6: fix round 1/5 dispatched (resume a9d177f117ee3befb; FIX_BASE e81daf6).
- R27: fix round 1/5 (4 addressed, 0 open; commits 2cb312d..02ae6e8). Controller ran the stray-message test the re-reviewer skipped (see output).
- R27: minor (deferred): line offset ignores newlines consumed by preceding br/codespan/link tokens (hard-break case may report the paragraph's first line); autolink text uses esc (entity-like sequences now shown literally).
- R27 (E_BOLD_UNRENDERED): complete (commits 2cb312d..02ae6e8, review clean)
- Ruling R32: outline tasks (T8/T14/T21/T29) run in parallel but never edit textbook/content/curriculum.json directly; each writes its project entry to textbook/content/<pid>/_meta.json (ignored by the build: `_` prefix) and the controller merges it mechanically into curriculum.json (projects ordered p1,p2,p3,sp) — avoids concurrent JSON edits — cost if wrong: one merge step per outline.
- T28 SkiaSharp pre-review fix committed 6580cee (pushed; only T28's research hunks staged — T6's research hunks remain in the working tree). Stale research lines (Appendix A SkiaSharp/Magick row, Appendix B ImageSharp bullet) → deferred to final research cleanup.
- T28 review dispatched (opus, agent a01a117aa10998c70) on path-filtered package review-t28.diff.
- Task 6: fix round 1 committed afc8662 (pushed; includes T6's 2-line research fix); re-review dispatched (sonnet, agent aba68105e09c46bab).
- Task 20: fix round 1 committed d21948b (pushed); re-review dispatched (sonnet, agent ae2fb9e638302f0ff). Note: ZWJ ban blocks composite emoji in nicknames (accepted trade-off).
- Task 6: fix round 1/5 (14 addressed, 0 open; commits e81daf6..afc8662)
- Task 6: minor (deferred → T12 P1 integration review must fix in Day 1): "글자를 치면 이름이 통째로 지워지니" inaccurate (typing replaces only selected part); "already renamed while open" path omits step 5 leftover note; 한/영 never says switch back to English; CONTENT-GUIDE §1.5 heading stale ("빌드는 통과하지만…"); Destination Folder Access Denied moved off-Day without inline "계속 → 예"/back-link; no recovery if user pressed 항상 for Notepad.
- Task 6: complete (commits bf9ac3f..afc8662, review clean)
- PHASE 0 COMPLETE (T1–T7 + R27).
- T8 dispatched (opus, agent a364e8393cc6f1b94), NO GIT; outline-rules.md written (R32 _meta.json, outline block + 레퍼런스 대응 line, glossary ownership).
- T14 dispatched (opus, agent accfb4d2abdd6cb37), NO GIT; carries T13 lesson notes.
- T28 review: Needs fixes — 2 Important (retention expiry overwrites paid match; Approved dead end + clear not persisted), 12 Minor; spec Day 31 "신고" missing.
- Ruling R33: add minimal "신고" = streamer reports a donation to the operator (Report row + reject + block in one step; operator reviews via SQL, no admin UI) — spec SP Day 31 lists 신고; brief omitted it — cost if wrong: small extra endpoint.
- Ruling R34: promote T28 Minors 1–11 (+ optional GIF literal) — security/robustness/teachability of an answer key taught line by line — cost if wrong: one longer round.
- Task 28: fix round 1/5 dispatched (resume a7f59b1ca81698002; FIX_BASE 6580cee).
- Task 20: fix round 1/5 (9 addressed, 1 open — idle timeout bypassed during stalled write; commits bf9ac3f..d21948b)
- Task 20: fix round 2/5 dispatched (resume ae50958b017c47a7f; FIX_BASE d21948b) — stalled-write deadline + promoted Hangul-filler/soft-hyphen/bidi-isolate nickname filter.
- Task 20: minor (deferred): idle exit drops socket without Close frame (1006); RemoveOnDrop built under lock (unreachable panic path).
- Task 20: fix round 2 committed 81a777e (pushed); re-review dispatched (sonnet, agent a8df09806af05c980).
- Task 20: fix round 2/5 (2 addressed, 0 open; commits d21948b..81a777e)
- Task 20: minor (deferred): is_invisible is a denylist — U+2800, Mongolian/Khmer fillers, U+206A–206F, U+FFF9–FFFB, tag chars still pass (lesson can mention allowlist vs denylist trade-off).
- Task 20: complete (commits 7648078..81a777e, review clean)
- T21 dispatched (opus, agent a5261e9b5b4c1e4e2), NO GIT; carries T20 lesson notes.
- T28 fix round 1 implementer DONE (52 tests; Cleared terminal state; 30-min overlay backlog window; decode caps 100MP header / 4096² decode with scaled JPEG/WebP decode; refresh lock single-process).
- Ruling R35: reported donations keep their image (quarantined, not served on /media) until 7-day retention so the operator has evidence — report must not delete the file — cost if wrong: images of reported donations persist ≤7 days.
- Task 28: fix round 1 (+R35 addendum) committed 21b63fa (pushed); re-review dispatched (sonnet, agent a3fce5acb1c365c74).
- Task 28: fix round 1/5 (14 + R35 addressed, 0 open; commits 6580cee..21b63fa)
- Ruling R36: promote T28 re-review Minors M1 (report false success), M2 (emergency stop sends Clear() first), M4 (/media name check before DB), M5 (report button/label for imageless donations) into fix round 2 — emergency stop is broadcast safety; client pattern is taught — cost if wrong: one small round.
- Task 28: minor (deferred): M3 replayed backlog after lost MarkShown; M6 match before event insert (rare, recoverable); Reports/BlockEntries never purged (documented); /media private cache 1h after reject.
- Task 28: fix round 2/5 dispatched (resume a7f59b1ca81698002; FIX_BASE 21b63fa).
- PAUSED by user request ("잠시 작업 멈춰"). Stopped agents: T28 fix round 2 (a7f59b1ca81698002; nearly done — partial edits in reference/sp-image-donation uncommitted), T8 (a364e8393cc6f1b94; partial outline/pages uncommitted), T14 (accfb4d2abdd6cb37; partial outline at Days 11–20), T21 (a5261e9b5b4c1e4e2; partial outline header). On resume: resume each agent via SendMessage (transcripts intact) or re-dispatch fresh; partial files are in the working tree, not committed. Last pushed commit: 21b63fa.
- Paused-state WIP commit d76194d (T28 fix round 2 partial, UNREVIEWED; review range 21b63fa..d76194d on resume).
- 2026-11-05 checkpoint: container had restarted (PG down, dockerd down). Controller verified: textbook npm test 168/168; check --only p1-d01 OK; SP WIP d76194d dotnet test 54/54, client tsc+test 8/8 (e2e/Docker smoke NOT run). T8/T14/T21 stopped agents left NO files. Wrote docs/CHECKPOINT.md and mirrored this ledger + contracts + task reports into docs/checkpoint/ (committed) so a new session can resume.
- 2026-11-05 RESUMED (new session). Env restored: textbook npm ci, dotnet 10.0.114, wasm-bindgen, PG16 started (wzh + 4 DBs), dockerd 29.9.2 with mirror. Workspace rebuilt from docs/checkpoint/. HEAD 44803d0.
- T28 fix round 2: d76194d already contains all 14 files listed in the report's "Fix round 2" section. Dispatching (a) verification agent (sonnet, NO GIT, run all suites + e2e + Docker smoke, fix only if failing) and (b) scoped re-review of 21b63fa..d76194d (sonnet) in parallel.
- Ruling R37: T8/T14/T21 re-dispatched fresh in parallel (stopped agents left no files). Cross-project glossary rule while P1 glossary is in flight: P2/P3 outlines define only terms first taught in their own project; they `[[link]]` only to terms already present in glossary files on disk, and refer to P1 concepts by Day link otherwise; controller reconciles duplicate ownership after merge — cost if wrong: a small reconciliation edit after merge.
- Dispatched (2026-11-05, resumed): T28 verify (sonnet, a9c444aba8b7c1ecb), T28 fix2 re-review (sonnet, a764041e4c4aa6eeb), T8 (opus, a9fabbaa9c23c95b9), T14 (opus, a9b5b72238c84e776), T21 (opus, aa08a953b244403bf). All NO GIT. BASE 44803d0.
- Task 28: fix round 2/5 re-review (sonnet): 4/4 addressed (M1, M2, M4, M5), no new breakage. Waiting on verification agent before marking complete.
- Task 28: verification (sonnet): Release build 0 warn; dotnet test 54/54; client tsc/test 8/8/build/lint OK; e2e pass 1/0; Docker smoke via scratch Dockerfile copy + proxy CA (repo Dockerfile unchanged; fails here only on proxy CA NU1301): /healthz 200, /login 200, /media/abc.webp 404; cleaned up. Note: disk hit 0 during build → `docker builder prune -af` freed ~12 GB (cache only).
- Task 28: complete (commits 070f5df..d76194d, review clean)
