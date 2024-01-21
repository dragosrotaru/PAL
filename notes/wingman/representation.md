Source Code will be represented as an abstract syntax tree stored in a binary format.
This AST is also a CRDT.

Components:

- current_state: CRDT -> AST - go from the time-domain to the state-domain
- macro: AST -> Rust - go from the state-domain to pre-compiled rust 
- eval_expr: AST -> AST - go from state-domain to evaluated

The AST will have some unconventional features:

- test cases
- memoized results
- debugging data
- performance / statistics 
- documentation
- examples
- conversations
- previous versions
- other language implementations

ALL of these aspects of the code are attached to the AST. 

Views are projections of the Graph:

- dependency view
- types view
- tests view
- documentation view
- etc

For the integration of Transformers into the tooling, we can think about the general task of compressing
the AST into a context window for any number of predefined tasks, each with a specific prompt. The output
can be the modification of the AST. 


https://automerge.org/
https://github.com/maidsafe/crdt_tree
https://madebyevan.com/algos/crdt-mutable-tree-hierarchy/
https://martin.kleppmann.com/papers/move-op.pdf
https://soft.vub.ac.be/Publications/2022/vub-tr-soft-22-17.pdf


What are the downsides to this approach?

1. version control
2. deployment

In a team environment used to git workflows, CI/CD, etc I can see how such a wildly different approach might be undesireable. There are a number of affordances that should be implemented for widespread adoption. I wont concern myself with these in the initial version, But perhaps in the future I could add them. The biggest is export capability. This could be ejecting to Rust (or whatever language), which might be ugly. 

