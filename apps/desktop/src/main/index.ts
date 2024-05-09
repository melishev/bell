import { app } from 'electron'
// import { initSystemTray } from './tray'
import { initSystemTray } from './tray2'

app.on('window-all-closed', (e) => e.preventDefault())

app.on('ready', initSystemTray)
