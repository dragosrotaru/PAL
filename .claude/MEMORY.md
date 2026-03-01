# Pal project memory

## Long Term Goal

We are looking to converge ideas from Pal into the target system SWM, a commercial grade version of Pal. its an Agentic Software Engineering platform. There are many parallels

SWM is a sibling repo, just next to pal.
You can read the typed declarations of the most important code and doc files on demand at these locations (base: `/Users/megacuck/Projects/_good_shit/`):

swm/declarations/src/modules/system/agent/_domain/*
swm/declarations/src/modules/system/knowledge/*
swm/declarations/src/modules/system/toolbox/_domain/*

Run `pnpm pal:ctx` in swm to regenerate declarations after code changes.

start with the knowledge repo since that is the core of what we're working on right now.


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
