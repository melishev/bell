import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import './components/room'
import './components/webRTC'
import './components/chat'

import { IMember } from './types'

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _members: IMember[] = [
    { id: crypto.randomUUID(), name: 'Leonardo' },
    { id: crypto.randomUUID(), name: 'Donatello' },
  ]

  @state()
  private _peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free' },
    ],
  })

  @state()
  private _channel = this._peerConnection.createDataChannel('bell')

  render() {
    return html`
      <bell-room .members=${this._members}></bell-room>

      <bell-webrtc
        .peerConnection=${this._peerConnection}
        .channel=${this._channel}
      ></bell-webrtc>

      <bell-chat
        .peerConnection=${this._peerConnection}
        .channel=${this._channel}
        @update:channel=${(e) => (this._channel = e.detail)}
      ></bell-chat>
    `
  }
}
