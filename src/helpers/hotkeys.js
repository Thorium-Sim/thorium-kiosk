const { app, globalShortcut, BrowserWindow } = require("electron");
const { windows } = require("./multiWindow");
const { clearMenubar, setMenubar } = require("./setMenubar");

module.exports = () => {
  // Create the browser window.
  globalShortcut.register("CommandOrControl+Alt+E", function() {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  });

  // globalShortcut.register("CommandOrControl+Q", function() {
  //   // Do nothing.
  // });

  // globalShortcut.register("CommandOrControl+W", function() {
  //   // Do nothing.
  // });

  globalShortcut.register("CommandOrControl+Alt+R", function() {
    windows.forEach(mainWindow => {
      mainWindow && mainWindow.reload();
    });
  });

  globalShortcut.register("CommandOrControl+Alt+I", function() {
    const focused = BrowserWindow.getFocusedWindow();
    focused && focused.webContents.openDevTools();
  });
  globalShortcut.register("CommandOrControl+Alt+K", function() {
    if (windows[0] && windows[0].isKiosk()) {
      windows.forEach(mainWindow => {
        mainWindow.setKiosk(false);
      });
      setMenubar();
    } else {
      windows.forEach(mainWindow => {
        mainWindow.setKiosk(true);
        clearMenubar();
      });
    }
  });
  globalShortcut.register("CommandOrControl+Alt+Q", function() {
    app.quit();
  });
};
