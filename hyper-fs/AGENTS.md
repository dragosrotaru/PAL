# AGENTS.md — hyper-fs

> AI-audience orientation guide for the `hyper-fs` FUSE filesystem package.
> @author claude

## What this is

A TypeScript FUSE filesystem that exposes a `Device`'s encrypted `HyperGraph`
(from `hyper-ts`) as a mountable directory. Uses the `fuse-native` npm package.

## Architecture

```
hyper-fs
  └── Device (password + config file)
        └── FUSE mount at ./mount
              └── FuseHandlers → Device → HyperGraph ops (hyper-ts)
```

## Entry points

| Task                  | File                                             |
| --------------------- | ------------------------------------------------ |
| Mount FUSE filesystem | `src/index.ts` (args: password, config-file path)|

## Build

```bash
pnpm run build   # tsgo
pnpm run start   # tsgo && node -r dotenv/config build/index.js
```

## Known stubs / missing pieces

- Depends on `hyper-ts` which itself has missing module implementations
  (`password`, `hash-id`, `symmetric-key`, `object-type-guard`).
- Build currently fails because these hyper-ts dependencies are unimplemented.
- `fuse-native` requires OS-level FUSE support (macFUSE on macOS, libfuse on Linux).
