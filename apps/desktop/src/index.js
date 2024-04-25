const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');
const path = require('node:path');

const testWindow = require('./test-window')

let tray = null;

app.on('window-all-closed', e => e.preventDefault() )

function createModal(){
  const inputModal = new BrowserWindow({width:500, height:500});
  inputModal.loadFile(path.join(__dirname, "modal.html"));

  inputModal.webContents.openDevTools();
}

function createTray() {
  tray = new Tray(nativeImage.createFromNamedImage('NSImageNameMobileMe').resize({height: 25}))
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Create new Call', icon: nativeImage.createFromNamedImage('NSImageNameHomeTemplate', [-1, 0, 1]).resize({ height: 20 }), click: ()=>{createModal()} },
    { label: 'Open Test Window', click: testWindow },
    { type: 'separator' },
    { label: 'Quit', click: ()=>{app.quit()} },
  ])

  tray.setToolTip('Simple bell application.')
  tray.setContextMenu(contextMenu)
}

app.on("ready", createTray)
