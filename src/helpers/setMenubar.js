const { Menu } = require("electron");
const templateFunc = require("./menuTemplate");
const { windows } = require("./multiWindow");

module.exports.setMenubar = function setMenubar() {
  const template = templateFunc();
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  windows.forEach(w => {
    w.setMenuBarVisibility(true);
    w.setAutoHideMenuBar(false);
  });
};

module.exports.clearMenubar = function clearMenubar() {
  Menu.setApplicationMenu(null);
};
