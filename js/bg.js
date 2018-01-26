/**
 * Popup promt if the file already exists
 */
chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
  suggest({
    filename: item.filename,
    conflictAction: 'overwrite',
  })
});

/**
 * Listen to inject.js
 */
chrome.runtime.onMessage.addListener(function (req, sender, res) {
  // chrome.tabs.executeScript({
  //   code: 'console.log("addd")'
  // });
  if ('download' !== req.key) return res({});

  chrome.downloads.download({ url: req.url }, function () {
    return res({});
  });
});

// chrome.storage.sync.set({ first: 'meow', second: 'wamuw' });
