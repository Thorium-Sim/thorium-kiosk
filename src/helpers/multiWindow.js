const electron = require("electron");
const { BrowserWindow } = require("electron");
const path = require("path");
const { bonjour } = require("./bonjour");
const uuid = require("uuid");
const url = require("url");
let windows = [];

function checkWindow() {
  let displays = electron.screen.getAllDisplays();
  let externalDisplay = displays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  if (externalDisplay) {
    module.exports.addWindow({
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50
    });
  }
}

module.exports.checkWindow = checkWindow;
module.exports.windows = windows;

let browserCount = 0;
function addWindow({ main, x, y, loadedUrl }) {
  browserCount++;
  const config = {
    backgroundColor: "#2e2c29",
    width: 800,
    height: 700,
    x,
    y,
    kiosk: false,
    webPreferences: {
      nodeIntegration: false
    }
  };
  if (main) {
    config.webPreferences.preload = path.resolve(__dirname + "/preload.js");
  } else {
    config.webPreferences.preload = path.resolve(
      __dirname + "/externalPreload.js"
    );
  }
  const window = new BrowserWindow(config);
  window.uniqueId = uuid.v4();
  window.browserCount = browserCount;
  window.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.

    windows = windows.filter(w => w.uniqueId !== window.uniqueId);
    if (windows.length === 0) {
      bonjour.stop();
    }
  });
  window.loadURL(
    loadedUrl
      ? loadedUrl
      : url.format({
          pathname: path.join(
            __dirname,
            main ? "../index.html" : "../external.html"
          ),
          protocol: "file:",
          slashes: true
        })
  );
  windows.push(window);
}

module.exports.addWindow = addWindow;
