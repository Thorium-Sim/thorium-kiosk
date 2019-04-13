const { Menu } = require("electron");
const templateFunc = require("./menuTemplate");

module.exports.setMenubar = function setMenubar() {
  const template = templateFunc();
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

module.exports.clearMenubar = function clearMenubar() {
  Menu.setApplicationMenu(null);
};
