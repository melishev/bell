import { BrowserWindow, screen, ipcMain } from 'electron'
import path from 'path'
import type { WebSocket } from 'ws'

// TODO: нельзя что бы это окно было открыто дважды !!!
export function createWindow(
  ws: WebSocket,
  id: string,
  type: 'outgoing' | 'incoming',
  remoteSDP?: RTCSessionDescription
) {
  const windowWidth = 400

  const window = new BrowserWindow({
    width: windowWidth,
    height: 225,
    frame: false,
    // transparent: true,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,

    // vibrancy: 'window',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  const display = screen.getPrimaryDisplay()
  const left = display.bounds.width - windowWidth - 20
  window.setPosition(left, 0)

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

  window.webContents.on('did-finish-load', () => {
    if (remoteSDP) {
      window.webContents.send('remote-sdp', remoteSDP)
    }
    window.webContents.send('type', type)
  })

  // TODO: нужно получить оффер и передать его в ws вместе с id
  ipcMain.on('local-sdp', (_, sdp) => {
    console.log(sdp.type)
    const eventData = {
      eventName: sdp.type === 'offer' ? 'offer' : 'answer',
      data: {
        to: id,
        sdp: sdp,
      },
    }
    ws.send(JSON.stringify(eventData))

    // dialog.showErrorBox('hello', 'sdsds')
  })

  // window.setAlwaysOnTop(true, 'pop-up-menu')

  return window
}
