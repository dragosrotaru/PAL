/**
 * @file Rabbithole browser extension — background service worker.
 *
 * Listens for two events:
 * 1. `browser.runtime.onMessage` — receives the currently-selected text
 *    forwarded from the content script via `sendMessage`.
 * 2. `browser.commands.onCommand("save")` — triggered by the MacCtrl+S keybinding.
 *    On "save", records the selected text (if any) or the current tab's URL into the
 *    `saved` array, deduplicating consecutive identical saves via `lastSaved`.
 *
 * Current state: accumulates saves in memory only — no persistence, no sync to Pal Env.
 * // todo @claude: persist `saved` to the Pal environment via a message to pal-ts
 */
console.log("hello world");

const saved = [];
let lastSaved = null;
let selected = null;

browser.runtime.onMessage.addListener(message => {
  console.log("message received: ", message.selected);
  selected = message.selected;
});

browser.commands.onCommand.addListener(async (command) => {
    console.log(command);
    if (command === "save") {
      const currentTab = (await browser.tabs.query({currentWindow: true, active: true}))[0];
      const currentURL = currentTab.url;
      const save = selected || currentURL;
      if (save !== lastSaved) {
        saved.push(save);
        lastSaved = save;
      }
      console.log(saved);
      console.log("woohoo");
    }
});