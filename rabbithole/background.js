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