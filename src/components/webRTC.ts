import { LitElement, html } from "lit";
import { customElement, query, state } from "lit/decorators.js";

@customElement('bell-webrtc')
export class WebRTC extends LitElement {

  peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: "TURN:freeturn.net:3478", username: "free", credential: "free" }
    ]
  });

  @state()
  private _dataChannel: RTCDataChannel

  @state()
  private _token: string

  private async _createOffer() {
    // TODO: поправить
    this.peerConnection.onicecandidate = async () => {
      console.log("offer token");
      console.log(JSON.stringify(this.peerConnection.localDescription));
  
      // const en = await this.hashString(JSON.stringify(this.peerConnection.localDescription))
      // console.log(en)
    };

    const offer = await this.peerConnection.createOffer();
    this.peerConnection.setLocalDescription(offer);
  }

  private _setDataChannel(channel: RTCDataChannel) {
    this._dataChannel = channel
    this._dataChannel.onopen = () => {
      console.log("channel open");
    };
    this._dataChannel.onmessage = (e) => {
      console.log("message:", e.data);
      // messages.push(e.data);
      // render();
    };
  }

  private _handleButtonOfferClick() {
    const channel = this.peerConnection.createDataChannel("bell")
    this._setDataChannel(channel)

    this._createOffer()
  }

  private async _handleButtonAccept() {
    const typeToken = this.shadowRoot?.querySelector('input[name="type"]:checked')?.value

    if (typeToken === "offer") {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(this._token)))

      this.peerConnection.onicecandidate = () => {
        console.log("answer token");
        console.log(JSON.stringify(this.peerConnection.localDescription));
      };

      this.peerConnection.ondatachannel = (e) => {
        this._setDataChannel(e.channel)
      };

      const answer = await this.peerConnection.createAnswer();
      this.peerConnection.setLocalDescription(answer);
    } else {
      this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(this._token))
      );
    }
  }

  private _handleTextarea(e: Event) {
    this._token = (e.target as HTMLTextAreaElement).value
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