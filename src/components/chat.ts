import { LitElement, html } from "lit"
import { customElement, property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement('bell-chat')
export class Chat extends LitElement {
  @property({ type: Object })
  peerConnection?: RTCPeerConnection;

  @property({ type: Object })
  channel?: RTCDataChannel

  @state()
  private _messages: string[] = []

  @query('#bell-input')
  inputRef?: HTMLInputElement

  _sendMessage() {
    if (!this.inputRef) return
    if (!this.peerConnection) return
    if (this.peerConnection.connectionState !== 'connected') return

    const message = this.inputRef.value;
    this.inputRef.value = ''

    this._messages.push(message); // TODO: remove

    this.channel?.send(message)
    this.requestUpdate()
  }

  render() {
    return html`
      <div id="chatWrapper">
        <div id="chat">
          ${repeat(this._messages, (message) => message, (message) => html`
            <div>${message}</div>
          `)}
        </div>
        <input id="bell-input" type="text" />
        <button @click=${this._sendMessage}>send</button>
      </div>
    `
  }
}