const ipcRenderer = require("electron").ipcRenderer;

const thorium = {
  sendMessage: function(arg) {
    return ipcRenderer.sendSync("synchronous-message", arg);
  }
};

window.thorium = thorium;
