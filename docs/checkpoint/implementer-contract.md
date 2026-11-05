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
- Node 22 + npm available; Playwright is preinstalled globally: in ESM use `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); const { chromium } = require('playwright');` and `chromium.launch()` with no options. Never run `playwright install` or install another Playwright version.
- Rust 1.97 + cargo + rustup (wasm32-unknown-unknown target installed), Docker CLI (daemon not running by default), psql client, Python 3. .NET SDK is NOT installed until a task installs it (`apt-get install -y dotnet-sdk-10.0`).
- Outbound network goes through a proxy: npm registry, crates.io, NuGet, apt work; github.com release downloads and Microsoft download servers are blocked.
- Use the scratchpad for temporary files: /tmp/claude-0/-home-user-web-zero-to-hundred/a3ed5e68-2ed7-58a6-8548-3d657f4039ce/scratchpad (make a subfolder named after your task).
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
- PostgreSQL 16 is running locally on 127.0.0.1:5432. Login role `wzh` / password `wzh` (superuser, test-only). Databases: `viewer_arena`, `viewer_arena_test`, `image_donation`, `image_donation_test`. Example URL: `postgres://wzh:wzh@127.0.0.1:5432/viewer_arena_test`. Learners will use PostgreSQL 18 (Docker image `postgres:18`); write SQL compatible with both.
- Docker daemon is running with a registry mirror (Docker Hub anonymous pulls are rate-limited); `docker pull postgres:18` works. Never stop/restart dockerd. Clean up containers/images you create (use unique names).
- Never kill processes you did not start (no `pkill`/`killall`); stop your own servers by PID.
