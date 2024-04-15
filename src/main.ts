import { LitElement, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import './components/view'
import './components/webRTC'

import { Client } from "./types";

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _clients: Client[] = [
    { id: crypto.randomUUID(), name: 'Leonardo' },
    { id: crypto.randomUUID(), name: 'Donatello' },
  ]

  private async _turnViewerVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          width: 1280,
          height: 720,
        }
      });
      this._clients[0] = { ...this._clients[0], stream }
      this.requestUpdate()
    } catch (e) {
      console.log('🙅🏻‍♂️')
    }
  }

  render() {
    return html`
      <button @click=${this._turnViewerVideo}>Turn on my camera</button>

      <div style="display: flex">
        ${repeat(this._clients, (client) => client.id, (client) => html`
          <my-view .client=${client}></my-view>
        `)}
      </div>

      <bell-webrtc></bell-webrtc>
    `
  }
}
