# AGENTS.md — pal-os

> AI-audience orientation guide for the `pal-os` Linux distro experiment.
> @author claude

## What this is

A starting point for a custom Linux distribution following the
[Linux From Scratch (LFS)](http://www.linuxfromscratch.org/lfs/) guide,
containerised via Docker.

The goal is "Pal-OS": a bespoke Linux environment tailored for running
the Pal programming environment natively.

## Files

| File               | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `Dockerfile`       | LFS chapters 2–5 automated in Docker (Ubuntu 20.04 base) |
| `version-check.sh` | LFS tool version verification script (run inside Docker) |
| `README.md`        | Brief build instructions                                 |

## How to build

```bash
docker build -t lfs -f Dockerfile .
docker run -i -t lfs bash
```

## Current state

The Dockerfile covers LFS chapters 2–5 (host prep, package download, cross-toolchain build).
It is **incomplete** — only `binutils` and `gcc` pass 1 are started.
The standard LFS process has ~20+ more chapters to complete a bootable system.

## Missing pieces

- LFS chapters 6+ (glibc, libstdc++, all remaining toolchain packages).
- Chapter 8 (installing the final system).
- Bootloader setup.
- Any Pal-specific packages or runtime.
