import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  openPicture: (id) => ipcRenderer.send('open-picture', id),
  callToContact: (id) => ipcRenderer.send('call-to-contact', id),
  sendLocalSDP: (value: RTCSessionDescription) =>
    ipcRenderer.send('local-sdp', value),

  quit: () => ipcRenderer.send('quit'),

  onLocalData: (callback) =>
    ipcRenderer.on('local-data', (_event, value) => callback(value)),
  onType: (callback) =>
    ipcRenderer.on('type', (_event, value) => callback(value)),
  onRemoteSDP: (callback: (value: RTCSessionDescription) => void) =>
    ipcRenderer.on('remote-sdp', (_event, value) => callback(value)),
})
