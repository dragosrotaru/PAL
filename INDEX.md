# Notes Index

_2026-02-28 · 70 notes_

### atom-edge-primitive-data-model.md
`2024-01-21` · data-model, hypergraph, atom, edge, hash
The core data primitives for HyperGraph — everything is either an Atom (content-addressed binary blob with a kind) or a List/Edge (ordered list of hashes with a kind). Types are defined as Atoms whose kind is 'Kind'. A t…

### auto-replication-and-persistence-settings.md
`2024-01-21` · persistence, hyper-ts, replication, p2p, scratch


### browser-isolation-and-component-registry.md
`2024-01-21` · browser, iframe, sandboxing, security, registry
Design for browser-based isolation of untrusted component code using iframes with distinct origins, postMessage for cross-origin communication, and a central component registry. Each component gets a unique domain, TLS, …

### categorical-machines-category-theory-and-compute-graphs-video-notes.md
`2024-01-21` · research, category-theory, categorical-machines, compute-graphs, functional-programming
Notes from "Categorical Machines: An Introduction" by Rein Gottschalk. Core thesis: FP has two problems — (1) there is a gap between lambda calculus and a compute graph, and (2) compute graphs often span more than one la…

### changetheweb-reading-list.md
`2024-01-21` · research, reading-list, p2p, hypergraph, lisp
Curated reading list from the changetheweb.xyz research phase (2019–2020). Covers P2P protocols (Chord, Kademlia, libp2p, GNUNet, Hypercore), hypergraph implementations, functional programming (ADTs, optics, Lisp), crypt…

### changetheweb-seeds.md
`2024-01-21` · scratch, seeds, hypergraph, web, changetheweb


### content-addressed-code-unit-model.md
`2024-01-21` · code-graph, code-units, dependency-graph, mutation-graph, edit-history
A model for treating code as a content-addressed data structure. Each Unit has exactly one export and a hash ID. Units form a DependencyGraph and a MutationGraph over time. EditHistory is a DAG. Save semantics are decomp…

### crdt-research-papers-and-implementations.md
`2024-01-21` · research, crdt, collaborative-editing, distributed-systems, p2p
Curated bibliography of CRDT (Conflict-free Replicated Data Types) research papers and open-source implementations. Covers string-wise CRDTs, causal trees, delta-based CRDTs, operation-based types, and real-time collabor…

### cs-books-reading-list.md
`2024-01-21` · research, books, programming-languages, type-theory, compilers
Core CS book reading list relevant to Pal's language and runtime design. Covers type theory (Types and PLs, TAPL, Practical Foundations), compilers (Dragon Book), SICP, Lisp (The Little Schemer, The Lambda Papers), opera…

### cyberpsychology-and-computational-cognition-research.md
`2024-01-21` · research, cyberpsychology, cognition, psychology-of-programming, human-computer-interaction
References on cyberpsychology — the intersection of psychology, cognition, and computing/internet behavior. Covers academic journals (Cyberpsychology.eu), computational cognition, psychology of programming, and APA caree…

### decentralized-storage-and-git-alternatives.md
`2024-01-21` · research, git, decentralized-storage, p2p, self-hosted
Reference list of Git alternatives, extensions, and decentralized storage systems. Git extensions (git-annex for large files, git-lfs, git-secret for secrets, git-remote-gcrypt for encrypted remotes). Hosting alternative…

### design-goals-and-problems.md
`2024-01-21` · web-vision, design-goals, decentralization, privacy, accessibility
The original design goals and problem statement for changetheweb.xyz. Eight goals: complete decentralization, information integrity, ownership/privacy, interface fluidity, backwards compatibility, new business models, sa…

### elemental-computing-taxonomy-of-primitives.md
`2024-01-21` · computing, primitives, taxonomy, use-cases, human-interface
A first-principles taxonomy of computing. Three elements (information, computation, sensing/actuating), ~20 base use cases (read, store, query, mutate, generate, encode, verify, etc.), virtues of ideal computing systems …

### file-versioning-and-change-group-model.md
`2024-01-21` · versioning, crdt, persistence, hyper-ts, filesystem
File versioning model with configurable granularity and change-group commit semantics before propagation to peers.

