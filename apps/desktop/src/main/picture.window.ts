import { BrowserWindow } from 'electron'
import path from 'path'

export default function createModal() {
  const window = new BrowserWindow({
    width: 400,
    height: 225,
    frame: false, // https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows

    alwaysOnTop: true,
    // hasShadow: false,

    // resizable: true,
  })

  window.setAspectRatio(16 / 9, {
    width: 400,
    height: 225,
  })

  window.setVisibleOnAllWorkspaces(true, {
    visibleOnFullScreen: true,
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    window.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  window.webContents.openDevTools()

  // window.setAlwaysOnTop(true, 'pop-up-menu')

  window.webContents.openDevTools()
}
