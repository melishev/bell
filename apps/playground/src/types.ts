import { PeerController } from './components/webrtc/peer.controller'

interface IUser {
  id: string
  name: string
}

export interface IMember extends IUser {
  peerController: PeerController
}

export interface IViewer extends IUser {
  stream: MediaStream
}
