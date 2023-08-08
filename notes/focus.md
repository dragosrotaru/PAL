# Focus

## Areas of Focus

The north star is force multiplication.

- Find the most powerful Kernel possible, pack the language with as much expressiveness and extensibility as possible.
  - Adaptive grammar and universal parsing
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
  - External Systems
- Automation and Intelligence
  - Search, Analytics, Inference, Symbolic Engines
  - TaskGPT, CodeGPT, Etc
  - Generative Loops

#### Theoretical Force Multiplier

- take the definition of every capability of your system and pass it to LLM, generating a description of its utility
- produce a prompt that takes these capabilities and

## Useability

- add notion import/integration so I can actually use it with my personal data

## GUI

- add basic style
- show if object is ephemeral or persisted
- add save capability
- add rename capability
- add undo/redo capability
- add execute capability
- add navigate-to capability
- add navigate-within capability
- view capability
  - filter
  - sort
  - scroll through view variants
- edit content capability

  - structured text edit
  - drag to rearrange

- add authenticaton/security to the web endpoints - prevent leaks of .env for instance
- support showing special identifiers (from special forms) (define them as members of the environment instead of implicitly)
- remove webextensions.restrictedDomains localhost, fix conflict between import map and extensions or do it differentlys

## Parsing

- support non-list parsing, multiple statement parsing
- support \n as whitespace
- add `macro`
- support streaming, non ASCII encodings

## Environment

- provide full access to env api
- add `restart`
- add ability to access/modify core code
- implement Godel Numbering with Hash functions
- consider dynamic scoping vs environment passing

## Evaluation

- fix `TypeError: Cannot read properties of undefined (reading '1')` from `(define fun (lambda (x) (eval (gpt x) ) ) )`

- implement a typesystem and rewrite the evaluator as a generic pattern-matcher
- load forms as procedures in the env during compilation
- fix relationship between apply+procedure
- make it lazy evaluate

- add support for importing js/ts Procedures
- add support for embedded js/ts
- provide general approach to exposing/accessing js/ts libraries

- achieve metacircular status
- implement JIT compilation/transpile to js

## FileSystem

- implement multiple file loading
- implement namespace transformations
- implement `save` command

## Commands

- `exit` and `quit`

## New Features

- garbage collection
- memoization for dynamic programming by default
- implement language server functionality
- integrate git
