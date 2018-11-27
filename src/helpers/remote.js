const powerOff = require("power-off");
const sleepMode = require("sleep-mode");
const restart = require("./restart");
const freakout = require("./freakout");
const electron = require("electron");

const { app, ipcMain } = electron;

module.exports = () => {
  ipcMain.on("remoteMessage", function(event, message) {
    if (message) {
      switch (message.action) {
        case "freak":
          freakout();
          break;
        case "beep":
          process.stdout.write("\x07");
          break;
        case "shutdown":
          powerOff(function(err) {
            if (err) {
              throw new Error("Can't run power-off");
            }
          });
          break;
        case "restart":
          restart(function(err) {
            if (err) {
              throw new Error("Can't run restart");
            }
          });
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
          process.exit();
          break;
        default:
          break;
      }
    }
  });
};