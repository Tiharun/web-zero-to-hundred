# Task 4 report: runtime logic (progress, unlock, storage, search, router)

Status: DONE_WITH_CONCERNS (one gap for Task 5 to cover, see Concerns). NO GIT used; nothing committed.

## What was implemented

Four pure ES modules in `textbook/src/app/`. None touches the DOM. No input object is mutated; every function returns a new object (tests pass deep-frozen inputs, so any mutation would throw).

- `progress.js`: `STORAGE_KEY`, `emptyProgress`, `normalizeProgress`, `isProjectComplete`, `isUnlocked`, `projectState`, `dayState`, `canComplete`, `canUncomplete`, `completeDay`, `uncompleteDay`, `toggleCheck`, `newlyUnlocked`, `continueTarget`, `percent`, `exportBackup`, `importBackup`. Signatures are exactly those in the brief.
- `storage.js`: `createStore(storage?)` returning `{ get available, load(), save(p) }`. The default `globalThis.localStorage` is read lazily inside try/catch when the store is created.
- `search.js`: `search(index, query, isProjectUnlocked, limit = 30)`.
- `router.js`: `parseHash(hash)`.

Verified against the real embedded data shape: I built the fixture (`node textbook/build.mjs --content tests/fixtures/content --out .../scratchpad/t4/index.html`), pulled `<script id="wzh-data">`, and ran the functions on it. Flow: continue is `fa-d01`; after fa-d01 and fa-d02, `newlyUnlocked` is `['fb']`, continue is `fb-d01`, and main is 66%. The four modules also bundle with esbuild as an IIFE (14.6 KB, no `document` or `window` references).

## Decisions where the brief left room

Route shapes (Task 5 consumes these):
```
{name:'home'} | {name:'project', pid} | {name:'day', dayId} | {name:'page', id, anchor}  // anchor = decoded string, or null when absent
{name:'settings'} | {name:'search', q}  // q = decoded, '' when absent
{name:'notfound'}
```
- Router: ids are percent-decoded but not validated. A malformed `%` never throws; the raw text is used. `+` in `q` stays `+` (plain `decodeURIComponent`, no form-encoding). One trailing `/` and a bare `#` are tolerated. Extra segments or an empty id give `notfound`.
- `canComplete` returns false for an already-completed Day. The brief's literal wording does not say this. It keeps a double click from overwriting the completion time, and `completeDay` then throws `cannot-complete`.
- `uncompleteDay` throws `Error('cannot-uncomplete')` when `canUncomplete` is false. This is symmetric with `completeDay`; the brief does not specify the blocked case.
- `completeDay` sets `lastDay = dayId`. `uncompleteDay` and `toggleCheck` leave `lastDay` alone. There is no `setLastDay` helper, so a view that wants "last viewed day" does `{...prog, lastDay: id}` itself, and `normalizeProgress` accepts that value.
- `toggleCheck` removes the key when the list becomes empty, and `normalizeProgress` also drops empty or fully out-of-range check lists (canonical form). An invalid index (negative, non-integer, `NaN`, string, null) returns an unchanged shallow copy.
- `normalizeProgress` drops `completed` values that are not strings or that `Date.parse` cannot read. It drops an unknown `lastDay` (set to null) and an unknown `theme` (set to `'system'`). Any exception inside it, including a malformed `cur`, returns an empty progress.
- `normalizeProgress` is also safe against `__proto__` keys: ids are checked against a Map built from `cur`, so such a key is treated as an unknown Day.
- `importBackup`:
  - `dropped` counts distinct unknown Day ids across `completed` and `checks`. An unknown id in both counts once, which is the "dropped === 1" case.
  - A missing or non-object `progress` returns `ok:false`, so a corrupt file never silently wipes the existing progress.
  - A leading UTF-8 BOM is stripped, since Windows Notepad adds one.
  - Error messages are in Korean for: not JSON, not this textbook's file (including `{"app":"other"}`), unsupported schema, missing progress.
- `dayState`: `next` is the first incomplete Day of an unlocked project and `open` is any other incomplete Day. Unknown Days and Days of locked projects are `'locked'`. An unknown project is `projectState` `'locked'`. A project with zero Days can never be complete.
- Storage:
  - `createStore` probes with a write of `wzh:v1:probe` and an immediate remove, so `available` is already false right after creation when the storage throws. A missing `removeItem` or a failed remove is tolerated.
  - `available` is a live getter. It flips to false if a later `getItem` or `setItem` throws.
  - `save` always keeps a JSON string copy in memory and returns true. It returns false only for a value that cannot be serialized (circular, `undefined`).
  - `load` reads from the storage while usable, otherwise returns a fresh parse of the memory copy. Corrupt JSON returns null.
  - An explicit `null` storage means memory only.
