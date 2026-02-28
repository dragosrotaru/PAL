---
date: 2024-01-21
tags: [research, operating-systems, rust, os-history, kernel, pal-os]
summary: Notes from two OS-related videos. First: "Is it time to rewrite the OS in Rust?" — covers the write-from-scratch challenges (Linux binary compatibility as anti-corruption layer, Second System Syndrome) and the practical alternatives (Rust in-kernel components, rewriting systemd in Rust, Rust-based firmware like OpenBMC, noting that userland is harder than kernel to rewrite). Second: "The First Real Operating Systems" by David Evans — covers SAGE (US radar detection, post-USSR atomic test), multiprogramming as the solution to the memory bottleneck, the process abstraction (programs believe they own the machine), and how distrust of programs necessitates a privileged supervisor/kernel with memory isolation and interrupt capability. Important background for pal-os design — understanding why a full OS rewrite is risky and what the kernel's fundamental job is.
---

# OS design: Rust rewrite considerations and OS history (video notes)

## Is it time to rewrite the Operating System in Rust?

**Video:** https://www.youtube.com/watch?v=HgtRAbE1nBM

### Write-from-scratch challenges

- **Linux binary compatibility as an anti-corruption layer** — any new OS must handle existing binaries, which pulls it toward Linux compatibility and constrains the design
- **Second System Syndrome** — the rewrite becomes overambitious and fails

### Practical alternatives

- Rust in-kernel components (incremental adoption)
- Rewrite systemd in Rust
- Rust-based firmware — e.g., rewrite OpenBMC in Rust
- Userland software is harder to rewrite than the kernel

---

## The First Real Operating Systems

**Video:** https://www.youtube.com/watch?v=yk0c3yqR4k0 — David Evans

- **SAGE** — US program to build a radar detection system after the first Soviet atomic test; one of the first large-scale real-time computing systems
- **Multiprogramming** solves the memory bottleneck by keeping multiple programs in memory
- **Process abstraction** — programs are given the illusion that they own the entire machine
- Distrust of programs requires a special privileged program — the **supervisor / kernel** — which provides memory isolation and the ability to interrupt other programs
