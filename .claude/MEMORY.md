# Pal project memory

## Notes system

- All notes live in `notes/` — flat directory, ~70 files, all with frontmatter (date, tags, summary)
- `INDEX.md` (project root) — full list of all notes with summaries; read this first to find relevant context
- `TAGS.md` (project root) — notes grouped by shared tags; use for topic navigation
- Rebuild both with: `pnpm notes` (runs `scripts/notes-build.ts`)
- Skills: `/notes-search <query>`, `/notes-rebuild`, `/notes-add <file>`

## Key architectural facts

- Pal = Lisp interpreter where the environment IS the filesystem; file path = symbol, extension = type
- `(gpt expr)` is a first-class special form
- Sub-projects are independent (not wired together): pal-ts, pal-rs, pal-eval, pal-fs, wingman, pal-lsp, hyper-ts, hyper-fs
- wingman = WebGPU IDE (wgpu + winit); named "Prophet" in code; builds native + WASM
- hyper-ts build is broken (missing module impls)
- Root package.json: `type: "module"`, pnpm workspace, Node 24 with `--experimental-strip-types` for TS scripts
