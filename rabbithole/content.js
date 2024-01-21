console.log("hello world");

document.addEventListener('mouseup', () => {  
    const selected = window.getSelection().toString();
    console.log("selected: ", selected);
    browser.runtime.sendMessage({"selected": selected.length > 0 ? selected : null });
});