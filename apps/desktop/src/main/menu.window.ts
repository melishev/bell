import { BrowserWindow } from 'electron'
import path from 'node:path'

export function createMenuWindow() {
  const window = new BrowserWindow({
    show: false,
    width: 300,
    height: 225,
    frame: false,
    resizable: false,
    // transparent: true,
    movable: false,
    // minimizable: false,
    // maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,

    // hasShadow: false,

    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: false,
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

  // if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
  //   window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  // } else {
  //   window.loadFile(
  //     path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/menu.html`)
  //   )
  // }

  if (MENU_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(`${MENU_WINDOW_VITE_DEV_SERVER_URL}/menu.html`)
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MENU_WINDOW_VITE_NAME}/menu.html`)
    )
  }

  return window
}
