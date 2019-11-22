function setCheckboxChecked(item) {
  document.getElementById("overwrite").checked = item.overwrite;
}

function onError(error) {
  console.log(error)
}

browser.storage.local.get("overwrite")
  .then(setCheckboxChecked, onError)

document.getElementById("overwrite").addEventListener("change", (event) => {
  if (event.target.checked) {
    browser.storage.local.set({overwrite: true})
      .then(null, onError)
  } else {
    browser.storage.local.set({overwrite: false})
      .then(null, onError)
  }
})