import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openPicture: () => ipcRenderer.send('open-picture'),
})
