export interface IMember {
  id: string
  name: string
  stream: MediaStream
  peerConnection: RTCPeerConnection
}

export interface IViewer extends Omit<IMember, 'peerConnection'> {}
