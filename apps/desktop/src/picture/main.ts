import { BrowserWindow } from 'electron'
import path from 'path'

export function createWindow() {
  const window = new BrowserWindow({
    width: 400,
    height: 225,
    frame: false,
    // transparent: true,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,

    // vibrancy: 'window',
  })

  window.setAspectRatio(16 / 9, {
    width: 400,
    height: 225,
  })

  window.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  if (PICTURE_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(PICTURE_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${PICTURE_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // window.setAlwaysOnTop(true, 'pop-up-menu')
}
