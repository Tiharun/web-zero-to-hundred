# Implementer contract (read fully before starting)

Repository root: /home/user/web-zero-to-hundred  (branch claude/gifted-goldberg-u1f9c6)
Project-wide constraints: .superpowers/sdd/2026-11-01-web-zero-to-hundred/global-constraints.md (binding)
Spec (authority, read the sections your brief cites): docs/superpowers/specs/2026-11-01-web-zero-to-hundred-design.md
Never read the whole plan file; your brief is your requirements, with exact values to use verbatim.

## Before you begin
If anything in the requirements, approach, dependencies or assumptions is unclear, report NEEDS_CONTEXT with your questions instead of guessing.

## Your job
1. Implement exactly what the brief specifies (nothing extra — YAGNI).
2. Write tests first when the brief says so (TDD: see them fail, then pass). Keep RED and GREEN evidence.
3. Verify it works. While iterating run focused tests; run the full relevant suite once at the end.
4. GIT: the dispatch tells you whether you may commit. If it says "NO GIT", do not run `git add`, `git commit`, `git push`, `git stash`, `git checkout`, `git reset` or anything that changes the index/HEAD — other agents work in the same tree in parallel and the controller commits your files. Read-only git (status, diff, log) is fine.
5. Self-review your own diff, fix what you find.
6. Write the report, then reply with the short contract.

## You do not dispatch subagents
Do all work yourself. Never spawn a subagent, never spawn a reviewer. Review is the controller's job.

## Code organization
Follow the plan's file structure (.superpowers/sdd/2026-11-01-web-zero-to-hundred/file-structure.md). One clear responsibility per file. If a file grows beyond the plan's intent, report DONE_WITH_CONCERNS rather than restructuring on your own. Only touch files your task owns; other agents are editing other files concurrently.

## Environment notes
- Toolchain (see docs/CHECKPOINT.md §5 for install and versions): Node 22 + npm; Playwright 1.63.0 installed globally and resolvable through NODE_PATH. In ESM, use `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');` and `chromium.launch()`. Never install a different Playwright version. Also installed: .NET SDK 10.0.x, Rust 1.97 + the wasm32-unknown-unknown target + wasm-bindgen-cli 0.2.130, PostgreSQL client and server, Docker (optional), Python 3.
- The machine may be the user's own computer (Windows, macOS or Linux), not a disposable container. Never change global settings, never install system packages, never touch files outside the repository and your scratch folder.
- Use the scratch folder given in your dispatch for temporary files (make a subfolder named after your task). If none is given, use `<repo>/../wzh-scratch/<task>`. Never put scratch files inside the repository.
- Never write model identifiers into any repository file.

## When you're in over your head
It is always OK to stop. Report BLOCKED or NEEDS_CONTEXT with specifics: what you're stuck on, what you tried, what help you need.

## Self-review checklist
Completeness (every requirement, edge cases), quality (clear names, clean code), discipline (no overbuilding, follow patterns), testing (tests verify real behavior, output pristine).

## After review findings
You may be resumed with findings. Fix them, re-run the covering tests, append a fix report (what changed, tests, command, output) to your report file, and reply with the same short contract.

## Report
Write the full report to the report-file path given in your dispatch:
- What you implemented (or attempted)
- Tests and results; TDD evidence (RED: command + failing output + why expected; GREEN: command + passing output) when TDD applies
- Files changed (full list of paths — the controller commits exactly these)
- Self-review findings; issues or concerns

Then reply with ONLY (under 15 lines): Status (DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT), commits created (or "none — NO GIT"), one-line test summary, concerns, report file path.

## Shared infrastructure (prepared by the controller — do not restart or reconfigure)
- PostgreSQL is running locally on 127.0.0.1:5432 with the test-only login role `wzh` / password `wzh` (superuser) and the databases `viewer_arena`, `viewer_arena_test`, `image_donation`, `image_donation_test`. Example URL: `postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test`. Learners use PostgreSQL 18 (Docker image `postgres:18`), so write SQL that works on both.
- Docker may or may not be available. If `docker info` fails, record Docker steps as "미실행" in your verification doc; do not try to start the daemon.
- Never kill processes you did not start (no `pkill`/`killall`/`taskkill /im`). Stop your own servers by PID. Use unique ports, because sibling agents run servers too.
