const triggerWindow = require("./triggerWindow");
const http = require("http");
const { clearMenubar, setMenubar } = require("./setMenubar");
const { windows } = require("./multiWindow");
const { setLoadedUrl } = require("./loadedUrl");

module.exports = function loadPage(uri) {
  return new Promise((resolve, reject) => {
    const url = uri
      .replace("https://", "")
      .replace("http://", "")
      .replace("/client", "");
    http
      .get(`http://${url}/client`, res => {
        if (res.statusCode !== 200) {
          setMenubar();
          return reject();
        }
        setLoadedUrl(`http://${url}/client`);
        windows.forEach(mainWindow => {
          mainWindow && mainWindow.loadURL(`http://${url}/client`);
          triggerWindow(mainWindow);
        });

        clearMenubar();
        return resolve();
      })
      .on("error", e => {
        // It failed. Go back to the main screen.
        console.error(`Got error: ${e.message}`);
        setMenubar();
        return reject();
      });
  });
};

module.exports.getLoadedUrl = function getLoadedUrl() {
  return loadedUrl;
};
