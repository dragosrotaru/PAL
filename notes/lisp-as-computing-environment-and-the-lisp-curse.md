---
date: 2024-01-21
tags: [research, lisp, lisp-machines, lisp-curse, platforms, computing-environment, pal]
summary: Two related threads on Lisp as a total computing environment. First, a hierarchy of levels (Machine → OS → Shell → Editor) with links to Lisp machine implementations (ChrysaLisp, Mezzano, ECMAchine). Second, the "Lisp Curse" — Lisp's power made it too fragmented to coalesce around a platform. The counter-argument: "The Lisp Machines demonstrated that an entire computing environment could be comprehensible in one language all the way down. They lost and utter crap won out." Directly motivates Pal's approach of building the platform, not just the language.
---

# Lisp as computing environment and the Lisp curse

## Lisp at every level

A computing environment could theoretically be Lisp all the way down:

- Machine
- OS
- Shell
- Editor

### Implementations and references

- [cpus-caddr](https://github.com/lisper/cpus-caddr) — CADR Lisp Machine FPGA implementation
- [3L Project](https://3lproject.org) — Lisp-based OS
- [ChrysaLisp](https://github.com/vygr/ChrysaLisp) — parallel CPU/GPU Lisp OS
- [Mezzano](https://github.com/froggey/Mezzano) — Common Lisp OS
- [ECMAchine](https://github.com/AlexNisnevich/ECMAchine) — Lisp OS in the browser
- [Awesome Lisp Machine](https://github.com/ghosthamlet/awesome-lisp-machine)

### A reasonable stack (GNU ecosystem)

- GNU Guile — Scheme interpreter
- GNU Guix — functional package manager (Guile-based)
- GNU Emacs — extensible editor
- StumpWM, GuileWM, or EXWM — Lisp window managers
- GNUCash — accounting

## The Lisp Curse

> Lisp is so powerful that problems which are technical issues in other programming languages are social issues in Lisp.

Lisp hasn't succeeded because it's too good. Too powerful = too many divergent paths = no platform coalesces.

> Making Scheme object-oriented is a sophomore homework assignment. On the other hand, adding object orientation to C requires the programming chops of Bjarne Stroustrup.

Counter: ObjC started as just a preprocessor by Brad Cox. "OO C" has been done many times, just like in Lisp. ObjC succeeded because NeXT and then Apple invested in it as a platform — not because of the language.

We use ObjC because it lets us do cool things on macOS/iOS. We use JavaScript not because it's great, but because it runs in web pages. Build something awesome in Lisp that's not just a self-referential modification of Lisp (cough, Arc) and you'll get traction — like Ruby did with Rails.

> **The language was not the point — the platforms were the point.**

When toolmakers spend too much time making tools instead of using them for their intended purpose, they lose track of many realities. Less is more.

On Turing-complete type systems: research in PLT centers around avoiding Turing-completeness in the type checker to ensure termination (Haskell, Coq, Agda). The focus on arbitrarily powerful type-level computation misses the point.

> **The Lisp machines are the point. They were a platform that demonstrated that an entire computing environment could be comprehensible in one language all the way down. They lost and utter crap won out.**

This is the core motivation for Pal — build the platform, not just the language.
