chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyzeText",
    title: "Analyze Selected Text",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyzeText") {
    chrome.tabs.sendMessage(tab.id, {
      action: "analyzeText",
      text: info.selectionText,
    });
  }
});
