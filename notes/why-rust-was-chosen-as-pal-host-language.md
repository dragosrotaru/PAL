---
date: 2024-01-21
tags: [pal, rust, host-language, decision, architecture]
summary: Rationale for choosing Rust as Pal's host language. Key factors: performance, developer popularity, strong macro support (approximating homoiconicity), strong type system, ML library bindings, Linux kernel inclusion, wide target environments, and a healthy ecosystem (wgpu, WASM, Deno, Servo). Notes that this is a critical decision with wide-ranging implications — the wrong host language leads to terrible long-term experiences.
---

# Why Rust was chosen as Pal's host language

Picking the right host language for this project is a difficult, high-stakes decision. Here is why Rust was chosen:

- Blazing fast performance
- Developers love Rust (consistently top of Stack Overflow surveys)
- Good-sized community
- Strong macro support — no homoiconicity, but good enough
- Strong type system — no dependent types, but good enough
- Bindings for machine learning libraries
- Rust is now in the Linux kernel
- Many important ecosystem projects: wgpu, WASM, Deno, Servo, Lapce, blockchain tooling
- Many target environment options
- Decent developer ergonomics — not like TypeScript, but good enough

This is an incredibly important decision with wide-ranging implications. Choosing the wrong language can lead to terrible long-term experiences.
