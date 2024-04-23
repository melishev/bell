const { app, Tray, Menu, nativeImage, MenuItem } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  tray = new Tray(nativeImage.createFromNamedImage('NSImageNameAddTemplate'))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'All-In-One', icon: nativeImage.createFromNamedImage('NSImageNameHomeTemplate', [-1, 0, 1]).resize({ height: 20 }) },
    { label: 'Capture Area', icon: nativeImage.createFromNamedImage('NSImageNameHomeTemplate', [-1, 0, 1]).resize({ height: 20 }) },
    { label: 'Capture Fullscreen'},
    { label: 'Capture Window' },
    { label: 'Scrolling Capture' },
    { type: 'separator' },
    { label: 'Hide Desktop Icons' },
    { type: 'separator' },
    { label: 'Quit' },
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
});
