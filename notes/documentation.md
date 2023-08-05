# Language Documentation

@LangName is intended to be a research environment for General Artificial Intelligence. This may sound stupid. Why would you build an AGI in Typescript? Thats for me to know, and for you to find out (when I document it) ;)

## Undefined Behaviour

There are no such things as Exceptions or Errors in @LangName. Instead, the `undefined` primitive represents any and all unexpected behaviour. Expected, yet unintended behaviours will probably be modelled via something like Algebraic Data Types.

## Main Features

- GUI can directly modify program state
- be able to seamlessly extend the language by using typescript modules
- the REPL, environment, filesystem, program state, interpreter and source code are all tied together in a live environment. Changes apply simultaneously across all of these aspects.

## Architecture

Every object in the environment is an Observable, so when it is modified the source can also be modified.
Some objects are external, for example Notion

## Data Types

In HyperLang, operators are constrained to the type. So boolean operators (and, or, not, etc) only work with boolean data, numerical operators (add, subtract, multiply) on numerical data. The behaviour can easily be changed.

### symbol

symbols are references to anything. they all have unique names within their scope and are stored in the Environment. There are no reserved keywords in hyperlang, so everything can be written over. The namespace is made up of 3 parts:

1. the interpreter core, which as mentioned can be written over but will reset on restart unless the interpreter source code is changed.
2. the filesystem (source code), which can be written over from within the language itself
3. the ephemeral in-memory objects, which disappear on restart

symbols cannot include spaces

### list

lists contain anything, including other lists. they form the primary data structure.

`( a b c )`

### set

### boolean

`true` or `false`

### number

numbers are defined by the `#` character;

- `#3.3` will be read as in integer (3)
- `##45.654` will be reas as a float (35.654)
- NaN is also possible

### null

`undefined` does not exist, only null

### string

any string is possible

### procedure

### object
