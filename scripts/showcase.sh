#!/usr/bin/env bash
# Regenerates reports/: records the whole suite, edits `remove` in the notes,
# runs what `variance select` keeps, and keeps what each side saw. The edit is
# put back on exit.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "showcase: commit or stash first; an uncommitted precondition runs the whole suite" >&2
  exit 1
fi

out=reports
rm -rf "$out" && mkdir -p "$out"
trap 'git checkout -- src/features/Notes.tsx' EXIT

# 1. The whole suite, recording which lines each test entered.
VARIANCE_AUTHORITY_SINCE= npx e2e run >/dev/null 2>&1
cp .e2e/summary.md "$out/full-run.md"
npx variance covering --file src/features/Notes.tsx >"$out/covering-notes.txt"

# 2. A behaviour-preserving edit to `remove`.
sed -i.bak 's/    setNotes(notes.filter((_, at) => at !== index));/    setNotes((current) => current.filter((_, at) => at !== index));/' \
  src/features/Notes.tsx && rm src/features/Notes.tsx.bak
git diff --no-color -- src/features/Notes.tsx >"$out/edit.diff"
npx variance select >"$out/select.txt"
npx variance covering --since HEAD >"$out/covering-since.txt"

# 3. Only what selection kept.
npx e2e run >/dev/null 2>&1
cp .e2e/summary.md "$out/selected-run.md"

# 4. The agent removing a note: its trace page, its judgment's screenshot, and
# its video with the frames where nothing moved taken out.
dir=$(ls -d .e2e/results/notes-agent-the-agent-removes-a-note-*)
cp "$dir/attempt-1/screenshots/001-assert.png" "$out/remove-a-note.png"
sed -e 's#\[screenshot\](attempt-1/screenshots/001-assert.png)#[screenshot](remove-a-note.png)#' \
  -e 's#\[video\](attempt-1/video/video.webm)#[video](remove-a-note.gif)#' \
  "$dir/trace.md" >"$out/remove-a-note.md"
ffmpeg -loglevel error -y -i "$dir/attempt-1/video/video.webm" \
  -vf 'mpdecimate,setpts=N/FRAME_RATE/TB,fps=8,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse' \
  "$out/remove-a-note.gif"

echo "showcase: wrote $out/"
