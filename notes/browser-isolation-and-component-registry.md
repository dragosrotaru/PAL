---
date: 2024-01-21
tags: [browser, iframe, sandboxing, security, registry, postMessage, isolation]
summary: Design for browser-based isolation of untrusted component code using iframes with distinct origins, postMessage for cross-origin communication, and a central component registry. Each component gets a unique domain, TLS, and must declare dependencies and permissions.
---

# Browser isolation and component registry

## Core responsibilities

The host environment provides:
- Sandboxed editing environment (TypeScript language service has security exposures)
- Dependency resolution (import statement graph)
- Sandboxed execution environment for running TypeScript
- File versioning
- Namespacing and contexts
- Rendering framework + interfaces for passing data
- Shareable data structures

## Isolation strategy

Isolate untrusted code by hosting each component on its own unique domain:
- `https://<hash>.reference.design/index.html`
- iframes on different origins cannot access each other's DOM, state, or navigation
- Host cannot access child iframe internals unless same origin
- Same second-level domain trick: `document.domain = 'wild.cards'` to treat subdomains as same origin when needed
- You can change the location of a child iframe even if not same origin

Key HTTP headers:
- `X-Frame-Options: DENY` on non-embeddable pages

iframe sandbox attribute — empty = strictest, whitelist to lift restrictions. See [MDN iframe docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).

Use the `top` property to check if the current document is open inside a frame:
```js
if (window == top) { // current window == window.top?
```

## postMessage

`targetOrigin` should always be set — prevents message interception if the target navigates away. Pattern: `window.postMessage(data, targetOrigin)`.

- Parent container: secure domain, not embeddable
- iframes cannot communicate with each other unless same domain

## Component registry

- Components found in a central registry
- Each component can create subcomponents in child iframes
- Components served from their unique domain with TLS
- Components must declare: external dependencies, permissions, interfaces
- Registry manager analogous to npm

The framework provides:
- A JavaScript API to work with and inside iframes (with JSX support)
- A `manifest.json` file
- A registry manager like npm
- An event system

Atoms can postMessage to NameSpace in order to present themselves as they wish in the tree.

See also: http://langsec.org/ (language-theoretic security — relevant for parsing untrusted input at iframe boundaries)

## Browser storage options

- In Memory
- IndexedDB
- LocalStorage
- FileSystem API / File System Access API
- Localhost Server
- Internet Server

## Unit model (browser context)

- Every unit is TypeScript with any number of imports and a single default export
- A unit may contain data (inventory list), UI component, or shared type
- A unit can be named or just a hash
- There are tricks to combine scope of units to avoid excessive imports?
- `mutable`, `viewOf` are interesting (to explore)
- Lazy imports (run when called)
- `import-with` for notebook-style templates: `import {chart as histogram} with {numbers as data} from "@d3/histogram"`
- Editor experience does not require a sandbox unless code is executed
- every unit receives (TODO: finish this thought)

## Terminal integration

- Setup XTerm search: https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-search

## Implementation backlog

- Atom editor: hide/show editor/terminal
- Atom type: Markdown
- Atom type: MDX (Markdown + JSX)
- Atom type: P2P collaborative editing data structure
- Atom Edit History Graph View
- Electron app wrapper

## References

- https://github.com/observablehq/runtime
- https://explorabl.es/
