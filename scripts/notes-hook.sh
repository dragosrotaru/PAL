#!/bin/bash
# PostToolUse hook: regenerate INDEX.md + TAGS.md when a notes/ file is written or edited.
# Receives tool input JSON on stdin.

file_path=$(jq -r '.file_path // ""' 2>/dev/null)

if [[ "$file_path" == notes/* ]]; then
  pnpm --silent notes
fi
