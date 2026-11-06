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
- T29 dispatched (opus, a73d162abe7e73591), NO GIT; carries T28 notes + R37 (SP must self-teach Docker/PostgreSQL since P3 is optional; flag P3 overlaps).
- T8 implementer DONE_WITH_CONCERNS (170 P1 glossary terms; minutes raised on Days 2,4,21,24,26,28; UI details marked 실기 미확인). Committed dd9eeef (base 9ff7ac2). Review dispatched (opus, a5fb6009d6e2651c6, prerequisite-order gate).
- R37 follow-up: messaged T14/T21/T29 that glossary/p1.md is on disk (P1 owns 터미널, PowerShell, 브랜치, 배포, 비동기, async 함수, await, fetch, JSON; P1 does NOT define 포트, localhost, 출처, 상태 코드, Promise → P2 may own).
- T14 implementer DONE_WITH_CONCERNS (211 P2 terms; renamed C# 클래스; sqlite3 install + Mvc.Testing/xunit runner/Prettier versions + Prettier CRLF not in external-facts; outline ~190k chars). Committed b0ed08d (base 37f03e1). Review dispatched (opus).
- T14 review dispatched (opus, aa9e5c2ec8bec1b55), base 37f03e1 head b0ed08d.
- T21 implementer DONE_WITH_CONCERNS (162 P3 terms; links to P2's 패턴 매칭/열거형/직렬화/리버스 프록시; spec deviations: minimal input send moved to Day 26, println! until Day 37 then tracing; dense Days 19, 24–26, 29–32). Committed 8203077 (base f85155c). Review dispatched (opus).
- Ruling R38: a term has one owner book-wide (build enforces E_TERM_DUPLICATE). Docker/PostgreSQL/WebSocket etc. are owned by P3 (main track, earlier in book order); SP Days must still teach them fully in their own text and link [[term]] to the shared definition — SP is reachable without P3 — cost if wrong: an SP-only learner sees "처음 등장: P3 Day N" pointing at a locked Day.
- Ruling R39: #/page/roadmap does not exist until T35. P3 Day 45 (batch T26) writes the closing line without the roadmap link; T35 adds the link to Day 45 when it creates the roadmap page — cost if wrong: one extra edit in T35.
- T21 review dispatched (opus, ae3bb5ce81fbae658), base f85155c head 8203077. R38 sent to T29.
- 2026-11-06: usage limit hit (429) mid-run. T14 review (aa9e5c2ec8bec1b55), T21 review (ae3bb5ce81fbae658) and T29 implementer (a73d162abe7e73591) terminated early. Container restarted: PG/dockerd down, textbook node_modules re-installed (npm ci OK). textbook/content/sp/ is NOT on disk (T29 partial output lost or never written to the repo).
- T8 review (opus): spec ✅; Needs fixes — 2 Important: (I1) CSS descendant selector (Day 10) and compound class selector .site-nav.open (Day 21) never taught; (I2) no §0.2 rule for opening Live Preview pages in Edge to use F12 DevTools (Days 6/22/25/26/28/29). 7 Minor.
- Ruling R40: promote all 7 T8 Minors into fix round 1 (Day 8 full weekday names; Day 9 head comment vs §0.1; Day 13/21 768px comment; contents.js layout Days 19–21 + stale Day 19 comment; Day 7 Ctrl+Shift+` for New Terminal; mark Live Preview command/port 실기 미확인; Day 27 이미 배운 것 Day labels). The outline is the only contract between parallel Day writers, so ambiguity becomes inconsistency — cost if wrong: one longer round.
- Task 8: fix round 1/5 dispatched (resume a9fabbaa9c23c95b9; FIX_BASE dd9eeef).
- Resumed after limit reset: T14 review, T21 review, T29 implementer (told sp/ lost, regenerate + R38).
- T14 review (opus): spec ✅ (C# Dev Kit optional = justified); Needs fixes — 3 Important: (I1) Day 26 task 1 admin-seed scenario not reproducible (seed creates admin on fresh DB first); (I2) P1 back-link/forward-use errors (change event, minlength/maxlength, createElementWithText→P1 Day 20, aria-current→P1 Day 11); (I3) Day 36 says 16 integration tests, reference has 15. 7 Minor. Review size note: ~247 KB not a problem.
- Ruling R41: promote all 7 T14 Minors (same reason as R40) — cost if wrong: one longer round.
- Task 14: fix round 1/5 dispatched (resume a9b5b72238c84e776; FIX_BASE b0ed08d).
- T21 review (opus): spec ❌ — 5 Important: (I1) R39 broken, Day 45 says to add roadmap link; (I2) OBS assumed installed (P1 makes it optional) Days 30/43; (I3) §4 P1/P2 Day map stale + wrong back-links (getBoundingClientRect, Math.random/ceil, setTimeout→P2 Day 8, TS class/private, fetch POST, location.href, process.argv, performance.now, OBS recording, npm ci, DTO; P3-internal: if let, trim, std::mem, matches!, winver, impl Fn, format!); (I4) invented intermediate code (play.ts Days 13–24, client/src/local/*.ts 16–18, rust-basics main.rs 6–10) too loosely specified for parallel writers; (I5) density: Day 19 (~750 lines), Day 29 (12 files), Day 26 too heavy for 120 min. 2 Minor (데이터베이스 인덱스 owner Day 36 vs first use Day 35; derive owner Day 10 vs first use Day 6). Deviations (a) input send on Day 26 and (b) println! until Day 37 judged justified.
- Ruling R42: invented intermediate code (not in the reference) must have its exact shape fixed in the outline — file skeleton, function/variable/type names, and which lines each Day adds/changes — so parallel writers reproduce it identically. Keep parallel batches rather than one sequential writer — cost if wrong: drift caught and fixed in T27 integration review.
- Ruling R43: a Day over 120 min for a 0% beginner may move content to an adjacent Day (the reviewer's rebalance of Days 19/21, 26/24, 29/30/31 is accepted as the default), keeping each spec 3.3 Day title's core theme; every move is listed as a spec deviation in the report — cost if wrong: Day themes differ slightly from the spec table.
- Ruling R44: promote T21's 2 Minors (glossary owner = first teaching use, or "예고만" on the earlier Day) — cost if wrong: none.
- Task 21: fix round 1/5 dispatched (resume aa08a953b244403bf; FIX_BASE 8203077).
- T8 fix round 1 implementer DONE (172 terms; §0.2 Edge DevTools rule). Committed b8a6f7f. Note: p1-only scratch merge can't be 0 errors while p2/p3 glossaries exist; all-three merge = 0 errors. Re-review dispatched (sonnet).
- T8 fix round 1 re-review dispatched (sonnet, ae552e369fa4aa7d7), FIX_BASE dd9eeef HEAD b8a6f7f.
- Ruling R45: in-flight agent files may be committed as labelled WIP snapshots ("wip(...)") to survive container restarts (the SP outline was lost once); review ranges always use the recorded BASE/FIX_BASE, never a WIP commit — cost if wrong: noisier history.
- T29 implementer DONE_WITH_CONCERNS (125 SP terms; links P2/P3 shared terms per R38; renamed OAuth 스코프; test project moved to Day 25, test-mode backend Day 26; practice folder C:\dev\sp-practice; 치지직 redirect via Vite 5173 unverified on real server). SP files at d411c91 (base 8e30f25). Review dispatched (opus).
- Task 28: minor (deferred): reference ApiFactory default TEST_DATABASE_URL embeds the sandbox login wzh/wzh — learners must set their own; SP test Day must teach it (carry to T30–33 writers).
- T29 review dispatched (opus, adb024653a4f543e2), base 8e30f25 head d411c91 (SP paths).
- Task 8: fix round 1/5 (10 addressed, 0 open; commits dd9eeef..b8a6f7f)
- Task 8: minor (deferred): Day 10 용어 order vs glossary order; Day 24 이미 배운 것 out of descending order; §0.2 DevTools Day list omits Days 11, 20, 21 (general rule covers them).
- Task 8: complete (commits 9ff7ac2..b8a6f7f, review clean)
- T14 fix round 1 implementer DONE (11 fixed + extra P1-untaught JS methods introduced: Object.keys/values/flat D27, startsWith/replaceChildren D28, disabled/confirm/Math.ceil/Number.isInteger/in D31, then/catch D33). Final files already in WIP snapshot d411c91. All-4 scratch merge 0 errors.
- Ruling R46: merge all four _meta.json into curriculum.json now (glossary p2/p3/sp were already committed and link to those Days, so a partial merge leaves the repo check red); re-merge p3/sp after their fix rounds (script: workspace merge-meta.mjs) — cost if wrong: one re-merge per outline change.
- curriculum.json merged (p1:30 p2:40 p3:45 sp:40; pages start,help,glossary,troubleshooting): `npm run check -- --allow-missing` → 검사 통과 Day 155개, only missing-day warnings; npm test 168/168.
- Task 14: fix round 1/5 dispatched-to-review: re-review (sonnet, a9676e04d2f0b3799), FIX_BASE b0ed08d HEAD d411c91.
- Wrote content-batch-rules.md (binding rules for all Day batches: outline wins over reference for intermediate Days; file ownership; verification via tests/helpers; NO GIT).
- T9 (P1 Days 2–10, sonnet, a353aceed4b03090f) and T10 (P1 Days 11–20, sonnet, a57c2d74dd7ef1b4e) dispatched, NO GIT. T11 (Days 21–30) waits for a free slot (max 5 concurrent: P3 fix, SP review, T14 re-review, T9, T10).
- Task 14: fix round 1/5 (11 addressed + extras verified, 0 open; commits b0ed08d..d411c91)
- Task 14: minor (deferred): section 2 "taught here" list omits Day 27 Object.keys/values/flat; Day 36 .NET names explained inline, not in a 읽기만 box.
- Task 14: complete (commits 37f03e1..d411c91, review clean)
- T11 (P1 Days 21–30, sonnet) dispatched, NO GIT.
- T21 fix round 1 implementer DONE (R39 fixed; OBS install D30 + recording D43; §5 P1/P2 map re-derived; §4 shape tables (R42); R43 rebalance incl. Day 21→120, Day 29 120→110, Day 31 110→120; R44 glossary). Committed f10a2c7; curriculum re-merged (check OK). Re-review dispatched (sonnet).
- T21 fix round 1 re-review dispatched (sonnet, a4d6281c9c6e234df), FIX_BASE 8203077 HEAD f10a2c7. Committed tree check (git archive HEAD → scratch) passes: Day 155; transient 5 errors came from T9's in-progress day-02.md.
- T29 review (opus): spec ❌ — mandatory brief items met; 4 declared deviations accepted (test project D25, test-mode backend D26, C:\dev\sp-practice, Vite 5173 redirect = config only, unverified). Missing: spec 2.5 limits (no mission donations; no API to inject media → OBS browser source); Day 25 basic/optional split. Important: (I1) R42 shapes missing (sample data D4/5, DonationForm prop D5, list Overlay/useOverlayHub D15, ChzzkSessionSource ctor + practice test D25, api.http skeleton, .bin LocalImageStorage D10); (I2) R43: Days 11, 19, 26, 31 >120 min (rebalance into light Days 22, 28, 30, 32, 33); (I3) forward use D10 GeneratedRegex/partial, D11 ReadOnlySpan/u8/ranges/collection expr/is not (A or B), D19 reduce + keydown/e.key, D23 UserManager/SignInManager, D35 GROUP BY/JOIN/count; (I4) PowerShell 5.1 lacks static RandomNumberGenerator.GetBytes(32) (D14, D37; also in reference README). Wrong back-links D4/9/17/18/19/25/L410. 7 Minor (cookie/port claim wrong per RFC 6265; 11 MB file exceeds body limit; SetApplicationName invalidates cookies once; D37 8080 signup vs shared pgdata/media/keys; D9 Donation.cs comments; D26 relay vs external-facts; D34 Docker-free TEST_DATABASE_URL).
- Ruling R47: the PowerShell 5.1-safe secret command fix is load-bearing for Days 14/37 and the reference README has the same bug; T29's fix round may edit ONLY that command in reference/sp-image-donation/README.md (no code change) — cost if wrong: one line of answer-key docs changed outside T28's review (re-review covers it).
- Ruling R48: promote all T29 Minors (same reason as R40) — cost if wrong: one longer round.
- Task 29: fix round 1/5 dispatched (resume a73d162abe7e73591; FIX_BASE d411c91).
- Task 21: fix round 1/5 (6 addressed, 0 open; commits 8203077..f10a2c7)
- Task 21: minor (deferred): Days 24, 26, 30 at 120 min remain the heaviest (copy-then-explain mitigation); spec-deviation list (7 items: D19→21 tests, D26→24 validation, D29→30 home, D30→31 static, minutes) lives in docs/checkpoint/reports/task-21-report.md "Fix round 1" — carry into HANDOFF (T36).
- Task 21: complete (commits f85155c..f10a2c7, review clean)
- T15 (P2 Days 1–10, sonnet, a4cb3a28d07200aa3) dispatched, NO GIT. T16–18 wait for slots.
- T29 fix round 1 implementer DONE (14 fixed; spec 2.5 limits D25 :::warn; §9 skeletons A–G; rebalance per reviewer + ChzzkApiClientTests D34→36; 6 learner migrations incl. AddImageFileIndex D32; README line 113 PS 5.1 command (R47); skeletons not compiled; PS not run). Committed 066fdaf; curriculum re-merged; committed-tree check OK. Re-review dispatched (sonnet).
- T29 fix round 1 re-review dispatched (sonnet, af6f5c1a31141493b), FIX_BASE d411c91 HEAD 066fdaf.
- Task 29: fix round 1/5 (14 addressed, 0 open; commits d411c91..066fdaf). Re-review judged the Day 31→32 one-day gap (reported image URL still served until D32 gating) acceptable: unguessable 128-bit names, local dev only, D31 must state it.
- Ruling R49: promote the 3 re-review leftovers into fix round 2 (D34 _meta summary/keywords stale after test move; D28 목표 stale sentence; D11 읽기만 box vs hand-written HasAllowedSignature) — they would mislead SP Day writers — cost if wrong: one tiny round.
- Task 29: fix round 2/5 dispatched (resume a73d162abe7e73591; FIX_BASE 066fdaf).
- T29 fix round 2 implementer DONE (3 leftovers + typo 4305). Committed 773967a; curriculum re-merged; committed-tree check OK. Re-review dispatched (haiku).
- Task 29: fix round 2/5 (3 addressed, 0 open; commits 066fdaf..773967a)
- Task 29: complete (commits 8e30f25..773967a, review clean)
- ALL FOUR OUTLINES COMPLETE (T8, T14, T21, T29). curriculum.json merged (p1:30 p2:40 p3:45 sp:40).
- T16 (P2 Days 11–20, sonnet) dispatched, NO GIT.
- T9 implementer DONE_WITH_CONCERNS (Days 2–10; 111 Playwright checks pass; 2 outline problems: Day 5 back.html ../../ path outside Live Preview root → file:// with explanation; Day 3 broken-HTML task has no file → read-and-find). Final files at b9b4bda (base 342c1ed).
- Ruling R50: Day-batch reviews use sonnet (mid tier) with CONTENT-GUIDE's review checklist; project integration reviews (T12/T19/T27/T34) use opus — cost if wrong: a subtle teaching defect slips to the integration review.
- T9 review dispatched (sonnet, a5afd54997d2550b8), base 342c1ed head b9b4bda.
- T9 review (sonnet): spec ✅; Needs fixes — 3 Important: (I1) D7 step refers to a 🧯 item that exists only in the troubleshooting 모음; (I2) D2 SmartScreen/UAC same problem; (I3) D5 assignment 2 leaves C:\dev\hello open → D6 step 1 stuck. Declared outline problems: D5 file:// = valid; D3 read-and-find = as outline intended. 10 Minor (스크린 리더 before D5; D3 combined sample hides </h1> symptom; D10 style.css edit recovery; D7 about.html text diverges from later full codes; D8 assignment 3 leaves uncommitted change vs D9 "변경 0개"; D7 rejected recovery alternative; remote origin already exists inline; D3 tab indentation, D5 width/height, D5 .svg double-click pitfalls missing in Day lists; D10 font-weight 700 unexplained; D5 text-art > 32 cols).
- Ruling R51: promote all T9 Minors — most are anti-block issues (the user's top requirement) — cost if wrong: one longer round.
- Cross-batch lesson sent to running writers T10, T11, T15, T16: every "아래 🧯 …" reference must point to an item present in that Day's own 🧯 section (or name the 문제 해결 모음 entry by title); end each Day with the learner's folder/editor state matching the next Day's start (e.g. reopen the project folder); keep learner-visible text equal to later Days' full-code fallbacks.
- Task 9: fix round 1/5 dispatched (resume a353aceed4b03090f; FIX_BASE b9b4bda).
- T10 implementer DONE (Days 11–20; 116 checks + 16 intermediate; 8 outline problems incl. D20 null error text measured, .header-inner comment in D11 only, D14 full style.css). Final files at b69499d (base 342c1ed). Review dispatched (sonnet).
- T10 review dispatched (sonnet, ae424603f9cd1808f), base 342c1ed head b69499d; includes D10/D11 seam check.
- T9 fix round 1 implementer DONE (12 fixed; some 🧯 items moved to 모음 only to keep 3–6 per Day). Committed a901b47. Re-review dispatched (sonnet).
- T9 fix round 1 re-review dispatched (sonnet, aa482c65588c474be), FIX_BASE b9b4bda HEAD a901b47.
- Task 9: fix round 1/5 (12 addressed, 0 open; commits b9b4bda..a901b47)
- Task 9: minor (deferred): D7 "방법 1" GitHub rename flow not verified against the real GitHub UI.
- Task 9: complete (commits 342c1ed..a901b47, review clean)
- T17 (P2 Days 21–30, sonnet) dispatched, NO GIT.
- T11 implementer DONE_WITH_CONCERNS (Days 21–30; 246 checks; D28 end state == reference; 4 outline problems: D20 wording assumed, D27 start=7:5 edge, Lighthouse written for Chrome (Edge tab unmeasurable), D21 @media whole-block replace). Final files at 32979ff (base 342c1ed). Review dispatched (sonnet).
- T11 review dispatched (sonnet, a8fde2a5daece08f8); head 32979ff; includes D20/D21 seam + Edge vs Chrome Lighthouse.
- T10 review (sonnet): spec ❌ — (I1) contents.html guide sentence: outline keeps "지난 방송 영상을 모아 두는 페이지예요." until Day 23, but Days 11–20 use the Day 23 wording from Day 11 (silent change in D11 fallback; D12 과제 2 and D20 step 3 anchor on text the learner doesn't have); (I2) D12 🧯 refers to "2단계 블록" but the line is in step 3. 4 declared outline problems judged correct/acceptable. 8 Minor (D19 🧯 title mismatch, D20 ambiguous 🧯 ref; D15 const redeclare console claim vs troubleshooting; D11 aria-current search count 5→6; D12 optional commit vs D13 "변경 0개"; D13 viewport 🧯 missing; D16 ₩ key on Korean keyboards; D19 let vs const; D17/D19 "(일부)" on new file).
- Ruling R52: promote all T10 Minors (anti-block) — cost if wrong: one longer round.
- Task 10: fix round 1/5 dispatched (resume a57c2d74dd7ef1b4e; FIX_BASE b69499d).
- T11 review (sonnet): spec ✅; Needs fixes — 1 Important: D28 Lighthouse Chrome-only though Chrome is optional (Day 2) and Edge has Lighthouse; make Edge InPrivate primary. D20/D21 seam verified clean; other 3 declared outline problems acceptable. 6 Minor (D28 author-meta sentence; D21/D24/D23 missing 🧯 candidates; troubleshooting H1 missing; D22 [[data 속성]] re-marked).
- Cross-batch finding (from T10 review) added to T11: day-21.md:824 uses a third wording of the contents.html guide sentence; outline keeps "지난 방송 영상을 모아 두는 페이지예요." until Day 23, which changes it.
- Ruling R53: promote all T11 Minors — cost if wrong: one longer round.
- Task 11: fix round 1/5 dispatched (resume a8a09e53510e4c0d4; FIX_BASE 32979ff).
- T10 fix round 1 implementer DONE (10 fixed; Day 11 fallbacks now identical to day-10.md; D13 moved one 🧯 to 모음). Files at 30a8cca. Re-review dispatched (sonnet).
- T15 implementer DONE_WITH_CONCERNS (P2 Days 1–10; code blocks executed: TS, create-vite + Playwright, dotnet, git vs local bare remote; 8 outline problems e.g. D1 videos.json via contents.html, D6 avoid Math.ceil, D7 HMR only for CSS, D8 Offline→Slow 4G + block URL). Files at 3173b9a. Review dispatched (sonnet). T10 fix-round-1 files are in WIP snapshot 30a8cca.
- T10 fix round 1 re-review dispatched (sonnet, acfcceaf30c84ac4d), FIX_BASE b69499d HEAD 30a8cca. T15 review dispatched (sonnet, a4f0a61d437a4812d), head 3173b9a.
- T11 fix round 1 implementer DONE (7 fixed). Files at b718956. Re-review dispatched (sonnet).
- Task 10: fix round 1/5 (10 addressed, 0 open; commits b69499d..30a8cca)
- Task 10: complete (commits 342c1ed..30a8cca, review clean)
- T11 fix round 1 re-review dispatched (sonnet, a324fbd1f42bc167b), FIX_BASE 32979ff HEAD b718956.
- T18 (P2 Days 31–40, sonnet) dispatched, NO GIT.
- Task 11: fix round 1/5 (7 addressed, 1 new Important — 🧯 counts over CONTENT-GUIDE 3–6: D21 7, D23 7, D24 9, plus pre-existing D26 7, D27 7, D28 8, D29 8; new 🧯 items missing from the troubleshooting file; commits 32979ff..b718956)
- Task 11: fix round 2/5 dispatched (resume a8a09e53510e4c0d4; FIX_BASE b718956) — trim every Day 21–30 🧯 to ≤6 (move lowest-value items to the 모음; keep every "아래 🧯" reference resolving), and mirror new items in troubleshooting/p1-days-21-30.md.
- 🧯 3–6 cap note sent to running P2 writers T16, T17, T18 (T15 under review — reviewer checks against the guide).
- T11 fix round 2 implementer DONE (🧯 ≤6 all Days; ~30 entries added to 모음). Files at 0411826. Re-review dispatched (haiku).
- T11 fix round 2 re-review dispatched (haiku, a86ca81a93bb8557c), FIX_BASE b718956 HEAD 0411826.
- Task 11: fix round 2/5 (🧯 cap + reference resolution addressed; open: Day 26 "더블클릭으로 열면 카운트다운이 없어요" has no 모음 entry; Day 27 tomorrow-broadcast guidance lost in move; commits b718956..0411826)
- Ruling R54: a Day 🧯 item and its 문제 해결 모음 entry need not have verbatim-identical headings — a paraphrase covering the same symptom/cause/fix satisfies CONTENT-GUIDE ("🧯 repeats 모음 items") — only genuinely missing items or lost content are defects — cost if wrong: a learner searching the 모음 by the exact Day heading may not find it by text search.
- Task 11: fix round 3/5 dispatched (resume a8a09e53510e4c0d4; FIX_BASE 0411826) — add Day 26 entry, restore Day 27 guidance.
- T11 fix round 3 implementer DONE. Files at 5302192. Re-review dispatched (haiku).
- Task 11: fix round 3/5 (2 addressed, 0 open; commits 0411826..5302192)
- Task 11: complete (commits 342c1ed..5302192, review clean)
- P1 Days 1–30 all reviewed (T6 Day 1, T9, T10, T11).
- Ruling R55: T12 smoke test covers every Day that has a content file (all h2/copy/console/360px checks) plus every page; Days without a file are checked to render the "준비 중" screen with 0 console errors. The preview index.html sent to the user is built from a scratch content copy containing only REVIEWED Day files (P1 1–30; unreviewed P2 WIP files removed → "준비 중"); the repo-root index.html is built the same way for the T12 commit — cost if wrong: preview hides in-progress P2 Days (intended).
- T12 step 1 dispatched (sonnet): smoke test + Day 1 deferred fixes + CONTENT-GUIDE §1.5 heading + preview build. NO GIT.
- T12 step 1 implementer: sonnet, a8e0e53b32baeb609. BASE da77b87.
- Ruling R56: T16 appended two sourced facts to docs/research/external-facts.md (sqlite3 via winget SQLite.SQLite for P2 D19; EF Core 10.0.14/dotnet-ef flow for D20) outside its file list. Accepted and reviewed with T16's batch; from now on writers must NOT edit shared docs (external-facts.md, CONTENT-GUIDE.md, outlines) — new facts go in their own docs/verification/<batch>.md and report, and the controller merges them — cost if wrong: concurrent edits to a shared file could clobber each other.
- content-batch-rules.md item 2 updated accordingly.
- T12 step 1 implementer DONE (npm test 168; check OK; test:e2e 26 incl. smoke; smoke vs preview: 30 Days + 125 준비 중, 0 external requests; 0 content defects; Day 1 six fixes; CONTENT-GUIDE §1.5 heading; index.html 4.69 MB preview build). Committed 6166d21.
- Ruling R57: keep the 5-concurrent cap (usage limit was hit once) — T12 reviewer ① (beginner simulation, opus) dispatched now; reviewer ② (technical accuracy, opus) when a slot frees — cost if wrong: T12 takes a little longer.
- T12 reviewer ① beginner simulation dispatched (opus, aceb6c4b664eb693f) on head 6166d21.
- T15 review (sonnet): spec ✅; 8 declared outline problems all valid; Needs fixes — 3 Important: D8 과제 1 never imports `wait`; `.join(', ')` untaught (D4 first use); `append(...)` + HTMLLIElement/HTMLUListElement untaught (D8). Missing: D1 `:::tip 이 교재를 읽는 방법` (CONTENT-GUIDE 1.2). 14 Minor (node -e; D4 indent claim wrong; D8 unblock recovery; D8 css blank line + dead .card h2; rule (d) full-file leniency D6–8; D3 push hash chain; D9 C# assets prompt + .vscode; backtick/₩ wording; D7 HMR wording; D8 npx tsc --noEmit untaught; Copy-Item gloss; D9 version date; D7/D8 assignment edits uncommitted until D16 → dirty git status D9–15; D1 time sums).
- Ruling R58: promote all T15 Minors + the missing D1 tip; for the git drift, require "과제 후 커밋" so each Day ends clean — cost if wrong: one longer round.
- Task 15: fix round 1/5 dispatched (resume a4cb3a28d07200aa3; FIX_BASE 3173b9a).
- 2026-11-06: usage limit (429) hit again; T12 reviewer ①, T15 fix round 1, T16, T17, T18 terminated early. Resumed after reset via SendMessage (transcripts intact). WIP snapshot taken first.
