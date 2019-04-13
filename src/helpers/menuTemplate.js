const { BrowserWindow, app } = require("electron");
const { windows, addWindow } = require("./multiWindow");
const { getLoadedUrl } = require("./loadedUrl");

module.exports = function() {
  var template = [
    {
      label: "Application",
      submenu: [
        {
          label: "About Application",
          selector: "orderFrontStandardAboutPanel:"
        },
        {
          label: "New Window",
          accelerator: "CmdOrCtrl+N",
          click: function() {
            addWindow({ loadedUrl: getLoadedUrl() });
          }
        },
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+Alt+R",
          click: function() {
            windows.forEach(mainWindow => {
              mainWindow && mainWindow.reload();
            });
          }
        },

        {
          label: "Kiosk",
          accelerator: "CmdOrCtrl+Alt+K",
          click: function() {
            if (windows[0] && windows[0].isKiosk()) {
              windows.forEach(mainWindow => {
                mainWindow.setKiosk(false);
              });
            } else {
              windows.forEach(mainWindow => {
                mainWindow.setKiosk(true);
              });
            }
          }
        },
        {
          label: "Dev Tools",
          accelerator: "CmdOrCtrl+Alt+I",
          click: function() {
            const focused = BrowserWindow.getFocusedWindow();
            focused && focused.webContents.openDevTools();
          }
        },
        {
          label: "Quit",
          accelerator: "CmdOrCtrl+Alt+Q",
          click: function() {
            app.quit();
          }
        }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    }
  ];
  return template;
};
