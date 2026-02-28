#!/usr/bin/env bash
# agents-symlinks.sh
# Manage CLAUDE.md symlinks for AGENTS.md files throughout the repo.
#
# Usage:
#   scripts/agents-symlinks.sh link    # Create CLAUDE.md -> AGENTS.md symlinks
#   scripts/agents-symlinks.sh unlink  # Remove all CLAUDE.md symlinks (when Anthropic adds native AGENTS.md support)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMMAND="${1:-}"

usage() {
  echo "Usage: $0 <link|unlink>"
  echo ""
  echo "  link    Create CLAUDE.md -> AGENTS.md symlinks next to every AGENTS.md found"
  echo "  unlink  Remove all CLAUDE.md symlinks (safe — only removes symlinks, not real files)"
  exit 1
}

cmd_link() {
  local count=0
  while IFS= read -r agents_file; do
    local dir
    dir="$(dirname "$agents_file")"
    local claude_file="$dir/CLAUDE.md"

    if [[ -L "$claude_file" ]]; then
      echo "  skip  $claude_file (symlink already exists)"
    elif [[ -f "$claude_file" ]]; then
      echo "  skip  $claude_file (real file exists — not overwriting)"
    else
      ln -s AGENTS.md "$claude_file"
      echo "  link  $claude_file -> AGENTS.md"
      (( count++ )) || true
    fi
  done < <(find "$REPO_ROOT" \
    -not -path "$REPO_ROOT/.git/*" \
    -not -path "$REPO_ROOT/node_modules/*" \
    -name "AGENTS.md")

  echo ""
  echo "Created $count symlink(s)."
}

cmd_unlink() {
  local count=0
  while IFS= read -r claude_file; do
    local target
    target="$(readlink "$claude_file")"
    if [[ "$target" == "AGENTS.md" ]]; then
      rm "$claude_file"
      echo "  unlink  $claude_file"
      (( count++ )) || true
    else
      echo "  skip    $claude_file (points to '$target', not AGENTS.md)"
    fi
  done < <(find "$REPO_ROOT" \
    -not -path "$REPO_ROOT/.git/*" \
    -not -path "$REPO_ROOT/node_modules/*" \
    -type l -name "CLAUDE.md")

  echo ""
  echo "Removed $count symlink(s)."
}

case "$COMMAND" in
  link)   cmd_link ;;
  unlink) cmd_unlink ;;
  *)      usage ;;
esac
