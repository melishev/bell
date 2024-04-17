import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement('bell-webrtc')
export class WebRTC extends LitElement {
  @property({ type: Object })
  peerConnection?: RTCPeerConnection

  @property({ type: Object })
  channel?: RTCDataChannel

  @state()
  private _token?: RTCSessionDescriptionInit

  private async _createOffer() {
    if (!this.peerConnection) return

    // TODO: fix
    this.peerConnection.onicecandidate = async () => {
      if (!this.peerConnection) return

      console.log("Offer:", this.peerConnection.localDescription);

      const encoded = btoa(JSON.stringify(this.peerConnection.localDescription))
      console.log(encoded)
    };

    const offer = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(offer);
  }

  private _setDataChannel() {
    if (!this.channel) return

    // this._dataChannel = channel
    this.channel.onopen = () => {
      console.log("channel open");
    };
    this.channel.onmessage = (e) => {
      console.log("message:", e.data);
      // messages.push(e.data);
      // render();
    };
  }

  private _handleButtonOfferClick() {
    if (!this.peerConnection) return

    // const channel = this.peerConnection.createDataChannel("bell")
    this._setDataChannel()

    this._createOffer()
  }

  private async _handleButtonAccept() {
    if (!this._token) return
    if (!this.peerConnection) return

    const typeToken = this.shadowRoot?.querySelector('input[name="type"]:checked')?.value

    if (typeToken === "offer") {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(this._token))

      this.peerConnection.onicecandidate = () => {
        if (!this.peerConnection) return
        console.log("Answer:", this.peerConnection.localDescription);

        const encoded = btoa(JSON.stringify(this.peerConnection.localDescription))
        console.log(encoded)
      };

      const answer = await this.peerConnection.createAnswer();
      this.peerConnection.setLocalDescription(answer);
    } else {
      this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(this._token)
      );
    }
  }

  private _handleTextarea(e: Event) {
    const { value } = (e.target as HTMLTextAreaElement)
    this._token = JSON.parse(atob(value))
  }

  render() {
    return html`
      <button @click=${this._handleButtonOfferClick}>Generate Offer</button>

      <div>
        <label>
          <input type="radio" name="type" value="answer" checked />
          answer
        </label>
        <label>
          <input type="radio" name="type" value="offer" />
          offer
        </label>
      </div>

      <textarea @input=${this._handleTextarea}></textarea>
      <button @click=${this._handleButtonAccept}>connect</button>

      <div>
        <div id="chatWrapper">
          <div id="chat"></div>
          <input type="text" id="chatText" />
          <button id="sendMessage">send</button>
        </div>
      </div>
    `
  }
}