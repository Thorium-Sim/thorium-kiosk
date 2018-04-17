const electron = require("electron");
const BrowserWindow = electron.BrowserWindow;
const prompt = require("electron-prompt");
const path = require("path");
const url = require("url");
const globalShortcut = electron.globalShortcut;
const loadPage = require("./loadPage");
const startBonjour = require("./bonjour");
const settings = require("electron-settings");
const autoUpdater = require("electron-updater").autoUpdater;

const app = electron.app;

let mainWindow;
module.exports = () => {
  app.on("ready", function() {
    const ipcMain = electron.ipcMain;
    ipcMain.on("loadPage", function(evt, uri) {
      loadPage(uri, mainWindow);
    });

    mainWindow = new BrowserWindow({
      backgroundColor: "#2e2c29",
      width: 800,
      height: 600,
      kiosk: false,
      webPreferences: {
        nodeIntegration: false,
        preload: path.resolve(__dirname + "/../preload.js")
      }
    });
    let webContents = mainWindow.webContents;
    startBonjour(mainWindow);
    const savedURL = settings.get("url");
    if (savedURL) {
      setTimeout(() => {
        loadPage(savedURL, mainWindow);
      }, 1000);
    }
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true
      })
    );
    webContents.on("did-fail-load", () => {
      // Load the default page
      mainWindow &&
        mainWindow.loadURL(
          url.format({
            pathname: path.join(__dirname, "../index.html"),
            protocol: "file:",
            slashes: true
          })
        );
      settings.deleteAll();
      setTimeout(() => {
        mainWindow.setKiosk(false);
      }, 1000);
    });

    // Auto-update
    autoUpdater.checkForUpdatesAndNotify();

    globalShortcut.register("CommandOrControl+D", function() {
      prompt({
        title: "Enter the IP address of the server, including the port",
        label: "URL:",
        value: "",
        inputAttrs: {
          type: "text"
        }
      })
        .then(r => {
          if (!r) return;
          const res = r
            .replace("http://", "")
            .replace(/:[0-9]{4}\/client/gi, "");
          loadPage(`http://${res}/client`, mainWindow);
        })
        .catch(console.error);
    });
  });
};

module.mainWindow = mainWindow;
