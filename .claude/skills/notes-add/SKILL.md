---
name: notes-add
description: Process a raw file into a properly formatted note in notes/. Handles splitting, frontmatter, naming, and index rebuild.
disable-model-invocation: true
---

# Notes Add

Process the file at: $ARGUMENTS

## Steps

1. Read the source file.
2. Assess conceptual cohesion — if it covers multiple distinct topics, plan a split into separate notes.
3. For each note:
   - Choose a fully self-contained descriptive filename — the name alone must identify the content, no namespacing.
   - Get the earliest git date: `git log --all --full-history --format="%ad" --date=short -- <path> | tail -1`
   - Write frontmatter:
     ```yaml
     ---
     date: YYYY-MM-DD
     tags: [tag1, tag2, ...]
     summary: What this contains. Important because...
     ---
     ```
   - Preserve all content fully.
   - Write to `notes/<filename>.md`.
4. Delete the source file.
5. Run `pnpm notes` to rebuild INDEX.md and TAGS.md.
