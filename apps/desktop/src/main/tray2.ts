import { Menu, Tray } from 'electron'
import { createMenuWindow } from './menu.window'

export function initSystemTray() {
  const tray = new Tray(
    '/Users/matvejmelishev/Desktop/bell/apps/desktop/src/assets/LogoTemplate@2x.png'
  )
  const trayBounds = tray.getBounds()

  const trayMenuWindow = createMenuWindow()

  function toggleMenuWindow() {
    trayMenuWindow.isVisible() ? trayMenuWindow.hide() : trayMenuWindow.show()
  }

  // tray.on('balloon-click', () => console.log('here'))
  tray.addListener('click', (event, bounds, position) => {
    trayMenuWindow.setPosition(bounds.x, bounds.y)
    toggleMenuWindow()
  })
}
