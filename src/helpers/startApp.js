const { app, BrowserWindow, ipcMain } = require("electron");

// Make the kiosk work better on slightly older computers
app.commandLine.appendSwitch("ignore-gpu-blacklist", "true");

const { autoUpdater } = require("electron-updater");

const loadPage = require("./loadPage");
const { bonjour } = require("./bonjour");
const settings = require("electron-settings");
const { setMenubar } = require("./setMenubar");
const { checkWindow, addWindow } = require("./multiWindow");

module.exports = () => {
  app.on("ready", function() {
    checkWindow();
    autoUpdater.checkForUpdatesAndNotify();
    addWindow({ main: true });
    ipcMain.on("getWindowCount", event => {
      event.returnValue = BrowserWindow.getAllWindows().filter(b => {
        return b.isVisible();
      }).length;
    });
    ipcMain.on("loadPage", function(evt, data) {
      const { url: loadUrl, auto } = data;
      if (auto) {
        settings.set("autostart", loadUrl);
      }
      loadPage(loadUrl).catch(() => {
        settings.set("autostart", null);
        bonjour.start();
      });
    });
    if (settings.get("autostart")) {
      // Check to see if the page will work.
      const loadUrl = settings.get("autostart");
      // Do a fetch
      loadPage(loadUrl).catch(() => {
        settings.set("autostart", null);
        bonjour.start();
      });
    } else {
      bonjour.start();
    }
    setMenubar();
    app.on("window-all-closed", function() {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      app.quit();
    });
  });
};
