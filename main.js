const electron = require("electron");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const os = require("os");
const prompt = require("electron-prompt");
const path = require("path");
const url = require("url");
const powerOff = require("power-off");
const sleepMode = require("sleep-mode");
const shell = electron.shell;
const storage = require("electron-json-storage");
const freakout = require("./freakout");
const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let uri;

app.on("ready", function() {
  const ipcMain = electron.ipcMain;
  ipcMain.on("synchronous-message", function(event, arg) {
    if (arg) {
      switch (arg.action) {
        case "freak":
          freakout();
          break;
        case "beep":
          shell.beep();
          break;
        case "shutdown":
          powerOff(function(err) {
            if (err) {
              throw new Error("Can't run power-off");
            }
          });
          break;
        case "restart":
          break;
        case "sleep":
          sleepMode(function(err) {
            if (err) {
              throw new Error("Can't run sleep");
            }
          });
          break;
        case "quit":
          app.quit();
          break;
      }
    }
    event.returnValue = "pong";
  });

  mainWindow = new BrowserWindow({
    backgroundColor: "#2e2c29",
    width: 800,
    height: 600,
    kiosk: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + "/preload.js"
    }
  });
  let webContents = mainWindow.webContents;

  storage.get("url", function(err, res) {
    if (res && res.url) {
      mainWindow.loadURL(res.url);
      triggerWindow();
    } else {
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true
        })
      );
    }
  });

  webContents.on("did-start-loading", () => {
    mainWindow.webContents.executeJavaScript(
      "localStorage.setItem('thorium_clientId','" + os.hostname() + "');"
    );
  });
  webContents.on("did-fail-load", () => {
    // Load the default page
    mainWindow &&
      mainWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file:",
          slashes: true
        })
      );
  });
  globalShortcut.register("CommandOrControl+D", function() {
    storage.get("url", function(err, res) {
      prompt({
        title: "Enter the IP address of the server",
        label: "URL:",
        value: res.url,
        inputAttrs: {
          type: "text"
        }
      })
        .then(r => {
          r = r.replace("http://", "").replace(":3000/client", "");
          storage.set("url", { url: `http://${r}:3000/client` });
          mainWindow && mainWindow.loadURL(`http://${r}:3000/client`);
          triggerWindow();
        })
        .catch(console.error);
    });
  });

  // Auto-discovery
  const bonjour = require('bonjour')();
  bonjour.find({ type: 'http' }, newService);
  
  function newService(service) {
    if (service.name === "Thorium" && service.type === 'http') {
      const ipregex = /[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}\.[0-2]?[0-9]{1,2}/gi
      const address = service.addresses.find(a => ipregex.test(a));
      const uri = `http://${address}:${service.port || 3000}/client`;
      if (uri !== mainWindow.webContents.getURL().replace(`#`, ``)) {
        mainWindow.loadURL(uri);
        storage.set("url", { url: uri });
        triggerWindow();
      }
    }
  }
});



function triggerWindow() {
  mainWindow.setKiosk(true);

  // Create the browser window.
  globalShortcut.register("CommandOrControl+Alt+E", function() {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  });

  globalShortcut.register("CommandOrControl+Q", function(evt) {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+W", function() {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+R", function() {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+Alt+I", function() {
    // Do nothing.
  });
  globalShortcut.register("CommandOrControl+Alt+K", function() {
    if (mainWindow.isKiosk()) {
      mainWindow.setKiosk(false);
    } else {
      mainWindow.setKiosk(true);
    }
  });
  globalShortcut.register("CommandOrControl+Alt+Q", function() {
    app.quit();
  });
  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  app.quit();
});
