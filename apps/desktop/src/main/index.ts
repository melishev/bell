import { app, Tray, Menu, nativeImage, BrowserWindow } from 'electron'
import path from 'path'

import pictureWindow from './picture.window'

let tray = null

app.on('window-all-closed', (e) => e.preventDefault())

function createTray() {
  tray = new Tray(
    nativeImage
      .createFromNamedImage('NSImageNameMobileMe')
      .resize({ height: 25 })
  )
  const contextMenu = Menu.buildFromTemplate([
    // {
    //   label: 'Create new Call',
    //   icon: nativeImage
    //     .createFromNamedImage('NSImageNameHomeTemplate', [-1, 0, 1])
    //     .resize({ height: 20 }),
    //   click: () => {
    //     createModal()
    //   },
    // },
    { label: 'Open Test Window', click: pictureWindow },
    { type: 'separator' },
    { label: 'add new contact'}
    {
      label: 'Quit',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setToolTip('Simple bell application.')
  tray.setContextMenu(contextMenu)
}

app.on('ready', createTray)
