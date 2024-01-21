## Content Notes

## Is it time to rewrite the Operating System in Rust?

URL: https://www.youtube.com/watch?v=HgtRAbE1nBM

Write From Scratch Challenges
- Linux Binay Compatibility as an Anti Corruption Later
- Second System Syndrome

Alternatives
- Rust InKernel Components
- Rust OS Components - rewrite SystemD ? Rust!
- Rust-based Firmware - rewrite OpenBMC? Rust!
- Its harder to write Userland software

## Categorical Machines: An Introduction

URL: https://www.youtube.com/watch?v=UxcpBnNATB0

Author: Rein Gottschalk

- A Category is a Graph of Related Things
- Objects are Nodes, Morphisms are Edges
- Compose
- FP Problem 1: Theres a difference between Lambda Calculus and a Compute Graph
- FP Program 2: Compute Graphs often span >1 Languages
- Code is the "Syntax" Category, Runtime is the "Semantic" Category
- Kleisi Cat - Monad output a "mini cat" from source code to compute graph
- Any Query forms a Category
- Schema (Data) = Type (Programs)
- Categories Examples
    - Monoidal Cats - Ordering of Instructions - Turing Tape - De Brujin Sequence - Tensor Product
    - Closed Cartesian - Set Product (Relational)
    - Trace - Feedback (DataFlow with Backpressure)
- We need a new type of machine - Categorical Machine
- Developer Ergonomics
- Multix - next video

Keywords Mentioned:

- Categories (Cats)
- Convergent Hardware
- Fixed-Point Theory
- OCaml
- Flow-Based Programming
- Compute Graph
- Computational Trinity
- Curry-Howard Correspondence
- Curry-Howard-Lambek
- Differential Curry-Howard-Lambek

References in Video:

- The Craft of Programming - John C. Reynolds
- Category Theory in Context - Emily Riehl
- An Invitation to Applied Category Theory - Brendan Fong, David Spivak
- Categories for the working Mathematician - Saunders Mac Land
- Multics
- NCatLab
    - Site: [https://ncatlab.org/nlab/show/HomePage](https://ncatlab.org/nlab/show/HomePage)
    - Forum: [https://nforum.ncatlab.org](https://nforum.ncatlab.org/)
    - Wiki: [https://en.wikipedia.org/wiki/NLab](https://en.wikipedia.org/wiki/NLab)
    - Git: [https://github.com/ncatlab](https://github.com/ncatlab)

## The First Real Operating Systems

URL: https://www.youtube.com/watch?v=yk0c3yqR4k0

Author: David Evans

- SAGE - Program by US to make a radar detection system after first Atomic USSR test
- multiprogramming solves memory bottleneck
- process abstraction - programs think they own the whole machine
- lack of trust of programs means we need a program which is special, which affords memory isolation and interrupting other programs - supervisor or kernal