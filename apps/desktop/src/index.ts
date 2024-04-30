import { app, Tray, Menu, nativeImage, BrowserWindow } from 'electron';
import path from 'path'

import testWindow from './test-window'

let tray = null;

app.on('window-all-closed', e => e.preventDefault() )

function createModal(){
  const inputModal = new BrowserWindow({width:500, height:500});

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    inputModal.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    inputModal.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  };

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
