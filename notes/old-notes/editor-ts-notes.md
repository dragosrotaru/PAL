# Editor.ts file Notes

learn about the valid import values

commonJS is baked into NodeJS, and is synchronous

typescript

I now need to close the loop between CC and DC

CC has direct access to DC
DC can be converted into running code at runtime
DC can be saved to folder at runtime via server

Option 1: Make data code available to the runtime through a dev-server/electron approach
Option 2: Store data code on a backend and make all code code which shares types with data code "virtual"

1. use tsconfig + tsc to compile compiler

- learn about webworkers/iframes

There is a gloabl namespace: wild.cards
Every person and group has a unique subdomain: vivcrowe.wild.cards
Every subdomain has its own namespace
Atoms have possible views: a terminal, an editor and/or a custom rendered html UI
Every Atom has source code and may implement one of a number of standard interfaces:
- cell: able to send and receive messages with postMessage/API
- stateful: serializeable and deserializeable into JSON for persistance
- renderable: able to display in an iframe 
Every Atom may have methods accessible from the terminal

Atoms have hash names for every iteration of the source code
they can depend on other Atoms, import external code from npm/ urls.
They can be given a name within a namespace, maybe it is even enforced once you save once.

So once you save, you save an Atom with metadata and source code

The metadata includes:

- interfaces implemented (using postMessage/api event/command/query types)
- static imports (internal and external)
- content security policy
- permissions policy
- hash versioning and tagging
- publish/sharing policy

Atoms compose as follows:

- iframe url reference
- import statements
- postMessage Events
- api calls

- Atoms can register to send events to only certain targets
- Atoms can display render other atoms via iframes (or React wrapper container, for instance)
- Atoms can even render a completely different website, as long as its registered
- Every Internal Node of the Namespace is a collection. This can behave as a message bus or Page UI
- The default behaviour of Collections is that they Render flattened when they are nested


there is a marketplace with code reviews for using atoms

TODO

- write typeguard
- add localhost storage
- guarantee model has checked errors before running or saving
- run the code in an iframe or webworker
- add module resolution
- enforce one export per "file"
- add key to save and to run
- add linting on save
- you could execute the code in sandbox and postMessage, but the data types will be restricted
- you could return React Components


The structured clone algorithm is an algorithm defined by the HTML5 specification for copying complex JavaScript objects. It is used internally when transferring data to and from Workers via postMessage() or when storing objects with IndexedDB. It builds up a clone by recursing through the input object while maintaining a map of previously visited references in order to avoid infinitely traversing cycles.

Things that don't work with structured clone

- Error and Function objects cannot be duplicated by the structured clone algorithm; attempting to do so will throw a DATA_CLONE_ERR exception.
- Attempting to clone DOM nodes will likewise throw a DATA_CLONE_ERR exception.
- Certain parameters of objects are not preserved:
  - Property descriptors, setters, and getters (as well as similar metadata-like features) are not duplicated. For example, if an object is marked read-only using a property descriptor, it will be read-write in the duplicate, since that's the default condition.
  - The prototype chain does not get walked and duplicated.

Supported types

All primitive types (Note: However not symbols)
Boolean object
String object
Date
RegExp (Note: The lastIndex field is not preserved.)
Blob
File
FileList
ArrayBuffer
ArrayBufferView (Note: This basically means all typed arrays like Int32Array etc.)
ImageData
Array
Object (Note: This just includes plain objects (e.g. from object literals))
Map
Set


DOCS

https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler
https://github.com/peterholak/ts-play
https://github.com/fabiandev/typescript-playground
https://github.com/microsoft/TypeScript-Website/tree/v2/packages/playground
https://github.com/cancerberoSgx/typescript-in-the-browser
https://github.com/Microsoft/monaco-editor-samples/

INSPIRATION

https://observablehq.com/product
https://glitch.com/
https://bit.dev/
