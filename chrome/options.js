function setCheckboxChecked(item) {
  document.getElementById("overwrite").checked = item.overwrite;
}
  
function onError(error) {
  console.log(error)
}
  
chrome.storage.local.get(["overwrite"], setCheckboxChecked)

document.getElementById("overwrite").addEventListener("change", (event) => {
  if (event.target.checked) {
    chrome.storage.local.set({overwrite: true})
  } else {
    chrome.storage.local.set({overwrite: false})
  }
})