import { LitElement, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import './components/view'
import './components/webRTC'
import './components/stats'
import './components/chat'

import { Client } from "./types";

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
      { urls: "TURN:freeturn.net:3478", username: "free", credential: "free" }
    ]
  });

  @state()
  private _channel = this._peerConnection.createDataChannel('bell')

  private async _turnOnViewerVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    this._clients[0] = { ...this._clients[0], stream },
    this.requestUpdate()

    const tracks = stream.getTracks()
    tracks.forEach((track) => this._peerConnection.addTrack(track, stream))
  }

  private _turnOffViewerVideo() {
    if (!this._clients[0].stream) return

    this._clients[0].stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  connectedCallback() {
    super.connectedCallback();

    console.log(this._channel)
    this._peerConnection.ondatachannel = (e) => {
      this._channel = e.channel

      this._channel.onopen = () => {
        console.log("channel open");
      };

      this._channel.onmessage = (e) => {
        console.log("message:", e.data);
        // messages.push(e.data);
        // render();
      };

      console.log('channel changed', this._channel)
    }
  }

  render() {
    return html`
      <button @click=${this._turnOnViewerVideo}>Turn on my camera</button>
      <button @click=${this._turnOffViewerVideo}>Turn off my camera</button>

      <div style="display: flex">
        ${repeat(this._clients, (client) => client.id, (client) => html`
          <my-view .client=${client}></my-view>
        `)}
      </div>

      <bell-webrtc .peerConnection=${this._peerConnection} .channel=${this._channel}></bell-webrtc>

      <bell-stats .peerConnection=${this._peerConnection}></bell-stats>

      <bell-chat .peerConnection=${this._peerConnection} .channel=${this._channel}></bell-chat>
    `
  }
}
