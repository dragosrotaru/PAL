# Web Browsers

## Engines

- WebKit
- Blink
- Gecko
- Servo

## Frameworks

- Chromium Content API
- https://github.com/szeged/sprocket
- CEF
- NW.js
- Electron
- https://github.com/wexond/desktop
- https://github.com/dothq/browser
- XUL+XPCOM (Gecko) (old Firefox, pre 57)
- https://www.palemoon.org
- https://www.basilisk-browser.org
- https://github.com/paulrouget/servoshell
- QTWebkit
- WebKitGTK

## Browser Engines

I've done research on Open Source Browser Engines and Browsers - There are 4 Engines to note: Webkit, Blink, Gecko and Servo. WebKit is Apple, Blink is Google, Gecko is Mozilla, Servo is Linux Foundation. Blink was forked from WebKit. Servo is a Rust implementation which belonged to Mozilla under project Quantum, but since 2020 has been moved over to Linux Foundation. Many developments from Servo have been adopted back into Gecko.

There are multiple ways to build a web browser. You don’t need to do everything from scratch, but if you want to do that you should check [this tutorial](http://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html) out first. For those who would like to follow the beaten path, the open-source communities have already provided several high quality browser engines: [WebKit](https://www.webkit.org/) (Safari), [Blink](http://www.chromium.org/Home) (Chromium), [Gecko](https://developer.mozilla.org/en-US/docs/Mozilla/Gecko) (Firefox), [Servo](https://github.com/servo/servo) (Mozilla’s experimental project). You can even read an overview about their architecture design [here](http://taligarsiel.com/Projects/howbrowserswork1.htm).

There are some other popular “out-of-the-box” solutions: [CEF](https://code.google.com/p/chromiumembedded/), [NW.js](http://nwjs.io/) (previously node-webkit), [Awesomium](http://www.awesomium.com/), [OpenFin](https://openfin.co/), [QtWebEngine](http://qt-project.org/wiki/QtWebEngine). They are all based on Chromium’s framework, which is the Content API. Each of them are using their own UI, callbacks and ecosystem to support different purposes. If you find here what you are looking for, stick with it. Otherwise we can show the capacity of the Content API to build up your custom ecosystem.

## Keyboard Shortcuts

Shockingly most of the browsers I've tried - Firefox, Chrome, Chromium and Brave - support fully customizing all keyboard shortcuts. Built in shortcuts cannot be overwritten by a web extension, browser configuration OR macOS keyboard shortcut settings. Absolutely ridiculous. The only exception is Safari, which obeys the OS Keyboard shortcut mappings.

It looks like Vivaldi and Surf by Suckless are the type of browsers I really want. Maybe Min Browser

Vivaldi is built using React and NodeJS!! This is the one.
