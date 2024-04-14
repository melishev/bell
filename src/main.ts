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
    { id: crypto.randomUUID(), name: 'Leonardo', stream: null },
    { id: crypto.randomUUID(), name: 'Donatello', stream: null },
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
      this._clients[0].stream = stream
      // this._clients[0].id = crypto.randomUUID()
    } catch (e) {
      console.log('🙅🏻‍♂️')
    }
  }

  render() {
    return html`
      <button @click=${this._turnViewerVideo}>Turn on my camera</button>

      <div style="display: flex; flex-wrap: wrap;">
        ${repeat(this._clients, (client) => client.id + client.stream?.id, (client) => html`
          <my-view .client=${client}></my-view>
        `)}
      </div>

      <bell-webrtc></bell-webrtc>
    `
  }
}
