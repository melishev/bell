import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import type { IMember } from './types'

import './components/room'
import './components/webRTC'
import './components/chat'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/') ;

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _viewer: IMember = {
    id: crypto.randomUUID(),
    name: 'Me',
  }

  @state()
  private _members: IMember[] = [
    { id: crypto.randomUUID(), name: 'Someone else' },
  ]

  @state()
  private _peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: 'TURN:freeturn.net:3478', username: 'free', credential: 'free' },
    ],
  })

  @state()
  private _channel = this._peerConnection.createDataChannel('bell')

  private _handleUpdateViewer(e) {
    this._viewer = e.detail
  }

  private _handleUpdateMembers(e) {
    this._members = e.detail
  }

  render() {
    return html`
      <bell-room
        .viewer=${this._viewer}
        .members=${this._members}
        .peerConnection=${this._peerConnection}
        @update:viewer=${this._handleUpdateViewer}
        @update:members=${this._handleUpdateMembers}
      ></bell-room>

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
