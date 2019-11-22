import domainlist from "./domain_list.js";

browser.browserAction.onClicked.addListener(function(tab) {
  let content = [];

  let domain = getDomain(tab.url);

  browser.cookies.getAll({}, function(cookies) {
    for (let i in cookies) {
      let cookie = cookies[i]; 
      if (cookie.domain.indexOf(domain) != -1) {     
        content.push(escapeForPre(cookie.domain));
        content.push("\t");
        content.push(escapeForPre((!cookie.hostOnly).toString().toUpperCase()));
        content.push("\t");
        content.push(escapeForPre(cookie.path)); 
        content.push("\t");
        content.push(escapeForPre(cookie.secure.toString().toUpperCase()));
        content.push("\t");
        content.push(escapeForPre(cookie.expirationDate ? Math.round(cookie.expirationDate) : "0"));
        content.push("\t");
        content.push(escapeForPre(cookie.name));
        content.push("\t");
        content.push(escapeForPre(cookie.value));
        content.push("\n");
      }
    }
    
    let header = [
      "# HTTP Cookie File for domains related to " + escapeForPre(domain) + ".\n",
      "# Downloaded with cookies.txt One Click Firefox Extension (" + escapeForPre("https://addons.mozilla.org/en-US/firefox/addon/cookies-txt-one-click/") + ")\n",
      "# Example:  wget -x --load-cookies cookies.txt " + escapeForPre(tab.url) + "\n",
      "#\n"
    ];

    let blob = new Blob(header.concat(content), {type: 'text/plain'});
    let objectURL = URL.createObjectURL(blob);

    browser.storage.local.get("overwrite").then(function(item) {
      let downloadOptions = {
        "url": objectURL,
        "filename": domain + "-cookies.txt"
      };

      if(item.overwrite) {
        downloadOptions["conflictAction"] = "overwrite"
      }

      browser.downloads.download(downloadOptions)
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