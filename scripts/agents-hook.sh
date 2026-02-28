#!/bin/bash
# PostToolUse hook: re-run agents-symlinks.sh link when CLAUDE.md or AGENTS.md is modified.
# Receives tool input JSON on stdin.

file_path=$(jq -r '.file_path // ""' 2>/dev/null)
filename=$(basename "$file_path")

if [[ "$filename" == "CLAUDE.md" || "$filename" == "AGENTS.md" ]]; then
  bash scripts/agents-symlinks.sh link
fi
