---
date: 2024-01-21
tags: [research, web-browsers, browser-engines, webkit, blink, gecko, servo, chromium, electron, wingman]
summary: Research notes on web browser engines and browser embedding frameworks. Four main engines: WebKit (Apple), Blink (Google, forked from WebKit), Gecko (Mozilla), Servo (originally Mozilla/Project Quantum, now Linux Foundation — written in Rust; many advances merged back into Gecko). Embedding options: Chromium Content API, CEF, NW.js, Electron, QtWebEngine, sprocket, wexond, servoshell. Notes on keyboard shortcut customization — most browsers (Firefox, Chrome, Brave) do not allow extensions or OS settings to override built-in shortcuts; Safari is the exception. Vivaldi (built with React+Node) and Surf (suckless) identified as closest to desired behavior. Relevant to wingman and the design of a custom Pal browser/runtime surface.
---

# Web browser engines and embedding frameworks

## Engines

| Engine | Owner | Notes |
|---|---|---|
| WebKit | Apple | Used by Safari |
| Blink | Google | Forked from WebKit; used by Chromium/Chrome |
| Gecko | Mozilla | Used by Firefox; absorbed many Servo advances |
| Servo | Linux Foundation | Originally Mozilla/Project Quantum; written in Rust |

More detail: [How Browsers Work](http://taligarsiel.com/Projects/howbrowserswork1.htm)

Toy layout engine tutorial (build from scratch): http://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html

## Embedding frameworks / chromium wrappers

- [Chromium Content API](http://www.chromium.org/Home) — raw API; maximum control, maximum complexity
- [CEF (Chromium Embedded Framework)](https://code.google.com/p/chromiumembedded/) — most popular embedding solution
- [NW.js](http://nwjs.io/) (previously node-webkit)
- [Electron](https://www.electronjs.org/)
- [sprocket](https://github.com/szeged/sprocket) — minimal Chromium Content API browser
- [wexond/desktop](https://github.com/wexond/desktop)
- [dothq/browser](https://github.com/dothq/browser)
- [servoshell](https://github.com/paulrouget/servoshell) — minimal Servo browser
- QtWebkit / QTWebEngine
- WebKitGTK
- XUL+XPCOM (Gecko) — old Firefox pre-57 architecture
- [Pale Moon](https://www.palemoon.org) / [Basilisk](https://www.basilisk-browser.org) — Gecko-based, still use XUL

## Keyboard shortcut problem

Most browsers (Firefox, Chrome, Chromium, Brave) do not allow full keyboard shortcut customization — built-in shortcuts cannot be overridden by extensions, browser config, or macOS keyboard settings. Safari is the exception (obeys OS keyboard mappings).

Browsers that do allow it:
- **Vivaldi** — built with React and Node.js; most customizable
- **Surf** (suckless) — minimal, hackable
- **Min Browser** — possible alternative
