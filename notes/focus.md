# Focus

## Areas of Focus

The north star is force multiplication.

- Find the most powerful Kernel possible, pack the language with as much expressiveness and extensibility as possible.
  - Adaptive grammar and parsing
  - Adaptive compute/evaluation model
  - powerful foundational constructs/special forms
  - expose every internal to the language
- Implement powerful interfacing capabilities
  - Adaptive / Generative UX/GUI
  - REPL/CLI
  - VSCode Extension
  - OS Primitives (FileSystem, Processes, Shell)
  - Web Extension
  - Web Browsing
  - Brain-Computer Interface

### Interfaces

### Bugs

- fix lambda infinite loop (happens in procedure)
- fix GUI

#### Host Language

- add support for importing js/ts Procedures
- add support for embedded js/ts
- provide general approach to exposing/accessing js/ts libraries

#### Parsing

- support non-list parsing, multiple statement parsing
- `quote` and `macro`
- expose `parse` in language
- support streaming, non ASCII encodings

#### Environment

- provide full access to env api
- add restart method
- add ability to access/modify core code
- implement Godel Numbering with Hash functions
- consider dynamic scoping vs environment passing
- `self`

### Evaluation

- load forms as procedures in the env during compilation
- rewrite the evaluator as a generic pattern-matcher
- fix relationship between apply+procedure
- implement JIT compilation/transpile to js

#### New Features

- move everything possible out of language implementation and into language implementation (ts modules or actual code)
- add adaptive parsing within the evaluator. Should the evaluator AST be typed with an encoding? i.e. UTF-8? so we can include binary data also?
- should code be evaluated when source is changed? what about garbage collection?
- should I lazy evaluate, and just give the option to eager evaluate by exposing the eval function? or default to eager and use quote? both?
- add memoization for dynamic programming to be built in
- integrate with chatgpt, the web and other knowledge systems
- implement language server functionality
- connect the GUI to the observable environment and make it useful
- extend the integration with the filesystem
- add additional external system integrations

### Intelligence and Automated Serendipity

implementing discovery engines to explore the search space. This includes inference, search, analytical and symbolic solving engines.

- neurosymbolic research. How can we model search? For example I want to (get (age michael jackson)), we can default to chatgpt for now.

#### Theoretical Force Multiplier

- take the definition of every capability of your system and pass it to LLM, generating a description of its utility
- produce a prompt that takes these capabilities and
