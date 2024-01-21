# Work In Progress

## JSON

edge cases for "Is" type guard for Language Extension: [{ a: undefined }] (!JSON & !Core), "" (JSON & Core), { a: "a" } (JSON & !Core), Symbol (!JSON & Core)

These edge cases are not sufficiently expressed in our evalutaion function. We need to think of typechecking a more robust way:

## Type Registry and Language Extensions

Every component mentioned below depends on a central idea of Language Extensions. The big question is how do they work alongside each other? How will they be defined? We need a consistent composable interface, where LanguageExtensions can build on top of each other.

Are Language Extensions the same as types? Should we have a unified type system underlying this?

Object has a type and a value
Object

Object.Atom.String
Object.Atom.String.SpanishWord
Object.Atom.String.EnglishWord
// there can be overlap here already

take "some word" which exists in both types SpanishWrd and EnglishWord

Any words in SpanishWord are also of type string, but not the other way around

Object.Atom.String.Money
Object.Atom.Number.Money
// there cannot be overlap here

Object.Atom.String.SpanishWord
Object.Atom.String.SpanishWord2
Object.Atom.String.SpanishWord.SpanishWord2

What about if there are two types defined which have the same meaning? Are two types equal iff they refer to the same definition? Or are types somehow interchangeable? Do we analyze the type definition to infer that .SpanishWord2 = .SpanishWord.SpanishWord2 for example, if SpanishWord2 is a strict subset of SpaishWord? or do we use opaque types? or do we need to explicitly typecast for any situation where a Type is rooted somewhere other than the same parent?

Atom is a subtype of Object
Each Primitive is a subtype of Atom

List is a subtype of Object
List Composes from Objects

If we define our type system like this, then we can make some observations.
Any LangExt has the capacity to introduce some of the following extensions:

1. A new Atom type : totally new Atom, with an internal representation that deviates from the core primitives. For example, the introduction of "object" in Json, similarly we can introduce a comcept of "Money", which is completely distinct from float, in that it does not operate with the same logic at all, even if the internal representation may be built on some other existing primitives, like a list of [currency, dollars, cents] for example.

2. A Refinement on an Atom Type: For example, a UUID type which is just a subset of Strings, with a specific format. Another example is a URL.

The distinction here is subtle. For example:

(+ Money Money)
(Shorten 10 UUID)
(Hash String)

How should these operations behave? does it make sense to shorten a string? if we shorten a UUID, then it stops being a UUID, so it is implicitly type cast.

Any Function defined on the upsteam type, applied to a downstream type, should return an object of the downstream type unless it passes a typecheck to maintain its type.

We can statically define this:

If we say a type refines another type, then perhaps we can require to specify function signatures which do not modify the type. On the other hand, if we apply the (+ Money Money) operator, it should not work because its not a subtype of the type that + is defined on. However we should be able to overload all identifiers with multiple types!

Which means our simple environment implementation is not sufficient, because if we return the function implementation for a symbol, we should pattern match against its argument types.

1. A new Function type. Again we can overload operators that already exist for particular type matches, or we can define new functions alltogether.

2. A new List (composite) type. we can say that a composite of a particular shape and with particular contents belongs to a specific type. That is,

you can imagine the construction of infinite number of composite types once you have generic List and Primitives with the ability to add new Primitives. However,
those new composites are only "types" if we define them explicity, and add operations to them in particular.

Opaque types are just composite types which forbid access to the internal representation
Everything is just a function: "hello world" = (string.object hello world) (constructor)
(money.object 50.50) => (money.object 50 50)

the constructor function is the Parse function! So then, what about our representation fo

/the/name/space.space/type/the

### Defining a new Type

from Object.String
name Colors
is (lambda (x) (equal x "red" ) ... matches... )
retain ...

define combine a b ... hex combination thing

## Parsing and Writing

This is at the edge of our system - our IO. When we parse and write, we use the `clue` concept, and then a catchall as text. This simplfies the typechecking to a simple lookup, as long as we have a good system to define clues (tags), but this metaphor will break down with allowing embedded languages, unless we enfore tagged embeddings (like codeblocks `js ` for instance).

Perhaps it would be good to introduce a differentiation algorithm, to enable tagless parsing, or tag inference. Definitely, it will be necessary to have a number of aliases for tags and being able to manage them. The other thing is the composability of our parsers - we can define reusable components for primitives. Back to tag inference, this looks a lot like type inference, especially if we start to have multiple subtypes of JSON or CSV for instance, of specific types, Where the parser can work in multiple stages.

## Exposed TypeSystem

What ever guards and type checking we use everywhere in our host, we also will need to expose these constructs in the language itself. Especially typeof and equality, So it is imperative that we have a cohesive type system, not just something thrown together. Perhaps we can bootstrap by relying on a subset of the Typescript type system.

## Defining Variables

We need to be able to type check on defined variables, when they have a type annotation.

- Environment Setting Type Checking
- Function Application Type Checking

- Parse and Write
- Evaluation
- Function Application
- Environment

- JSON.Object should be an opaque primitive, and fix the infinite recursion with IsList.
- research implementing a SemanticJSON (look at prior work first) which fully supports our native types and represents objects as lists

- implement a robust guards and typechecker system
- fix gpt history - not updating
- fix hpt history - quotes around strings

- update repl to accept input type as well

Language Extensions

- implement extensions for JSON and CSV to support undefined and Symbols?
- implement embedded version of pal with backticks ``, i need to do it anyway for quasi-quote, so i might as well implement code blocks ```js

- implement more basic functions so you can write some sanity tests
- write sanity checks to make sure that the lisp implementation is working as expected

- move quasi-special forms into stored procedures and macros when necessary
- test out the macros and fix them if necessary

- flesh out the implementation of the macro/type system

- add a system to manage which functions to load into the environment
- add a system to manage the namespace and protect it
- add a rules system for managing the impedence mismatch between the filesystem model and the env model
