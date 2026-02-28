---
date: 2024-01-21
tags: [research, lambda-calculus, programming-languages, formal-grammars, type-theory, operating-systems, bret-victor, log-structured, worrydream]
summary: Large reference dump covering lambda calculus and type theory (Church encoding, SKI combinators, CPS, denotational semantics, CoC, ITT, simply typed LC), programming language theory (formal grammars, LALR, context-free, compiler-compilers, Racket, Scheme, Clojure, Unison), OS and systems (Plan 9, NixOS, Guix, 9p), log-structured storage (LSM tree), Bret Victor / worrydream (Explorable Explanations, Ladder of Abstraction, Media for Thinking the Unthinkable), and other relevant research directions.
---

# Miscellaneous research links: lambda calculus, PL theory, systems, worrydream

## Lambda calculus and type theory

- [Church encoding](https://en.wikipedia.org/wiki/Church_encoding)
- [Church–Rosser theorem](https://en.wikipedia.org/wiki/Church–Rosser_theorem)
- [Church–Turing thesis](https://en.wikipedia.org/wiki/Church–Turing_thesis)
- [Simply typed lambda calculus](https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus)
- [Deductive lambda calculus](https://en.wikipedia.org/wiki/Deductive_lambda_calculus)
- [Delimited continuation](https://en.wikipedia.org/wiki/Delimited_continuation)
- [Continuation-passing style](https://en.wikipedia.org/wiki/Continuation-passing_style)
- [Denotational semantics](https://en.wikipedia.org/wiki/Denotational_semantics)
- [Calculus of constructions](https://en.wikipedia.org/wiki/Calculus_of_constructions)
- [Intuitionistic type theory](https://en.wikipedia.org/wiki/Intuitionistic_type_theory)
- [Pure type system](https://en.wikipedia.org/wiki/Pure_type_system)
- [System U](https://en.wikipedia.org/wiki/System_U)
- [Brouwer–Heyting–Kolmogorov interpretation](https://en.wikipedia.org/wiki/Brouwer–Heyting–Kolmogorov_interpretation)
- [Intuitionism](https://en.wikipedia.org/wiki/Intuitionism)
- [Gödel's completeness theorem](https://en.wikipedia.org/wiki/Gödel%27s_completeness_theorem)
- [Impredicativity](https://en.wikipedia.org/wiki/Impredicativity)
- [Binary lambda calculus](https://tromp.github.io/cl/Binary_lambda_calculus.html)
- [Iota and Jot](https://en.wikipedia.org/wiki/Iota_and_Jot)
- [SKI combinator calculus](https://en.wikipedia.org/wiki/SKI_combinator_calculus#SKI_expressions)
- [Combinatory logic](https://en.wikipedia.org/wiki/Combinatory_logic)
- [Binary combinatory logic](https://en.wikipedia.org/wiki/Binary_combinatory_logic)
- [Higher-order abstract syntax](https://en.wikipedia.org/wiki/Higher-order_abstract_syntax)
- [De Bruijn index](https://en.wikipedia.org/wiki/De_Bruijn_index)
- [Kolmogorov complexity](https://en.wikipedia.org/wiki/Kolmogorov_complexity)
- [Algorithmic information theory](https://en.wikipedia.org/wiki/Algorithmic_information_theory)
- [General recursive function](https://en.wikipedia.org/wiki/General_recursive_function)
- [Super-recursive algorithm](https://en.wikipedia.org/wiki/Super-recursive_algorithm)
- [Oracle machine](https://en.wikipedia.org/wiki/Oracle_machine)
- [Quantum Turing machine](https://en.wikipedia.org/wiki/Quantum_Turing_machine)
- [Model of computation](https://en.wikipedia.org/wiki/Model_of_computation)
- [Pointer machine](https://en.wikipedia.org/wiki/Pointer_machine)
- [Turing completeness](https://en.wikipedia.org/wiki/Turing_completeness)
- [Turing tarpit](https://en.wikipedia.org/wiki/Turing_tarpit)
- [Model theory](https://en.wikipedia.org/wiki/Model_theory)
- [Axiom schema](https://en.wikipedia.org/wiki/Axiom_schema)
- [Axiomatic system](https://en.wikipedia.org/wiki/Axiomatic_system)
- [Constructivism (philosophy of mathematics)](https://en.wikipedia.org/wiki/Constructivism_(philosophy_of_mathematics))
- [Self-reference](https://en.wikipedia.org/wiki/Self-reference)
- [Unlambda](https://en.wikipedia.org/wiki/Unlambda)
- [Iota and Jot](http://www.nyu.edu/projects/barker/Iota/)
- [Lambda NYU](http://www.nyu.edu/projects/barker/Lambda/)
- [Reduceron](https://github.com/tommythorn/Reduceron) — graph reduction hardware
- [learn-tt](https://github.com/jozefg/learn-tt)
- [PLFA](https://plfa.github.io/) — Programming Language Foundations in Agda
- [F*](https://www.fstar-lang.org) — proof-oriented language
- [Project Everest](https://project-everest.github.io) — verified HTTPS
- [Functional geometry (Gambit Scheme)](https://github.com/georgjz/functional-geometry-gambit-scheme)
- [On Lisp — Paul Graham](http://www.paulgraham.com/onlisp.html)

## Formal grammars and parsing

- [Formal grammar](https://en.wikipedia.org/wiki/Formal_grammar)
- [Context-free grammar](https://en.wikipedia.org/wiki/Context-free_grammar)
- [Regular language](https://en.wikipedia.org/wiki/Regular_language)
- [Unrestricted grammar](https://en.wikipedia.org/wiki/Unrestricted_grammar)
- [Rewriting](https://en.wikipedia.org/wiki/Rewriting)
- [Graph rewriting](https://en.wikipedia.org/wiki/Graph_rewriting)
- [Semi-Thue system](https://en.wikipedia.org/wiki/Semi-Thue_system)
- [LALR parser](https://en.wikipedia.org/wiki/LALR_parser)
- [Compiler-compiler](https://en.wikipedia.org/wiki/Compiler-compiler)
- [GNU Bison](https://en.wikipedia.org/wiki/GNU_Bison)
- [Metalanguage](https://en.wikipedia.org/wiki/Metalanguage)
- [Metasyntax](https://en.wikipedia.org/wiki/Metasyntax)
- [ASN.1](https://en.wikipedia.org/wiki/ASN.1)
- [Abstract syntax](https://en.wikipedia.org/wiki/Abstract_syntax)
- [Abstract semantic graph](https://en.wikipedia.org/wiki/Abstract_semantic_graph)
- [Abstract machine](https://en.wikipedia.org/wiki/Abstract_machine)

## Programming languages

- [Racket](https://racket-lang.org/) / [Racket wiki](https://en.wikipedia.org/wiki/Racket_(programming_language))
- [Scheme](https://en.wikipedia.org/wiki/Scheme_(programming_language))
- [Clojure](https://en.wikipedia.org/wiki/Clojure)
- [GNU Guile](https://en.wikipedia.org/wiki/GNU_Guile)
- [Wolfram Language](https://en.wikipedia.org/wiki/Wolfram_Language)
- [Unison](https://www.unisonweb.org/)
- [Clash (Haskell → HDL)](https://clash-lang.org/)
- [SharpScript](https://sharpscript.net/)
- [Hazel](https://hazel.org) — live functional programming environment with holes
- [Nile](https://github.com/damelang/nile) — graphics language
- [Pure Function Pipeline Dataflow](https://github.com/linpengcheng/PurefunctionPipelineDataflow)
- [GNU Hurd Coyotos microkernel](https://www.gnu.org/software/hurd/microkernel/coyotos.html)
- [Guix](https://guix.gnu.org) — functional package manager
- [NixOS](https://nixos.org)
- [Intentional programming (Usenix DSL '97)](https://www.usenix.org/conference/dsl-97/invited-talk-intentional-programming-ecology-abstractions)
- [isomorf.io](https://isomorf.io/#!) — structural editor
- [BetterThanJson](https://wiki.alopex.li/BetterThanJson)
- [msgpack](https://msgpack.org/index.html)

## Systems and OS

- [Plan 9](https://9p.io/plan9/index.html)
- [9p protocol](https://en.wikipedia.org/wiki/9P_(protocol))
- [The UNIX-HATERS Handbook](https://en.wikipedia.org/wiki/The_UNIX-HATERS_Handbook)
- [House (Haskell OS)](https://en.wikipedia.org/wiki/House_(operating_system))
- [AROS](http://www.aros.org/introduction/) — Amiga Research OS
- [Tagged architecture](https://en.wikipedia.org/wiki/Tagged_architecture)
- [ZFS](https://en.wikipedia.org/wiki/ZFS)
- [Trusting freelibre RISC-V](https://insights.sei.cmu.edu/sei_blog/2019/10/how-to-build-a-trustworthy-freelibre-linux-capable-64-bit-risc-v-computer.html)
- [SiFive RISC-V](https://www.sifive.com/)
- [Pijul version control](https://initialcommit.com/blog/pijul-version-control-system)

## Log-structured storage

- [The Log (LinkedIn engineering)](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)
- [Log-structured merge-tree](https://en.wikipedia.org/wiki/Log-structured_merge-tree)
- [scaling.dev/storage/log](https://scaling.dev/storage/log)
- [LevelDB/LevelUp](https://github.com/Level/LevelUp)
- [content-addressable-blob-store](https://github.com/mafintosh/content-addressable-blob-store)
- [blocks](https://github.com/greglook/blocks) — content-addressed block store
- [B-tree](https://en.wikipedia.org/wiki/B-tree) / [B+ tree](https://en.wikipedia.org/wiki/B%2B_tree)

## Bret Victor / worrydream

- [worrydream.com](http://worrydream.com/)
- [Explorable Explanations](http://worrydream.com/ExplorableExplanations/)
- [Ladder of Abstraction](http://worrydream.com/LadderOfAbstraction/)
- [Media for Thinking the Unthinkable](http://worrydream.com/MediaForThinkingTheUnthinkable/)
- [Media for Thinking the Unthinkable (notes)](http://worrydream.com/MediaForThinkingTheUnthinkable/note.html)
- [Climate Change](http://worrydream.com/#!/ClimateChange)
- [Dynamicland](https://dynamicland.org/)
- [Media for Thinking the Unthinkable (Vimeo)](https://vimeo.com/67076984)
- [Stop Drawing Dead Fish (Vimeo)](https://vimeo.com/64895205)

## Hash consing and value numbering

- Hash Consing and Value Numbering — topic to research
- Abstract Syntax Tree as Interlingua — topic to research
- Universal Abstract Syntax Tree — topic to research
- [Hash Consing (Haskell Reddit)](https://www.reddit.com/r/haskell/comments/2eodv2/what_do_you_think_about_hashconsing_every)

## Collaborative browsing

- [Cobrowsing](https://en.wikipedia.org/wiki/Cobrowsing)
- [Collaborative browsing with open source](https://stackoverflow.com/questions/45934584/implement-collaborative-browsing-using-opensource-technologies)
- [TogetherJS](https://togetherjs.com/)
- [What is the best co-browsing tool](https://www.quora.com/What-is-the-best-co-browsing-tool-to-use-when-talking-chatting)

## Programming concepts

- [Internal Reprogrammability — Martin Fowler](https://martinfowler.com/bliki/InternalReprogrammability.html)
- [The Web of Names — Joe Armstrong](https://joearms.github.io/published/2015-03-12-The_web_of_names.html)
- [Twelve leverage points](https://en.wikipedia.org/wiki/Twelve_leverage_points)
- [Build your own X](https://github.com/danistefanovic/build-your-own-x)
- [Write yourself a Git](https://wyag.thb.lt/)
- [Rethinking OS design in a functional way (Reddit)](https://www.reddit.com/r/haskell/comments/74pe20/rethinking_os_design_in_a_functional_way/)
- [Rethinking the shell pipeline (Reddit)](https://www.reddit.com/r/programming/comments/y1fd7/rethinking_the_shell_pipeline/)
- [Comparison of command shells](https://en.wikipedia.org/wiki/Comparison_of_command_shells)
- [Scsh](https://en.wikipedia.org/wiki/Scsh)
- [Fish shell](https://en.wikipedia.org/wiki/Fish_(Unix_shell))
- [Bourne shell](https://en.wikipedia.org/wiki/Bourne_shell)
- [Paredit on Emacs](https://www.emacswiki.org/emacs/ParEdit)
- [Org-mode](http://doc.norang.ca/org-mode.html)
- [Closure (programming)](https://en.wikipedia.org/wiki/Closure_(computer_programming))
- [Capability theory](http://cap-lore.com/CapTheory/upenn/)
- [SecureOS](http://fare.tunes.org/tmp/emergent/secureos.htm)
- [Squeak](https://squeak.org) — Smalltalk environment
- [CodeQL / Semmle](https://github.com/github/codeql)

## Misc

- [Ciechanowski blog](https://ciechanow.ski) — beautiful interactive explanations
- [This Person Does Not Exist](https://thispersondoesnotexist.com/)
- [Active Ball Joint Mechanism](https://www.reddit.com/r/interestingasfuck/comments/o3kjnm/active_ball_joint_mechanism_based_on_spherical/)
- [HalfBakery](https://www.halfbakery.com/) — ideas site
- [Invisible College](https://invisible.college)
- [Datasets (QuantumStat)](https://datasets.quantumstat.com/)
- [CrossMinds AI](https://crossminds.ai/)
- [Emoji rendering](https://tonsky.me/blog/emoji)
- [Pockit modular computer](https://pockit.ai)
- [Fractal D2D social networks](https://deepai.org/publication/on-the-capacity-of-fractal-d2d-social-networks-with-hierarchical-communications)
- [What is an Individual? (Quanta)](https://www.quantamagazine.org/what-is-an-individual-biology-seeks-clues-in-information-theory-20200716/)
- [L-Systems](https://www.complexityexplorer.org/explore/virtual-laboratory/143-l-systems)
- [Gig economy (literary)](https://zerohplovecraft.wordpress.com/2018/05/11/the-gig-economy-2/)
- [code-server](https://github.com/cdr/code-server) — VS Code in the browser
- [22120 browser archiver](https://github.com/c9fe/22120)
- [Monaco editor](https://github.com/microsoft/monaco-editor)
- [Shift-ctrl-f (semantic search)](https://github.com/model-zoo/shift-ctrl-f)
- [Grammarly API](https://github.com/stewartmcgown/grammarly-api)
- [Niambus web](https://nimbusweb.me)
- [Real World Tech](https://www.realworldtech.com/category/software/)
- [AOSABOOK](https://aosabook.org) — Architecture of Open Source Applications
