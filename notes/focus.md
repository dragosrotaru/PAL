# Focus

The purpose of this project is to achieve the right initial conditions to produce AGI. The north star is force multiplication.

## Areas of Focus

### Bugs

- fix lambda infinite loop (happens in procedure)
- fix GUI

### Extensibility and Expressiveness

find the correct Kernel or set of abstractions such that the conditions are sufficient enough for the system we envision to develop.

this includes adaptive parsing and grammar, heterogenous compute model, powerful base constructs. If we find the right set of base constructs, we can exponentially increase the expressive power of the system.

#### Host Language

- add embedded js/ts support
- load js/ts modules

#### Parsing

- support non-list parsing, multiple statement parsing
- `quote` and `macro`
- expose `parse` in language

#### Environment

- provide full access to env api
- add restart method
- add ability to access/modify core code
- implement Godel Numbering with Hash functions
- `self`

### Evaluation

- load forms as procedures in the env during compilation
- rewrite the evaluator as a generic pattern-matcher
- fix relationship between apply+procedure
- implement JIT compilation/transpile to js

#### New Features

- provide full access to env and parsing within language
- think about dynamic scoping, env and hashing
- move everything possible out of language implementation and into language implementation (ts modules or actual code)
- add adaptive parsing within the evaluator. Should the evaluator AST be typed with an encoding? i.e. UTF-8? so we can include binary data also?
- should code be evaluated when source is changed? what about garbage collection?
- should I lazy evaluate, and just give the option to eager evaluate by exposing the eval function? or default to eager and use quote? both?
- add memoization for dynamic programming to be built in

### Interfaces

Adding connectivenesss and interfacing capabilities to the system will help to bring in the knowledge needed for the AGI to be possible. We can bootstrap by including external AI systems like ChatGPT.

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
