import path from 'node:path'
import { Menu, Tray } from 'electron'

import { createWindow } from '../picture/main'

export function initSystemTray() {
  /**
   * To make sure your icon isn't grainy on retina monitors, be sure your @2x image is 144dpi.
   * If you are bundling your application (e.g., with webpack for development), be sure that the file names are not being mangled or hashed. The filename needs to end in Template, and the @2x image needs to have the same filename as the standard image, or MacOS will not magically invert your image's colors or use the high density image.
   * 16x16 (72dpi) and 32x32@2x (144dpi) work well for most icons.
   */
  const tray = new Tray(path.resolve('./src/assets/LogoTemplate@2x.png'))

  const contacts = [
    {
      label: 'Raphael',
      icon: path.resolve('./src/assets/Raphael.png'),
    },
    {
      label: 'Leonardo',
      icon: path.resolve('./src/assets/UserPlusTemplate@2x.png'),
    },
    {
      label: 'Donatello',
      icon: path.resolve('./src/assets/UserPlusTemplate@2x.png'),
    },
    {
      label: 'Michelangelo',
      icon: path.resolve('./src/assets/UserPlusTemplate@2x.png'),
    },
    {
      label: 'Splinter',
      icon: path.resolve('./src/assets/UserPlusTemplate@2x.png'),
    },
  ]
  // const contacts1 = [
  //   {
  //     label: 'Contacts',
  //     type: 'submenu',
  //     submenu: contacts,
  //   },
  // ]

  const contacts2 = [{ label: 'Contacts', enabled: false }, ...contacts]

  const menu = Menu.buildFromTemplate([
    ...contacts2,
    { type: 'separator' },
    {
      label: 'Add New Contact',
      icon: path.resolve('./src/assets/UserPlusTemplate@2x.png'),
    },
    { type: 'separator' },
    {
      label: 'Manual call',
      icon: path.resolve('./src/assets/ArrowUpDownTemplate@2x.png'),
    },
    { type: 'separator' },
    { label: 'Open Test Window', click: createWindow },
    { type: 'separator' },
    { role: 'about' },
    { type: 'separator' },
    { role: 'quit' },
  ])

  tray.setContextMenu(menu)
}
