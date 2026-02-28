---
date: 2024-01-21
tags: [research, unison, content-addressed, hash-addressed, ast, ipfs, dag, merkle, programming-languages]
summary: HackerNews discussion thread on Unison's core idea of identifying functions by a hash of their AST, and the broader concept of content-addressed code. Key points raised: hash-addressed IPFS AST nodes have high overhead (confirmed by two independent attempts); cyclic dependencies are impossible in a pure content-addressed DAG (parent hash can't be computed before children), so such a language must prohibit cycles or represent them at a higher abstraction level; a homoiconic/Lisp-like language would be best suited; memoization of (function-hash, data-hash) pairs as a caching strategy; and the vision of a process bootstrapped purely from a hash URL. Directly relevant to Pal's hash-addressed code unit model and the design of hyper-ts.
---

# Unison and content-addressed code: HackerNews discussion

The core Unison idea: functions are uniquely identified by a hash of their AST — code is content-addressed. The HN thread surfaced several important engineering constraints and possibilities.

## Key points from the discussion

**High overhead of hash-addressed AST nodes on IPFS** (brodo, zamalek):
Two independent R&D efforts (one in 2016 with JavaScript+IPFS, one storing an "abstract syntax DAG" with rich syntax nodes) both concluded the overhead is prohibitive. "Failure was a good result."

**Homoiconic/Lisp as the natural fit** (capableweb):
If the language's AST is the same as its source code, you eliminate the gap between representation and content. Lisp-like languages are the natural candidates.

**Pilot language** (zubairq):
An existing JavaScript-based language where all code is content-addressed by SHA-256. Source at yazz.com (GitHub).

**Hash URL as universal function address** (reggieband):
Vision: `http://unison.repo/b89eaac7...` is a stable, globally unique function identifier. A process can bootstrap from a root hash + data hash, download all dependencies, execute, and memoize results at `http://cache/func-hash/data-hash`. Co-routine style dispatch to remote machines becomes trivial.

**The cycle problem** (sparkie):
Content-addressed code requires DAGs — you cannot compute the Merkle root of a parent before computing the hashes of its children, so cycles are structurally impossible. Consequences:
- Languages must eliminate syntax-level cycles (or convert them to DAG-compatible representations)
- OCaml/F# are better suited than most because they enforce dependency ordering between compilation units
- Recursive functions are representable (they produce non-cyclic ASTs); recursive *types* require `and` keywords and are harder
- Designing a new language from scratch allows enforcing this as a language rule

## Link

- Unison Slack: https://app.slack.com/client/TLL09QC85/CNZTD4DJS
