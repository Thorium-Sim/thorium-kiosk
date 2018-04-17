const ipcRenderer = require("electron").ipcRenderer;
var webFrame = require("electron").webFrame;
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

localStorage.setItem("thorium_clientId", require("os").hostname());

window.loadPage = function loadPage(url) {
  ipcRenderer.send("loadPage", url);
  return;
};

ipcRenderer.on("updateReady", function() {
  // changes the text of the button
  var container = document.getElementById("ready");
  container.classList.remove("hidden");
});

const thorium = {
  sendMessage: function(arg) {
    return ipcRenderer.sendSync("synchronous-message", arg);
  }
};

ipcRenderer.on("clearUrl", function() {
  localStorage.setItem("thorium_url", "");
});

ipcRenderer.on("updateServers", function updateServers(e, servers) {
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
});

window.thorium = thorium;
