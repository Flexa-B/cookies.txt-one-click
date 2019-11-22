browser.storage.local.get("overwrite").then(function(item) {
  document.getElementById("overwrite").checked = item.overwrite;
})

document.getElementById("overwrite").addEventListener("change", (event) => {
  if (event.target.checked) {
    browser.storage.local.set({overwrite: true})
  } else {
    browser.storage.local.set({overwrite: false})
  }
})