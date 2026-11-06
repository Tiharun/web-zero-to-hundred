# Rules for Day-content batch tasks (P1 T9–11, P2 T15–18, P3 T22–26, SP T30–33)

1. Requirements = the Task 9 brief (task-9-brief.md) with YOUR batch's Day range and batch name substituted. The project's `_outline.md` is the binding contract for each Day: title, minutes, 목표, start/end state, files, 과제 → 정답 요지, owned glossary terms, pitfalls, 레퍼런스 대응. Where the outline and the reference code differ on an intermediate Day, the outline wins. Where the outline seems wrong, follow it anyway and list the problem under "개요와 달라진 점/개요 문제" in your report; do not silently diverge.
2. Write only your batch's files:
   - textbook/content/<pid>/day-NN.md
   - textbook/content/troubleshooting/<batch>.md
   - docs/verification/<batch>.md (+ small JPEG screenshots under docs/verification/ only if useful, downscaled, R26)
   - (only if needed) textbook/content/glossary/<batch>-extra.md
   NEVER edit curriculum.json, _outline.md, _meta.json, the existing glossary files, day-01.md, CONTENT-GUIDE, docs/research/external-facts.md or the reference code. New external facts you verified go in your docs/verification/<batch>.md (with source + date); the controller merges them into external-facts.md. If an outline-owned glossary term is missing or wrong, report it.
3. Follow docs/CONTENT-GUIDE.md exactly (anti-block rules (a)–(g), required h2 order, :::blocks at column 0, no raw HTML, no Markdown images, no placeholder words like TODO/TBD, code fences with a language, exact-case [[용어]], E_BOLD_UNRENDERED). Use textbook/content/p1/day-01.md as the style/depth exemplar (해요체, full Windows paths, every click spelled out, expected screen after every step).
4. Glossary links: link a term with [[exact heading]] only if its heading exists in textbook/content/glossary/*.md. The Day that OWNS a term (per the outline) introduces and explains it in prose.
5. Verification (brief Step 3):
   - Reconstruct each Day's end-state code in your scratch folder. Serve it with tests/helpers/static-server.mjs and drive it with Playwright (tests/helpers/browser.mjs shows the pattern; Playwright is preinstalled, never install it).
   - Check: console errors 0, and every "끝 상태 확인" item from the outline.
   - Record one row per Day in docs/verification/<batch>.md.
   - Windows-only steps (installers, menus) are recorded as "공식 문서 대조" with the source (docs/research/external-facts.md), or as "실기 미확인".
6. Check: `cd textbook && npm run check -- --only <comma-separated Day ids of your batch>` → 0 errors. A batch whose Days run in parallel with others may see other batches' files appear; that is expected.
7. NO GIT. Never kill processes you did not start. Clean up your own servers by PID.
8. Report (path in the dispatch) — files written, verification table summary, every deviation from the outline and every outline problem found, unverified items. Reply with the short contract only.
