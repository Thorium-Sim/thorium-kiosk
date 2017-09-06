const electron = require("electron");
// Module to control application life.
const password = "rommel1942";

const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const os = require("os");
const prompt = require("electron-prompt");

const Discovery = require('udp-discovery').Discovery;
const discover = new Discovery();

discover.on('MessageBus', gotEvent);
discover.announce('client', {}, 500, true);

const dialog = electron.dialog;
const globalShortcut = electron.globalShortcut;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let uri;

function gotEvent(event, data) {
  if (event === 'ClientConnect'){
    uri = `http://${data.address}:${data.port}/client`
    if (!mainWindow) {
      createWindow();
    }
  }
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, kiosk: true });
  let webContents = mainWindow.webContents;
  webContents.once("did-start-loading", () => {
    mainWindow.webContents.executeJavaScript(
      "localStorage.setItem('thorium_clientId','" + os.hostname() + "');"
    );
  });

  // and load the index.html of the app.
  mainWindow.loadURL(uri);

  globalShortcut.register("CommandOrControl+Alt+E", function() {
    // Open the DevTools.
    prompt({
      title: "You must enter the password to open the dev tools",
      label: "Password:",
      value: "",
      inputAttrs: {
        type: "password"
      }
    })
      .then(r => {
        if (r === password) {
          mainWindow.webContents.openDevTools();
        } //null if window was closed, or user clicked Cancel
      })
      .catch(console.error);
  });

  globalShortcut.register("Alt+C", function() {
    prompt({
      title: "Enter the IP address of the server",
      label: "URL:",
      value: "192.168.1.4",
      inputAttrs: {
        type: "text"
      }
    })
      .then(r => {
        console.log("result", r); //null if window was closed, or user clicked Cancel
      })
      .catch(console.error);
    /* smalltalk
    .prompt("Question", "What is the IP address or host name of the server?", "")
    .then(
      function(value) {
        console.log(value);
      },
      function() {
        console.log("cancel");
      }
    );*/
  });
  globalShortcut.register("CommandOrControl+Q", function() {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+W", function() {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+R", function() {
    // Do nothing.
  });

  globalShortcut.register("CommandOrControl+Alt+Q", function() {
    prompt({
      title: "You must enter the password to quit",
      label: "Password:",
      value: "",
      inputAttrs: {
        type: "password"
      }
    })
      .then(r => {
        if (r === password) {
          app.quit();
        } //null if window was closed, or user clicked Cancel
      })
      .catch(console.error);
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
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  app.quit();
});