- Search:
  - The query and the index are compared after `normalize('NFC')` and `toLowerCase()`.
  - Score is the sum over terms of 10 times the occurrences in the title plus the occurrences in the body. Ties keep index order (stable sort).
  - The snippet is cut from the NFC text with its original case: 40 characters before the earliest match among the terms and 40 after its end, with `…` marking a truncated side. It never splits a surrogate pair.
  - A title-only match on an unlocked item gets the first 80 characters of the body, so `null` always means "locked".
  - The snippet is plain text. Task 5 must insert it with `textContent` or escape it.
  - Locked-project items still match on body text but get `snippet: null`. This is what the e2e `search hides locked snippet` needs.

## Tests

RED (before the modules existed):
`cd textbook && node --test ../tests/unit/progress.test.mjs ../tests/unit/storage.test.mjs ../tests/unit/search.test.mjs ../tests/unit/router.test.mjs`
All four files failed with `ERR_MODULE_NOT_FOUND: Cannot find module '.../textbook/src/app/{progress,router,search,storage}.js'`, so no test ran. This was expected because the modules did not exist yet.

GREEN:
`cd textbook && node --test ../tests/unit/{progress,storage,search,router}.test.mjs`
`# tests 55  # pass 55  # fail 0`

Full suite (`cd textbook && npm test`): `# tests 152  # pass 152  # fail 0  # cancelled 0  # skipped 0`. This includes the other agents' existing unit and build tests.

Tests added per file:
- progress (23): all the brief's named tests, plus unknown ids, `isUnlocked`, `completeDay` purity, pages in `newlyUnlocked`, `toggleCheck`, special-track and `order` handling in `continueTarget`, `normalize` edge cases (`__proto__`, garbage, broken `cur`), BOM, and roundtrip.
- storage (9): `store falls back to memory when storage throws` plus working storage, probe key cleanup, mid-session quota failure, `getItem` failing after startup, missing `removeItem`, unserializable values, copies not aliases, and lazy default resolution (a throwing `localStorage` getter, a fake, and `undefined`).
- search (15): the 4 named tests plus ranking ties, title-versus-body terms, snippet window and ellipsis, surrogate safety, limit, empty queries, and regex characters taken literally.
- router (8): the 3 named tests plus query decoding, malformed `%`, trailing slash, and non-string input.

Mutation spot check: I ran 14 deliberate breakages against a scratch copy (isUnlocked always true, ceil in percent, no previous-day check, no dependents check, unknown days kept, title weight 1, no NFC, locked snippet leaks, anchor not decoded, no storage probe, no memory fallback on a failed write, newlyUnlocked without pages, continueTarget without special, and so on). Every one made at least one test fail.

## Files (all new, untracked; the controller commits exactly these)

- `/home/user/web-zero-to-hundred/textbook/src/app/progress.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/storage.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/search.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/router.js`
- `/home/user/web-zero-to-hundred/tests/unit/progress.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/storage.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/search.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/router.test.mjs`
- (this report)

Scratch work (fixture build, smoke script, mutation copies) lives only under the scratchpad `.../scratchpad/t4/`.

## Review focus coverage

- Item 2 (storage unavailable): covered by `store falls back to memory when storage throws`, plus the lazy-default test where reading `localStorage` throws. Task 5's banner should read `store.available` after startup and after saves, since it can flip later.
- Item 3 (corrupt backup): covered by `importBackup rejects garbage` and `importBackup drops unknown days`. `importBackup` never touches the store, so on `ok:false` the caller just keeps the current progress.

## Self-review

I re-read all four modules and found no problems. No dead code. The only deviations from the literal brief are the ones listed under Decisions. No model identifiers appear in any file.

## Concerns

