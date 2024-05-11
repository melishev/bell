import { BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

import { createWindow as createPictureWindow } from '../picture/main'

export function createWindow() {
  const window = new BrowserWindow({
    show: false,
    width: 300,
    height: 166,
    frame: false,
    resizable: false,
    transparent: true,
    movable: false,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  window.setAlwaysOnTop(true, 'pop-up-menu')

  window.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
    // skipTransformProcessType: true,
  })

  // window.setIgnoreMouseEvents(true, {
  //   forward: true,
  // })

  window.addListener('blur', () => {
    window.hide()
  })

  if (MENU_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MENU_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MENU_WINDOW_VITE_NAME}/index.html`)
    )
  }

  ipcMain.on('open-picture', () => {
    createPictureWindow()
  })

  return window
}
