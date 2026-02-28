---
date: 2024-01-21
tags: [research, category-theory, categorical-machines, compute-graphs, functional-programming, type-theory, flow-based-programming]
summary: Notes from "Categorical Machines: An Introduction" by Rein Gottschalk. Core thesis: FP has two problems — (1) there is a gap between lambda calculus and a compute graph, and (2) compute graphs often span more than one language. Solution: a "categorical machine" that bridges syntax (code category) and semantics (runtime category) via Kleisli categories (monads). Key insights: schema=type, any query forms a category, monoidal categories model instruction ordering (Turing tape, de Bruijn sequence, tensor product), closed Cartesian categories model set products (relational), trace categories model feedback/dataflow with backpressure. Keywords: Curry-Howard-Lambek correspondence, differential CHC, fixed-point theory, flow-based programming, convergent hardware. Important as theoretical grounding for Pal's approach to unifying code and data via a graph model.
---

# Categorical machines: category theory and compute graphs (video notes)

**Video:** [Categorical Machines: An Introduction](https://www.youtube.com/watch?v=UxcpBnNATB0) — Rein Gottschalk

## Core ideas

- A category is a graph of related things — objects are nodes, morphisms are edges, and they compose
- **FP Problem 1:** There is a difference between lambda calculus and a compute graph
- **FP Problem 2:** Compute graphs often span more than one language
- Code is the "syntax" category; runtime is the "semantic" category
- Kleisli categories (monads) output a "mini-category" mapping source code to compute graph
- Any query forms a category
- **Schema (data) = Type (programs)** — data schemas and program types are the same thing
- We need a new kind of machine: a **categorical machine**

## Category examples

| Category type | Models |
|---|---|
| Monoidal | Ordering of instructions — Turing tape, de Bruijn sequence, tensor product |
| Closed Cartesian | Set product (relational model) |
| Trace | Feedback / dataflow with backpressure |

## Keywords mentioned

- Categories (cats), convergent hardware, fixed-point theory
- OCaml, flow-based programming, compute graph
- Computational trinity, Curry-Howard correspondence, Curry-Howard-Lambek
- Differential Curry-Howard-Lambek
- Multics (next video: Multix)

## References

- *The Craft of Programming* — John C. Reynolds
- *Category Theory in Context* — Emily Riehl
- *An Invitation to Applied Category Theory* — Brendan Fong, David Spivak
- *Categories for the Working Mathematician* — Saunders Mac Lane
- [nCatLab](https://ncatlab.org/nlab/show/HomePage) — [forum](https://nforum.ncatlab.org) · [wiki](https://en.wikipedia.org/wiki/NLab) · [git](https://github.com/ncatlab)
