const electron = require('electron')
// Module to control application life.
const NotificationCenter = require('node-notifier').NotificationCenter;
const password = 'rommel1942';

var notifier = new NotificationCenter({
  withFallback: false, // Use Growl Fallback if <= 10.8
  customPath: void 0 // Relative/Absolute path to binary if you want to use your own fork of terminal-notifier
});

const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const os = require('os');

const dialog = electron.dialog
const globalShortcut = electron.globalShortcut
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600,kiosk: false})
  let webContents = mainWindow.webContents;
  webContents.once('did-start-loading', () => {
    mainWindow.webContents.executeJavaScript("localStorage.setItem('thorium_clientId','" + os.hostname() + "');");
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`http://apple.local:3000/app`);

  globalShortcut.register('CommandOrControl+Alt+E', function () {
    // Open the DevTools.
    notifier.notify({
      'title': "Access Dev Tools",
      'subtitle': "Access Restricted",
      'message': 'Click "reply" to enter password.',
      'sound': false, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
      'icon': 'Terminal Icon', // Absolute Path to Triggering Icon
      'contentImage': void 0, // Absolute Path to Attached Image (Content Image)
      'open': void 0, // URL to open on Click
      'wait': false, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

      // New in latest version. See `example/macInput.js` for usage
      closeLabel: void 0, // String. Label for cancel button
      actions: void 0, // String | Array<String>. Action label or list of labels in case of dropdown
      dropdownLabel: void 0, // String. Label to be used if multiple actions
      reply: true // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
    }, function(error, response, metadata) {
      if (metadata.activationValue === password){
        mainWindow.webContents.openDevTools();
      }
    });
  });
  
  globalShortcut.register('CommandOrControl+Q', function () {
    // Do nothing.
  });

  globalShortcut.register('CommandOrControl+W', function () {
    // Do nothing.
  });

  globalShortcut.register('CommandOrControl+R', function () {
    // Do nothing.
  });

  globalShortcut.register('CommandOrControl+Alt+Q', function(){
    //Actually quit
    notifier.notify({
      'title': "Quit Application",
      'subtitle': "Access Restricted",
      'message': 'Click "reply" to enter password.',
      'sound': false, // Case Sensitive string for location of sound file, or use one of macOS' native sounds (see below)
      'icon': 'Terminal Icon', // Absolute Path to Triggering Icon
      'contentImage': void 0, // Absolute Path to Attached Image (Content Image)
      'open': void 0, // URL to open on Click
      'wait': false, // Wait for User Action against Notification or times out. Same as timeout = 5 seconds

      // New in latest version. See `example/macInput.js` for usage
      closeLabel: void 0, // String. Label for cancel button
      actions: void 0, // String | Array<String>. Action label or list of labels in case of dropdown
      dropdownLabel: void 0, // String. Label to be used if multiple actions
      reply: true // Boolean. If notification should take input. Value passed as third argument in callback and event emitter.
    }, function(error, response, metadata) {
      if (metadata.activationValue === password){
        app.quit();
      }
    });
  })
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
