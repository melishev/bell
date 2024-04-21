import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import './components/view'
import './components/webRTC'
import './components/chat'

import { Client } from './types'

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _clients: Client[] = [
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

  private async _turnOnViewerVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    })
    this._clients[0] = { ...this._clients[0], stream }
    this.requestUpdate()

    const tracks = stream.getTracks()
    tracks.forEach((track) => this._peerConnection.addTrack(track, stream))

    this._peerConnection.ontrack = (e) => {
      this._clients[1] = { ...this._clients[1], stream: e.streams[0] }
      this.requestUpdate()
    }
  }

  private _turnOffViewerVideo() {
    if (!this._clients[0].stream) return

    this._clients[0].stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  render() {
    return html`
      <button @click=${this._turnOnViewerVideo}>Turn on my camera</button>
      <button @click=${this._turnOffViewerVideo}>Turn off my camera</button>

      <div style="display: flex">
        ${repeat(
          this._clients,
          (client) => client.id,
          (client) => html` <my-view .client=${client}></my-view> `
        )}
      </div>

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
