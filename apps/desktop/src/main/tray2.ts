import path from 'node:path'
import { app, Tray } from 'electron'
import { createWindow } from '../menu/main'

export function initSystemTray() {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'LogoTemplate@2x.png')
    : path.resolve('./src/assets/LogoTemplate@2x.png')

  const tray = new Tray(iconPath)

  const trayMenuWindow = createWindow()

  function toggleMenuWindow() {
    trayMenuWindow.isVisible() ? trayMenuWindow.hide() : trayMenuWindow.show()
  }

  tray.addListener('click', (event, bounds) => {
    trayMenuWindow.setPosition(bounds.x, bounds.y)
    toggleMenuWindow()
  })
}
