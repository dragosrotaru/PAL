# AGENTS.md — rabbithole

> AI-audience orientation guide for the `rabbithole` browser extension.
> @author claude

## What this is

A minimal browser extension (Manifest V2) that lets users "save" things from the web:
- **Selected text** — captured via `mouseup` in the content script.
- **Current tab URL** — used if nothing is selected when the save command fires.

Saving is triggered by `MacCtrl+S` (the "save" command).

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest: permissions, content scripts, background scripts, keyboard command |
| `background.js` | Service worker: receives selected text; handles "save" command; accumulates `saved[]` |
| `content.js` | Content script: watches `mouseup`, sends selected text to background |
| `browser-polyfill.js` | `webextensions-polyfill` — normalises Chrome/Firefox browser API differences |

## Data flow

```
User selects text → mouseup
  → content.js → sendMessage({ selected })
    → background.js: stores `selected`

User presses MacCtrl+S
  → background.js: push (selected || currentURL) to saved[]
                   (dedup: skip if same as lastSaved)
```

## Current state / missing pieces

- `saved[]` is in-memory only — lost on extension reload.
- No integration with the Pal environment or any storage backend.
- No UI to view or manage saved items.
- The extension name in manifest is "web-extension" (placeholder).
- Content scripts run on `<all_urls>` — no domain filtering.

## Build / install

No build step required — pure JS. Load via browser's "Load unpacked extension" pointing
to this directory.
