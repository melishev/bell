import path from 'node:path'
import { Tray } from 'electron'
import { createMenuWindow } from './menu.window'

export function initSystemTray() {
  const tray = new Tray(path.resolve('./src/assets/LogoTemplate@2x.png'))

  const trayMenuWindow = createMenuWindow()

  function toggleMenuWindow() {
    trayMenuWindow.isVisible() ? trayMenuWindow.hide() : trayMenuWindow.show()
  }

  // tray.on('balloon-click', () => console.log('here'))
  tray.addListener('click', (event, bounds) => {
    trayMenuWindow.setPosition(bounds.x, bounds.y)
    toggleMenuWindow()
  })
}
