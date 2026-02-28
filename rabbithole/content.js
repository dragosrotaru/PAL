/**
 * @file Rabbithole browser extension — content script.
 *
 * Injected into every page (`<all_urls>`). Watches for `mouseup` events and
 * forwards the user's text selection (or `null` if nothing is selected) to the
 * background script via `browser.runtime.sendMessage`.
 *
 * The background script (`background.js`) uses this to populate the "save" payload.
 */
console.log("hello world");

document.addEventListener("mouseup", () => {
  const selected = window.getSelection().toString();
  console.log("selected: ", selected);
  browser.runtime.sendMessage({ selected: selected.length > 0 ? selected : null });
});
