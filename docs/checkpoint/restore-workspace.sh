#!/usr/bin/env bash
# Recreates the git-ignored SDD workspace from its mirror in docs/checkpoint/workspace/.
# Run from anywhere inside the repository:  bash docs/checkpoint/restore-workspace.sh
# Safe to re-run: files already in the workspace are NOT overwritten unless you pass --force.
set -euo pipefail
root=$(git rev-parse --show-toplevel)
src="$root/docs/checkpoint/workspace"
ws="$root/.superpowers/sdd/2026-11-01-web-zero-to-hundred"
force=${1:-}
[ -d "$src" ] || { echo "missing $src" >&2; exit 1; }
mkdir -p "$ws"
# Same self-ignoring .gitignore the superpowers sdd-workspace script writes.
[ -f "$root/.superpowers/sdd/.gitignore" ] || printf '*\n' > "$root/.superpowers/sdd/.gitignore"
n=0
for f in "$src"/*; do
  b=$(basename "$f")
  if [ "$force" = "--force" ] || [ ! -e "$ws/$b" ]; then cp "$f" "$ws/$b"; n=$((n+1)); fi
done
echo "workspace: $ws"
echo "copied $n file(s); ledger first line: $(head -1 "$ws/progress.md")"
