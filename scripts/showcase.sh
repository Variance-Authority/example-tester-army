#!/usr/bin/env bash
# Regenerates reports/: records the whole suite, edits `remove` in the notes,
# runs what `variance select` keeps, and keeps what each side saw. The edit is
# put back on exit.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain -- . ':!reports')" ]; then
  echo "showcase: commit or stash first; an uncommitted precondition runs the whole suite" >&2
  exit 1
fi

# Written aside and moved in at the end, so the diff selection reads is the
# edit alone.
out=$(mktemp -d)
trap 'git checkout -- src/features/Notes.tsx; rm -rf "$out"' EXIT

# 1. The whole suite, recording which lines each test entered.
VARIANCE_AUTHORITY_SINCE= npx e2e run >/dev/null 2>&1
cp .e2e/summary.md "$out/full-run.md"
npx variance covering --file src/features/Notes.tsx >"$out/covering-notes.txt"

# 2. A behaviour-preserving edit to `remove`.
sed -i.bak 's/    setNotes(notes.filter((_, at) => at !== index));/    setNotes((current) => current.filter((_, at) => at !== index));/' \
  src/features/Notes.tsx && rm src/features/Notes.tsx.bak
git diff --no-color -- src/features/Notes.tsx >"$out/edit.diff"
npx variance select >"$out/select.txt" 2>&1
npx variance covering --since HEAD >"$out/covering-since.txt"

# 3. Only what selection kept.
npx e2e run >/dev/null 2>&1
cp .e2e/summary.md "$out/selected-run.md"

# 4. The agent removing a note: its trace page and its judgment's screenshot.
dir=$(ls -d .e2e/results/notes-agent-the-agent-removes-a-note-*)
cp "$dir/attempt-1/screenshots/001-assert.png" "$out/remove-a-note.png"
sed -e 's#\[screenshot\](attempt-1/screenshots/001-assert.png)#[screenshot](remove-a-note.png)#' \
  "$dir/trace.md" >"$out/remove-a-note.md"

# Paths from this checkout, not from the machine that ran it.
sed -i.bak "s#$PWD/##g" "$out"/*.txt "$out"/*.md && rm "$out"/*.bak
rm -rf reports && mv "$out" reports && chmod 755 reports
echo "showcase: wrote reports/"
