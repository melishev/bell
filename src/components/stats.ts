import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('bell-stats')
export class Stats extends LitElement {
  @property({ type: Object })
  peerConnection: RTCPeerConnection;

  @state()
  private _senders: any
  
  senders() {
    console.log(this.peerConnection.getSenders())
    console.log(this.peerConnection)
    this._senders = this.peerConnection.getSenders()
  }

  render() {
    return html`
      <button @click=${this.senders}>Senders</button>
      <pre>${JSON.stringify(this._senders)}</pre>
    `
  }
}