import path from 'node:path'
import { Tray } from 'electron'
import { createWindow } from '../menu/main'

export function initSystemTray() {
  const tray = new Tray(path.resolve('./src/assets/LogoTemplate@2x.png'))

  const trayMenuWindow = createWindow()

  function toggleMenuWindow() {
    trayMenuWindow.isVisible() ? trayMenuWindow.hide() : trayMenuWindow.show()
  }

  tray.addListener('click', (event, bounds) => {
    trayMenuWindow.setPosition(bounds.x, bounds.y)
    toggleMenuWindow()
  })
}
