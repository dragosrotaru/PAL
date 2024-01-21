# Random Notes

In JS we can still represent as arrays, cuz they are objects, so just change the prototype and add .opaque

We can completely ignore whitespace beyond one space between tokens. Everything else is just useless, except for artistic purposes. We can consider those a special case, and accommodate later, no need to build the system around that.

Haskell doesn't allow mixed type lists
Lists are different than ntouples
Singleton touples are not allowed
List ops don't automatically work on touples

Currying is default, which is related to lazy eval I guess: FN :: String -> String -> String

Partial application makes so much sense

No distinction between params and returns

    ghci> :t head  
    head :: [a] -> a  
Lower case a is a type variable - polymorphic type

Haskell has a concept of typeclass : eq is a typeclass that does not include monads or functions

Ord is a class for ordering, must have equality (subclass)

Show and Read (parser and writer) are also classes

If, case and pattern match build on each other

Where and let are useful constructs

$ for lowest priority function application 
. For function composition

- fix weird json glitch
- give it the namespace in context and allow chatgpt to query "filesystem" so it doesn't have to understand the concept of environment
- manually specify files into context
- be able to select the code block of gpt
- give it ability to lint/typecheck it's JS code


Add parser types
Add restart


We need to figure out the semantics of the environment and filesystem first, let's get that down pat 

Then the language needs to be worked on 

We need to get to the point where we can use AI to generate the rest of it on top of that, which can only be done if we can generate code save it, experiment with it effortlessly.

The UI will come as a natural consequence of that.

Implement a language server for the language, then a  client for the supported languages.

Implement a universal parser 

https://github.com/jaked/programmable-matter
https://jaked.org/blog/2021-09-07-Reconstructing-TypeScript-part-0

Languages I like
Racket
Haskell
Unison

Try ink terminal react