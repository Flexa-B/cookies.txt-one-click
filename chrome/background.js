import domainlist from "./domain_list.js";

chrome.browserAction.onClicked.addListener(function(tab) {
  let content = "";
  let downloadable = "";

  let domain = getDomain(tab.url);

  chrome.cookies.getAll({}, function(cookies) {
    for (var i in cookies) {
      let cookie = cookies[i]; 
      if (cookie.domain.indexOf(domain) != -1) {     
        content += escapeForPre(cookie.domain);
        content += "\t";
        content += escapeForPre((!cookie.hostOnly).toString().toUpperCase());
        content += "\t";
        content += escapeForPre(cookie.path); 
        content += "\t";
        content += escapeForPre(cookie.secure.toString().toUpperCase());
        content += "\t";
        content += escapeForPre(cookie.expirationDate ? Math.round(cookie.expirationDate) : "0");
        content += "\t";
        content += escapeForPre(cookie.name);
        content += "\t";
        content += escapeForPre(cookie.value);
        content += "\n";
      }
    }
    
    downloadable += "# HTTP Cookie File for domains related to " + escapeForPre(domain) + ".\n";
    downloadable += "# Downloaded with cookies.txt One Click Chrome Extension (" + escapeForPre("https://chrome.google.com/webstore/detail/pneebejkjkhadolkdpiigilcjcnopkog") + ")\n";
    downloadable += "# Example:  wget -x --load-cookies cookies.txt " + escapeForPre(tab.url) + "\n";
    downloadable += "#\n";

    let uri = "data:application/octet-stream;base64," + btoa(downloadable + content);

    chrome.downloads.download({
      "url": uri,
      "filename": domain + "-cookies.txt"
    });
  });
});

function escapeForPre(text) {
  return String(text).replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#039;");
}

function getDomain(url) {
  let server = url.match(/:\/\/(.[^/:#?]+)/)[1];
  let parts = server.split(".");
  let domain = "";

  let isIp = !isNaN(parseInt(server.replace(".",""), 10));

  if (parts.length <= 1 || isIp) {
    domain = server;
  }
  else {
    //search second level domain suffixes
    let domains = new Array();
    domains[0] = parts[parts.length - 1];
    for(let i = 1; i < parts.length; i++) {
      domains[i] = parts[parts.length - i - 1] + "." + domains[i - 1];
      if (!domainlist.hasOwnProperty(domains[i])) {
        domain = domains[i];
        break;
      }
    }

    if (typeof(domain) == "undefined") {
      domain = server;
    }
  }
  
  return domain;
}