### fuse-as-unified-storage-layer.md
`2024-01-21` · fuse, filesystem, database, storage, hyper-ts
The Linux storage stack has too many layers, databases bypass the filesystem API, and data ends up controlled by systems rather than users. HyperFSDB proposes collapsing this by running a FUSE filesystem that is simultan…

### fuse-filesystem-implementation-references.md
`2024-01-21` · research, fuse, filesystem, rust, p2p
Short reference list of FUSE filesystem implementations relevant to pal-fs and hyper-fs. Covers the Rust fuser crate, a Rust filesystem example (gotenksfs), a Google Cloud Storage FUSE driver (gcsf), and P2P filesystem i…

### graph-projection-onto-filesystem.md
`2024-01-21` · filesystem, graph, dependency-graph, fuse, hyper-ts
Hierarchical filesystems force an artificial tree onto what is really a dependency graph — a file can have multiple dependents in different subtrees, which breaks any single organizing principle. The solution is to store…

### hash-addressed-atom-component-model.md
`2024-01-21` · atom, component, iframe, hash, namespace
A browser-based component model where every component ("Atom") is hash-addressed, iframe-isolated, and communicates via postMessage. Components have a global namespace (wild.cards subdomains), versioned by hash, and comp…

### haskell-type-system-and-typeclass-notes.md
`2024-01-21` · research, haskell, type-system, typeclasses, functional-programming
Concise Haskell reference notes covering key type system concepts. No mixed-type lists, default currying, partial application, polymorphic type variables, and core typeclasses (Eq, Ord, Show, Read). Includes function app…

### hypergraph-formal-data-model.md
`2024-01-21` · hypergraph, data-model, encoding, identity, set-theory
Formal treatment of the HyperGraph data model. Binary encoding of Node and Edge with multihash IDs. The `is` identity function and why it requires traversal. Why pure set-theoretic edge definitions are counterproductive …

