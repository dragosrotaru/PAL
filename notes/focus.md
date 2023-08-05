- fix parsing of word word word
- think about potential symbol / namespace issues
- think about clojures and environment passing or dynamic scope.
- implement a procedure compare function, perhaps implement a caching/change management system using hashing
- connect gui to observable env

- should code be evaluated when source is changed? what about garbage collection?
- should I lazy evaluate, and just give the option to eager evaluate by exposing the eval function? or default to eager and use quote? both?
- implement language server functionality
- load gui, env methods as procedures in the env during compilation

- write out a formal definition of the parser in BNF
- write tests for all possible edge cases
- fix closing bracket behaviour

- neurosymbolic
- extensible
- adaptive parsing, grammar and compute model
