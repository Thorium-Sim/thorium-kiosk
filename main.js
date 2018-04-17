const electron = require("electron");
// Module to control application life.
const app = electron.app;
const startApp = require("./helpers/startApp");
// Module to create native browser window.
startApp();

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  app.quit();
});
