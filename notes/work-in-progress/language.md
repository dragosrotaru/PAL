# Language Documentation

## Syntax

Assuming an ASCII encoding:

- all whitespace characters are ignored and used only to separate symbols
- \ the backward slash escapes special characters including itself
- () brackets are used to define a sequence or bound
- "" quotes are used to define an embedding or string
- \# at the beginning of a value is used to define a number
- true and false represent the booleans
- null represents deliberate non-value, i.e. Nothing
- undefined represents unexpected behaviour and meaninglessness

## Undefined Behaviour

There are no such things as Exceptions or Errors in @LangName. Instead, the `undefined` primitive represents any and all unexpected behaviour. Expected, yet unintended behaviours will probably be modelled via something like Algebraic Data Types.

## InterLanguage

This system must support any arbitrary input/file type, format or language. Our system has a type system, which maps arbitrary input to a selection of matching parsers and evaluators. It must also support embedded languages, being able to detect language boundaries. It accepts contextual hints such as file extensions, webrequest file types, and so on. The ideal architecture of this system would be:

input -> parser -> Environment(UAST);

Where the UAST is stored in an enviornment data structure that supports embedded languages.

This enviroment is synced with the filesystem, it exists in memory. We keep the unix philosophy of everything is a file, and overlay it with the philosophy of everything is an object and everything is an AST. this provides new system wide generic interfaces.

The parser and evaluator are programs, and they rely on the default system implementations of parsers and evaluators where available. the parser maps the ASTs to its own UAST format.

