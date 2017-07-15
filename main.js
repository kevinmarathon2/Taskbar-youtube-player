const electron = require("electron");
const { Menu, Tray, MenuItem } = require("electron");
const reload = require("./electron-reload.js");
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
let tray = null;
const path = require("path");
const url = require("url");
app.commandLine.appendSwitch("enable-experimental-web-platform-features");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, sideWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1,
    height: 1,
    frame: false,
    transparent: true,
    resizable: false,
    skipTaskbar: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "yumi/index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  reload(mainWindow, ["./yumi/src", "./yumi/"]);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function sideWindowOpen() {
  sideWindow = new BrowserWindow({
    // width: 340,
    // height: 170,
    // frame: false,
    // transparent: true,
    // resizable: false,
    // skipTaskbar: true
    // 280px by 120 during dev 800 by 800 during

    width: 800,
    height: 800,
    frame: true,
    transparent: false,
    resizable: true,
    skipTaskbar: false
  });
  sideWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "yumi/src/sideMenu.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // Emitted when the window is closed.
  sideWindow.on("closed", function() {
    sideWindow = null;
  });

  const trayPos = tray.getBounds();
  const windowPos = sideWindow.getBounds();
  let x,
    y = 0;

  x = trayPos.x - windowPos.width / 2;
  y = trayPos.y - windowPos.height;

  sideWindow.setPosition(x - 100, y - 40, false);

  sideWindow.on("blur", () => {
    sideWindow.close();
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  tray = new Tray("./yumini.ico");
  const contextMenu = new Menu();

  menuQuit = new MenuItem({
    click: function() {
      app.quit();
    },
    label: "Quit program"
  });

  contextMenu.append(menuQuit);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Yumini");
  tray.on("click", function() {
    //createWindow();
    if (sideWindow == undefined) {
      sideWindowOpen();
    } else {
      sideWindow.close();
      sideWindow = null;
    }
  });
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

let playstatus = {
  action: "Empty",
  videoplaying: "",
  videolist: []
};
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const { ipcMain } = require("electron");
ipcMain.on("Here-is-a-video-to-play", (event, arg) => {
  console.log(arg); // prints "ping"
  mainWindow.send("Here-is-a-video-to-play", arg);
  event.sender.send("Here-is-a-video-to-play", arg);
});

ipcMain.on("change-status", (event, arg) => {
  playstatus.action = arg.action;
  playstatus.videoplaying = arg.videoplaying;
  playstatus.videolist = arg.videolist;
});

ipcMain.on("asking-status", (event, arg) => {
  event.sender.send("Here-is-status", playstatus);
});

ipcMain.on("asking-stop", (event, arg) => {
  mainWindow.send("Please-Stop");
  playstatus = {
    action: "Empty",
    videoplaying: "",
    videolist: []
  };
});
