# Focus

The purpose of this project is to achieve the right initial conditions to produce AGI. The north star is force multiplication.

## Areas of Focus

### Extensibility and Expressiveness

find the correct Kernel or set of abstractions such that the conditions are sufficient enough for the system we envision to develop.

this includes adaptive parsing and grammar, heterogenous compute model, powerful base constructs. If we find the right set of base constructs, we can exponentially increase the expressive power of the system.

### Interfaces

Adding connectivenesss and interfacing capabilities to the system will help to bring in the knowledge needed for the AGI to be possible. We can bootstrap by including external AI systems like ChatGPT.

- integrate with chatgpt, the web and other knowledge systems
- connect the GUI to the observable environment and make it useful
- extend the integration with the filesystem
- add additional external system integrations

### Intelligence and Automated Serendipity

implementing discovery engines to explore the search space. This includes inference, search, analytical and symbolic solving engines.

- support non-list parsing
- support multiple statement parsing

- think about potential symbol / namespace issues
- think about clojures and environment passing or dynamic scope.
- implement a procedure compare function, perhaps implement a caching/change management system using hashing

- should code be evaluated when source is changed? what about garbage collection?
- should I lazy evaluate, and just give the option to eager evaluate by exposing the eval function? or default to eager and use quote? both?
- implement language server functionality
- load gui, env methods as procedures in the env during compilation

- write out a formal definition of the parser in BNF
- write tests for all possible edge cases
- fix closing bracket behaviour

- neurosymbolic
