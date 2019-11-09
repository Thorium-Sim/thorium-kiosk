const ipcRenderer = require("electron").ipcRenderer;
const webFrame = require("electron").webFrame;
const ipAddress = require("./ipaddress");
const mac = require("./macaddress");

let browserCount = require("electron").remote.getCurrentWindow().browserCount;

const key = "thorium_clientPersistentId";
let clientId = sessionStorage.getItem(key);
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

setClientId(
  `${require("os").hostname()}${browserCount > 1 ? ` (${browserCount})` : ""}`
);

function setClient(id) {
  sessionStorage.setItem(key, id);
  localStorage.setItem("thorium_clientId", id);
  clientId = id;
}

function setClientId(id) {
  const clientList = getClientList();
  const clientIndex = clientList.indexOf(clientId);
  setClient(id);
  clientList[clientIndex] = id;
  localStorage.setItem(key, JSON.stringify(clientList));
}

function getClientList() {
  let clientList = null;
  try {
    clientList = JSON.parse(localStorage.getItem(key));
  } catch {
    // It errored - it either doesn't exist or isn't JSON.
    // If it's blank, create a new one
  }
  if (!clientList) {
    clientList = [localStorage.getItem(key) || require("os").hostname()];
    localStorage.setItem(key, JSON.stringify(clientList));
  }
  return clientList;
}

document.addEventListener("DOMContentLoaded", function() {
  if (localStorage.getItem("thorium_startKiosked") !== "false") {
    if (document.getElementById("start-kiosked")) {
      document.getElementById("start-kiosked").checked = true;
    }
  }
});

window.loadPage = function loadPage(url) {
  let auto = false;
  if (document.getElementById("remember-client").checked) auto = true;
  let kiosk = document.getElementById("start-kiosked").checked;
  localStorage.setItem("thorium_startKiosked", kiosk);
  ipcRenderer.send("loadPage", { url, auto, kiosk });
  return;
};
window.openBrowser = function openBrowser() {
  ipcRenderer.send("openBrowser");
  return;
};
window.getServers = function() {
  ipcRenderer.send("getServers");
};
window.serverAddress = function serverAddress() {
  let url = document
    .getElementById("server-address")
    .value.replace("/client", "");
  if (url.indexOf(":") === -1) url = url + ":1337";
  let auto = false;
  if (document.getElementById("remember-client").checked) auto = true;
  ipcRenderer.send("loadPage", { url, auto });
};
ipcRenderer.on("updateReady", function() {
  // changes the text of the button
  var container = document.getElementById("ready");
  container.classList.remove("hidden");
});
ipcRenderer.on("info", function(event, data) {
  const output = document.getElementById("console");
  if (output) {
    output.innerText = `${data}\n${output.innerText}`;
  }
});

const thorium = {
  sendMessage: function(arg) {
    return ipcRenderer.send("remoteMessage", arg);
  },
  ipAddress: ipAddress,
  mac: mac
};

ipcRenderer.on("clearUrl", function() {
  localStorage.setItem("thorium_url", "");
});

ipcRenderer.on("updateServers", function updateServers(e, servers) {
  if (document.getElementById("loading")) {
    if (servers.length === 0) {
      document.getElementById("loading").classList.remove("hidden");
      document.getElementById("servers").classList.add("hidden");
    } else {
      document.getElementById("loading").classList.add("hidden");
      document.getElementById("servers").classList.remove("hidden");
    }
    const markup = servers.map(
      s => `<button onclick="loadPage('${s.url}')">${s.name}</button>`
    );
    document.getElementById("serverList").innerHTML = markup;
  }
});

window.thorium = thorium;