### hypergraph-interpreter-and-view-runtime.md
`2024-01-21` · hypergraph, interpreter, view, runtime, fsm
Runtime design for a HyperGraph-driven UI — ViewStack with push/pop subscribe/unsubscribe semantics, event-driven command pattern, Global Interpreter Namespace (GIN) signed by a root agent. The tag-in-ID design (type enc…

### hypergraph-use-cases.md
`2024-01-21` · use-cases, hypergraph, namespace, scratch


### ideal-code-editor-feature-requirements.md
`2024-01-21` · editor, ide, requirements, vscode, wingman
Two-part note on editor requirements. First, a list of VSCode extension points relevant to building Pal's IDE layer (Monaco, Language Servers, Debug Adapters, TextMate grammars, XTerm). Second, a list of desirable editor…

### knowledge-management-tools-and-research.md
`2024-01-21` · research, knowledge-management, zettelkasten, tools-for-thought, second-brain
Curated survey of the knowledge management / tools-for-thought space. Personal note-taking tools (Roam, Obsidian, Foam, Logseq, Anytype, org-roam, Dendron), GitHub topics to follow (structural-editor, tool-for-thought, z…

### layered-key-derivation-encryption.md
`2024-01-21` · cryptography, hyper-ts, security, encryption


### linux-os-building-and-minimal-systems.md
`2024-01-21` · research, linux, os, minimal-systems, docker
References for building minimal Linux systems and containers from scratch. Covers rubber-docker (learning containers), BusyBox, Linux From Scratch (lfs, lfs-docker), minimal Linux implementations, OSDev Wiki, Minix3, Bui…

### lisp-as-computing-environment-and-the-lisp-curse.md
`2024-01-21` · research, lisp, lisp-machines, lisp-curse, platforms
Two related threads on Lisp as a total computing environment. First, a hierarchy of levels (Machine → OS → Shell → Editor) with links to Lisp machine implementations (ChrysaLisp, Mezzano, ECMAchine). Second, the "Lisp Cu…

### lisp-os-research.md
`2024-01-21` · research, lisp, operating-system, genera, mezzano
Research on Lisp-based operating systems — from historical Lisp Machines (Genera) to modern attempts (Mezzano in Common Lisp). Relevant to Pal's long-term vision of an environment where the OS and language are unified, a…

### marketplace-access-and-society.md
`2024-01-21` · web-vision, marketplace, access, society, hyperlinks


### miscellaneous-research-links-lambda-calculus-pl-theory.md
`2024-01-21` · research, lambda-calculus, programming-languages, formal-grammars, type-theory
Large reference dump covering lambda calculus and type theory (Church encoding, SKI combinators, CPS, denotational semantics, CoC, ITT, simply typed LC), programming language theory (formal grammars, LALR, context-free, …

### namespace-table-schema-and-operations.md
`2024-01-21` · namespace, hyper-ts, schema, scratch


### naming-petnames-and-resolution.md
`2024-01-21` · web-vision, naming, petnames, url, content-addressing
URLs identify by location, not by content — a fundamental flaw. Content addressing (IPFS-style hashing) solves reference identity. Zooko's triangle says you can only have 2 of 3: human-meaningful, secure, decentralized. …

### neurosymbolic-compiler-combining-formal-and-natural-language.md
`2023-08-02` · neurosymbolic, compiler, llm, natural-language, gpt
Design sketch for a neurosymbolic compiler that accepts arbitrary English intermixed with formal language. Four integration strategies, ranging from easy to expressive: (1) embed LLM as a special form `(gpt ...)`, (2) fa…

### notion-entities-as-hypergraph-encodings.md
`2024-01-21` · notion, encoding, hypergraph, types, hyper-ts
Mapping Notion's content model (Page, List, Text, Media, Code, Equation, Embed) onto HyperGraph nodes and edges with explicit encodings. Useful as a concrete example of how a real product's entity types map to the Atom/E…

### on-agent-accounts.md
`2024-01-21` · web-vision, identity, accounts, agents, password


### open-research-areas-neurosymbolic-and-program-synthesis.md
`2024-01-21` · research, neurosymbolic, program-synthesis, theorem-proving, cognition
A short list of open research directions identified as relevant to Pal — neurosymbolic programming, synthetic data and program synthesis, theorem solvers, how organisms semanticize data, and curiosity as a computational …

### operational-upload-scripts.md
`2024-01-21` · hyper-ts, operational, scripts, fuse, upload
Six operational script specs for HyperFS — bulk upload to content-addressable stores, remote health checks, edge/tag management, watchdog auto-upload, FUSE namespace sync, and garbage collection. Set aside for later.

### os-design-rust-rewrite-and-history-video-notes.md
`2024-01-21` · research, operating-systems, rust, os-history, kernel
Notes from two OS-related videos. First: "Is it time to rewrite the OS in Rust?" — covers the write-from-scratch challenges (Linux binary compatibility as anti-corruption layer, Second System Syndrome) and the practical …

### p2p-network-protocol-peers-petnames.md
`2024-01-21` · p2p, network, protocol, reputation, petnames
P2P protocol design for HyperFS — agent discovery, petname-based addressing, reputation as a routing/access-control primitive, and data sovereignty policies. Interesting because reputation is treated as a spendable curre…

### p2p-protocol-and-host.md
`2024-01-21` · hypergraph, p2p, protocol, host, interpreter
P2P subscription model for HyperGraph nodes. A Host Interpreter subscribes to changes to itself by sending subscriptions to trusted neighbours, filtered by agent signature. Hosts verify signatures and maintain reputation…

### p2p-protocol-landscape-and-network-concepts.md
`2024-01-21` · research, p2p, distributed-systems, dht, gnunet
Survey of P2P protocols and network concepts relevant to Pal's data layer. Covers blockchain/DAG protocols (Ethereum, Holochain, IOTA, Cosmos, Hashgraph), social/identity protocols (Scuttlebutt, Urbit, Ceptr, MetaCurrenc…

### pal-extension-and-plugin-system.md
`2024-01-21` · pal, extensions, plugins, macros, parsers
Design sketch for Pal's extension and plugin system. Extensions sit between Macro and Primitive — each is its own language with a Parser, Writer, unique file extension, and representations in multiple mediums (filesystem…

### pal-language-extension-and-type-system-design.md
`2023-08-12` · pal, type-system, language-extensions, refinement-types, overloading
Deep design notes on Pal's type system and Language Extension model. Types form a hierarchy (Object > Atom/List, Atom > primitives). Extensions can introduce new atom types, refinement types (subsets of existing), new fu…

### pal-language-syntax-specification.md
`2023-08-02` · pal, language, syntax, grammar, s-expressions
Formal syntax specification for the Pal language (ASCII-based S-expression syntax). Covers whitespace rules, escape sequences, sequence brackets, string embedding, number literals (#), booleans, null (deliberate non-valu…

### pal-supported-file-extensions-and-languages.md
`2023-08-12` · pal, extensions, languages, file-formats, first-party-support
Planned first-party extension support for Pal, categorized by type. Host/native languages (Rust, Pal, Pretty DSL), foreign languages (JS/TS/Python), data formats (JSON, CSV, YAML, XML), presentation formats (HTML, SVG, M…

### pal-ts-implementation-task-list.md
`2023-08-04` · pal-ts, backlog, implementation, gui, parsing
Implementation task list for pal-ts across six areas: GUI (styling, save/undo/redo, view/edit capabilities), parsing (multi-statement, streaming, non-ASCII), environment (dynamic scoping, Gödel numbering), evaluation (ge…

### pal-ts-notes.md
`2024-01-21` · pal-ts, language, scratch


### pal-ts-type-system-implementation-backlog.md
`2023-08-12` · pal-ts, backlog, implementation, type-system, extensions
Concrete implementation todos for the pal-ts evaluator, focused on the type system, Language Extensions, REPL, and environment management. Includes fixes (GPT history, type guards, infinite recursion), extension implemen…

### pretty-module-system.md
`2024-01-21` · decision, wingman, pretty, rust, dsl
Explored options for .pretty multi-file module system; decided on .pretty → Rust transpile pipeline using Rust AST.

### process-scoped-namespace-and-binding.md
`2024-01-21` · process, namespace, os, hyper-ts, access-control
A Unix-like process tree where each process owns a scoped namespace subtree, with explicit binding semantics (copy / bind-readonly / bind-readwrite / bind-writeonly / rename) for sharing state across process boundaries. …

### programming-languages-of-interest.md
`2024-01-21` · research, programming-languages, lisp, type-theory, functional-programming
Survey of programming languages studied as influences or alternatives for Pal. Logic/proof languages (Agda, Coq, Prolog), functional (Haskell, OCaml, Erlang, Racket, Scheme, Clojure, Common Lisp, Scala), dataflow (Lucid)…

### programming-model-nodes-names-repl.md
`2024-01-21` · language-design, lisp, nodes, names, identifiers
Original articulation of the Pal programming model. Like Lisp, atoms are Nodes and lists are Edges. A Name is like a Lisp Symbol — resolves to an Identifier, which resolves to Information. The development environment is …

### reinforcement-learning-and-agent-system-model.md
`2024-01-21` · research, reinforcement-learning, agency, agent, systems-theory
Two-part note on agency and reinforcement learning. First, a formal RL glossary (Agent, Environment, Observation, StateSpace, StateModel, DynamicsModel, Intent, Policy, Reward, Gamma, Exploitation/Exploration, Horizon). …

### rust-os-projects-and-tutorials.md
`2024-01-21` · research, rust, operating-system, bare-metal, pal-os
Reference list of Rust-based operating system projects and tutorials. Covers Redox OS (production Rust microkernel), blog_os (Phil Opp's write-an-OS-in-Rust tutorial — highly recommended), osblog, and several experimenta…

### set-theory-study-guide-zfc-and-alternatives.md
`2024-01-21` · research, set-theory, zfc, foundations, mathematics
A self-directed study guide for ZFC set theory and its alternatives. Key topics to understand: ZFC axioms, Russell/Cantor/Burali-Forti paradoxes, Restricted vs Unrestricted Comprehension, Axiom of Choice implications, He…

### transformer-architecture-attention-mechanism-notes.md
`2023-08-02` · research, transformers, machine-learning, attention, neural-networks
Brief notes on the transformer architecture and the self-attention mechanism. Covers embedding with positional encoding, multi-headed attention, query/key/value vectors, score computation (Q×K scaled by √d_k), softmax to…

### typescript-browser-research-and-inspiration.md
`2024-01-21` · typescript, browser, research, structured-clone, monaco
Research notes on running TypeScript in the browser — structured clone limitations for postMessage, TypeScript compiler API links, and inspiration from ObservableHQ, Glitch, and Bit.dev.

### unison-lang-content-addressed-code-and-hash-addressed-ast-discussion.md
`2024-01-21` · research, unison, content-addressed, hash-addressed, ast
HackerNews discussion thread on Unison's core idea of identifying functions by a hash of their AST, and the broader concept of content-addressed code. Key points raised: hash-addressed IPFS AST nodes have high overhead (…

### universal-ast-and-interlanguage-parsing-architecture.md
`2023-08-02` · pal, uast, parsing, interlanguage, filesystem
Architecture for Pal's universal parsing layer. Any arbitrary input/file type maps through a parser into a UAST (Universal AST) stored in an in-memory environment synced with the filesystem. Extends "everything is a file…

### universal-parser-and-interpreter-design-references.md
`2023-08-02` · research, parsers, interpreter, lisp, brain-computer-interface
References for universal parsing and Lisp interpreter design. Covers bblfsh (universal code parser), VSCode language extension API, Rust parser crate index, the William Byrd metacircular evaluator talk that inspired pal-…

### vision.md
`2023-08-09` · vision, motivation, philosophy, wingman, pal-ts
Why Pal exists and what it is — philosophical motivation, core product vision, and scope.

### vscode-and-emacs-keybindings-cheatsheet.md
`2024-01-21` · reference, vscode, emacs, keybindings, editor
Personal keybindings reference for Emacs and VSCode. Covers Emacs modifier notation, and VSCode commands for navigation, file state, content modification, and focus management. Useful context when designing Pal's editor …

### web-browser-engines-and-embedding-frameworks-research.md
`2024-01-21` · research, web-browsers, browser-engines, webkit, blink
Research notes on web browser engines and browser embedding frameworks. Four main engines: WebKit (Apple), Blink (Google, forked from WebKit), Gecko (Mozilla), Servo (originally Mozilla/Project Quantum, now Linux Foundat…

### web-framework-landscape-fullstack-and-lowcode-survey.md
`2024-01-21` · research, web-frameworks, typescript, fullstack, lowcode
Survey of web frameworks from the perspective of eliminating TypeScript project setup boilerplate. Documents the pain of starting a new TS project (monorepo, gitignore, testing, CI/CD, SSR, tree-shaking, etc.) and evalua…

### why-rust-was-chosen-as-pal-host-language.md
`2024-01-21` · pal, rust, host-language, decision, architecture
Rationale for choosing Rust as Pal's host language. Key factors: performance, developer popularity, strong macro support (approximating homoiconicity), strong type system, ML library bindings, Linux kernel inclusion, wid…

### wingman-build.md
`2024-01-27` · decision, wingman, pretty, build, rust


### wingman-control-display-domain-architecture-and-fsm.md
`2024-01-21` · wingman, architecture, fsm, state-machine, command-pattern
Three-layer architecture design for Wingman. Control layer: a Finite State Machine (or Hierarchical SM) driven by winit peripheral events (mouse, keyboard, window, zoom, scroll) — this FSM is also the model the AI uses t…

### wingman-crdt-ast-representation-and-transformer-integration.md
`2024-01-21` · wingman, crdt, ast, representation, transformers
Design for representing source code as a CRDT-backed binary AST. The AST carries unconventional attachments beyond the code itself: test cases, memoized results, debugging data, performance statistics, documentation, exa…

### wingman-editor-ux-philosophy-and-structural-editing-actions.md
`2024-01-21` · wingman, ux, editor, structural-editor, focus
UX philosophy and structural editing action design for Wingman. User actions: close, open controls, undo/redo, unit navigation (token/expression/closure/statement), graph navigation (open definition, references, implemen…

### wingman-pretty-language-and-structural-editor-design.md
`2024-01-21` · wingman, language-design, structural-editor, pretty-dsl, ast
Design notes for the Wingman structural editor's language layer. Includes a concrete example of the `.pretty` DSL applied to a todo app (data types + component layout with reactive bindings like `@todo.completed`). Core …
