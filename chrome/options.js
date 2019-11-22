chrome.storage.local.get(["overwrite"], function(item) {
  document.getElementById("overwrite").checked = item.overwrite;
})

document.getElementById("overwrite").addEventListener("change", (event) => {
  if (event.target.checked) {
    chrome.storage.local.set({overwrite: true})
  } else {
    chrome.storage.local.set({overwrite: false})
  }
})