1. Locked pages are not hidden in search. The search index marks pages with `project: null`, and `search` only receives `isProjectUnlocked(pid)`. A page with unmet `requires` (the fixture's `secret`, the real `roadmap`) therefore returns a snippet. The brief and spec only require hiding locked projects, so I kept the signature and treated `project: null` as open. A minimal fix for Task 5 is to post-process the results: `r.kind === 'page' && !isUnlocked(cur, prog, pageRequires(r.id)) ? { ...r, snippet: null } : r`. Task 5 should also render the lock screen for locked pages, as it does for Days.
2. The brief has no function that sets `lastDay` for "last viewed". `completeDay` sets it and views can set it with a spread (see Decisions).

---

# Fix round 1

NO GIT. Only the four modules and four test files were touched. The decisions and concerns above are superseded where they conflict with this section: the `search` signature (concern 1), the `available` semantics, and the `importBackup` rules.

## Changes

1. Important, locked pages leak snippets (R20). `search.js` now has the signature `search(index, query, isItemLocked = () => false, limit = 30)`.
   - `isItemLocked` receives the index item and returns true when it is locked. This covers days of locked projects and locked pages.
   - Locked items still match on title and body but return `snippet: null`. The project-only gate is gone; the caller (Task 5) computes lock state with `progress.isUnlocked`. JSDoc updated.
   - Tests in `search.test.mjs`:
     - Replaced the old `isProjectUnlocked is asked only for items that have a project` test.
     - Added a `secret` page (project null) to the fixture index.
     - `locked project hides snippet` now uses `(item) => item.project === 'fb'`.
     - Added `locked page returns title only`.
     - Added `unlocked page keeps snippet`.
     - Added `days of locked projects and locked pages are both gated by the same predicate`.
     - Existing tests moved to the new predicate meaning (`nothingLocked = () => false`).

2. Minor, literal U+FEFF in source. `progress.js` (the BOM-strip regex, now line 197) and `progress.test.mjs:370` held a real invisible BOM character. Both are now written as the escape `﻿`. `grep -c $'\xef\xbb\xbf'` reports 0 in all `textbook/src/app/*.js` and `tests/unit/*.test.mjs`, and the BOM test still passes.

3. Minor, reads gated on the write probe. `storage.js` now tracks `writable` and `readable` separately.
   - `load()` reads whenever `getItem` works, even if the write probe or `setItem` failed.
   - If the last `save` could not reach the storage, the newer in-memory value is returned instead (`memoryIsNewer`).
   - `available` is `writable && readable` and still flips to false when `setItem` or `getItem` fails later. This keeps the earlier `getItem` throws test valid.
   - Tests added: `load still reads when writes fail`, and `writes that start failing mid-session keep older stored data readable until a newer save`.

4. Minor, `importBackup` could return `ok:true` with an empty progress.
   - `normalizeWithStats` no longer swallows exceptions. `normalizeProgress` wraps it and still returns an empty progress on failure, as the brief requires.
   - `importBackup` catches the throw and returns `{ ok:false, error }` in Korean ("파일이 손상됐을 수 있어요. 지금 진도는 그대로 두었어요").
   - `importBackup` also returns `ok:false` with a Korean message when the backup has unknown Day ids and nothing importable remains (`dropped > 0` and no completed or checks left). The message includes the count, for example "Day 2개가 모두 이 교재에 없어요…".
   - A backup with no Day ids at all (a fresh export) still imports `ok:true`.
   - Tests added: `importBackup fails when every day in the backup is unknown`, `importBackup still imports a backup that has no days at all`, `importBackup fails instead of returning an empty progress when normalizing throws`.

## Verification

Command: `cd /home/user/web-zero-to-hundred/textbook && npm test`
Output: `# tests 159  # pass 159  # fail 0  # cancelled 0  # skipped 0`

Mutation spot check on a scratch copy; each regression made the named tests fail:
- Pages not gated (old behavior): `locked page returns title only` and the combined gate test fail.
- Reads gated on write probe: `load still reads when writes fail` fails.
- Memory not preferred after a failed write: the mid-session flip test and `load still reads when writes fail` fail.
- All-unknown rejection removed: `importBackup fails when every day in the backup is unknown` fails.
- Normalize failure swallowed as ok: the all-unknown test, the normalizing-throws test and several import tests fail.

## Changed files

- `/home/user/web-zero-to-hundred/textbook/src/app/search.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/storage.js`
- `/home/user/web-zero-to-hundred/textbook/src/app/progress.js`
- `/home/user/web-zero-to-hundred/tests/unit/search.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/storage.test.mjs`
- `/home/user/web-zero-to-hundred/tests/unit/progress.test.mjs`
- (`router.js` and `router.test.mjs` unchanged)

## Note for Task 5

`search(cur.search, q, isItemLocked)` takes an item-level predicate. For days: `projectState(cur, prog, item.project) === 'locked'`. For pages: `!isUnlocked(cur, prog, pageRequires(item.id))`.
