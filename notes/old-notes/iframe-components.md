# IFrame Components

## Implement

- Atom
  - Hide/Show Editor/Terminal
- Atom Type: Markdown
- Atom Type: MDX (Markdown+JSX)
- Atom Type: P2P Collaborative Editing Data Structure 
- Atom Edit History Graph View
- Electron App

## Browser Options for Saving Data

- In Memory
- IndexedDB
- LocalStorage
- FileSystem API
- File System Access API
- Localhost Server
- Internet Server

- Every "unit" is a piece of typescript code with (optionally) multiple imports and a single default export
- An unit may include data like my personal inventory list, a reusable UI component, a shared type.
- a unit can be named or just a hash
- there are tricks to combine scope of units to avoid excessive imports?
- mutable, viewOf are interesting
- lazy imports (runs when called)
- import-with to use notebook as template with code: import {chart as histogram} with {numbers as data, height} from "@d3/histogram"
- editor experience does not require creating a sandbox to run the code, unless code is executed.
- every unit receives

The core of the program is responsible for:

- providing a sandboxed editing environment to edit the code
  (sandboxed due to exposures in language service itself and module resolution/importing/autocomplete in the editor)
- resolving import statement dependencies
- providing a sandboxed execution environment to run typescript code
- providing file versioning
- providing namespacing, contexts
- framework for rendering and interfaces for passing data
- shareable data structures

NameSpace

https://github.com/observablehq/runtime
https://explorabl.es/

On Observable, each cell is a unit that can be evaluated independently, with two sides to it — you have the source code editor, and you have the rendered display (either a chunk of DOM or canvas that you’ve drawn, or an interactive inspector for JS values).

We could use iframes and WebWorkers to isolate pieces of code running on a single webpage in a browser.
We would need to disallow clickjacking by adding "X-Frame-Options: DENY" to non-embeddable webpage http
We could isolate untrusted code on its own domain name. iframes inside a host doesn't have access to its host DOM,
state, or even navigation. hosts don't have access to their children either, unless they are on the same origin.
This does not include subdomains (must be the exact same full domain)
You can change the location of the child iframe even if not same origin.
If the second-level domain is the same (peter.wild.cards, john.wild.cards, wild.cards), you can make them be treated
as same origin by setting document.domain = 'wild.cards';

We can use the top property to check if the current document is open inside a frame or not:
if (window == top) { // current window == window.top?

n empty "sandbox" attribute puts the strictest limitations possible, but we can put a space-delimited list of those that we want to lift.

Here’s a list of limitations:

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe

he postMessage interface allows windows to talk to each other no matter which origin they are from.
targetOrigin should be set so that if you send a message to a window, and it navigated to a different page,
it wouldn't see the result unless it was stil in the same origin

- the parent container is on a secure domain, not embeddable.
- iframes cannot access other iframes, unless they are on the same domain.

# Components

- found in a central registry.
- can create a subcomponent in an iframe.
- files and services are served from its unique domain: https://<hash>.reference.design/index.html
- use TLS encryption.
- must declare its external dependencies, permissions, etc.

# IFrame

http://langsec.org/

So the framework would have:

- a javascript api to work with and inside the iframes (with JSX support?0
- a manifest.json file
- a registry manager like npm
- an event

Atoms can postMessage to NameSpace in order to present themselves as they wish in the tree

- Setup XTerm search https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-search