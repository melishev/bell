import path from 'node:path'
import { Tray, app, systemPreferences } from 'electron'
import { createWindow as createWindowMenu } from './menu/main'

import WebSocket from 'ws'
import { addContact, initializeDataFile } from './localDataManager'
import { initializeWebSocket } from './webSocketManager'

function createTray(ws: WebSocket) {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'LogoTemplate@2x.png')
    : path.resolve('./src/assets/LogoTemplate@2x.png')

  const tray = new Tray(iconPath)

  const trayMenuWindow = createWindowMenu(ws)

  function toggleMenuWindow() {
    trayMenuWindow.isVisible() ? trayMenuWindow.hide() : trayMenuWindow.show()
  }

  tray.addListener('click', (event, bounds) => {
    trayMenuWindow.setPosition(bounds.x, bounds.y)
    toggleMenuWindow()
  })

  systemPreferences.askForMediaAccess('microphone')
  systemPreferences.askForMediaAccess('camera')
}

app.on('window-all-closed', (e) => e.preventDefault())

app.on('ready', async () => {
  await addContact('4ae45530-39a6-4417-8f58-50edc0a127fd', { name: 'Matvei' })
  await addContact('b45c46f5-1805-4dc9-aecd-d024e259e56a', { name: 'Polina' })
  const localData = await initializeDataFile()

  const ws = initializeWebSocket(localData)

  createTray(ws)
})
