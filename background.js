chrome.browserAction.onClicked.addListener(function(tab) {
  console.log(chrome.extension.getURL('index.html'));
  chrome.tabs.create({'url': 'https://www.facebook.com/ads/preferences/edit/'}, function(tab) {
    // Tab opened.
  });
});

chrome.runtime.onMessage.addListener(function(msg, sender, respond) {

  chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    if (info.status !== 'complete')
      return;
    chrome.tabs.sendMessage(id, msg);
  })
  chrome.tabs.update(sender.tab.id, { url: chrome.extension.getURL('index.html') });
});
