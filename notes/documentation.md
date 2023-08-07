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
