// TODO: расширять окно, при добавлении контактов
import { BrowserWindow, app, ipcMain } from 'electron'
import path from 'node:path'

import { createWindow as createWindowIntercom } from '../intercom/main'
import type { WebSocket } from 'ws'
import { loadData } from '../localDataManager'

export function createWindow(ws: WebSocket) {
  const window = new BrowserWindow({
    show: false,
    width: 300,
    height: 300,
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

  window.webContents.on('did-finish-load', async () => {
    const localData = await loadData()
    console.log(localData)
    // window.webContents.openDevTools()
    window.webContents.send('local-data', localData)
  })

  // ipcMain.on('call-to-contact', (_, contactID) => {
  //   // TODO: открывать picture in picture, получать оттуда offer -> передавать его в сокеты

  //   const eventData = {
  //     eventName: 'offer',
  //     data: {
  //       to: contactID,
  //       sdp: '',
  //     },
  //   }
  //   console.log(contactID)
  //   ws.send(JSON.stringify(eventData))

  //   // TODO: обработать ответ, что контакт не в сети
  // })

  ipcMain.on('open-intercom', (_, id) => {
    createWindowIntercom(ws, id, 'outgoing')
  })

  ipcMain.on('quit', () => {
    app.quit()
  })

  return window
}
