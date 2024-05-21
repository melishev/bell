import { app, systemPreferences } from 'electron'
// import { initSystemTray } from './tray'
import { initSystemTray } from './tray2'

systemPreferences.askForMediaAccess('microphone')
systemPreferences.askForMediaAccess('camera')

app.on('window-all-closed', (e) => e.preventDefault())

app.on('ready', initSystemTray)
