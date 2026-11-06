# Task 12 step 1 report
Status: DONE. No git.
Implemented: tests/e2e/smoke.test.mjs (builds own index.html to a temp dir with allowMissing, or opens SMOKE_INDEX; injects all-completed progress; visits every Day + page + home/settings/project at 360px; checks 7 h2 in order, copy buttons == figure.code, 0 console errors, no horizontal scroll, 0 external requests; coming-soon Days only checked for errors/scroll).
Day 1: 6 deferred fixes applied (selection wording, step-5 leftover note, switch back to English, inline 계속 -> 예 + return link, 항상 recovery). CONTENT-GUIDE 1.5 heading updated.
Preview: scratch copy at scratchpad/t12/content with p2/p3/sp day files removed; built to /home/user/web-zero-to-hundred/index.html (4.69 MB, 30 Days, 125 coming-soon).
Results: npm test 168 pass; check --allow-missing OK; test:e2e 26 pass (incl. smoke: 49 Days at the time, 1339 code blocks); smoke vs preview: pass (30 Days, 659 code blocks); external requests 0 (asserted in smoke).
Content defects found by smoke: 0 (P1 and the P2 Days present at the time all clean).
Files: tests/e2e/smoke.test.mjs, textbook/content/p1/day-01.md, docs/CONTENT-GUIDE.md, index.html
