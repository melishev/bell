import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { IMember } from '../../types'
import { when } from 'lit/directives/when.js'

@customElement('bell-member')
export class Member extends LitElement {
  @property({ type: Object })
  readonly member?: IMember

  @state()
  private _stream: MediaStream

  async updateStream(constraints: MediaStreamConstraints) {
    this._stream = await navigator.mediaDevices.getUserMedia(constraints)
  }

  private async _turnViewerVideoTrack() {
    if (!this.member) return

    if (this.member.stream) {
      this.member.stream.getTracks().forEach((track) => {
        track.stop()
      })
    } else {
      await this.updateStream({ video: true })
      // this.dispatchEvent(new CustomEvent('update:member', { detail: }))
      // TODO: послать событие на обновление мембера
      this.member.stream = this._stream
      this.requestUpdate()

      const tracks = this._stream.getTracks()
      console.log(tracks)
    }
  }

  /** switch the member's video track */
  private _turnVideoTrack() {
    // если это вьюер
    if (true) {
      this._turnViewerVideoTrack()
    } else {
      this._turnMemberVideoTrack()
    }
  }

  // /** switch the member's audio track */
  // private _turnAudioTrack() {}

  private async _turnOnViewerVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    this._clients[0] = { ...this._clients[0], stream }
    this.requestUpdate()

    const tracks = stream.getTracks()
    tracks.forEach((track) => this._peerConnection.addTrack(track, stream))

    // this._peerConnection.ontrack = (e) => {
    //   this._clients[1] = { ...this._clients[1], stream: e.streams[0] }
    //   this.requestUpdate()
    // }
  }

  private _turnOffViewerVideo() {
    if (!this._clients[0].stream) return

    this._clients[0].stream.getTracks().forEach((track) => {
      track.stop()
    })
  }

  async connectedCallback() {
    super.connectedCallback()

    console.log(await navigator.mediaDevices.enumerateDevices())
  }

  render() {
    return html`
      ${when(
        this.member,
        (member) => html`
          <p>${member.name}</p>
          <video .srcObject=${member.stream} autoplay playsinline></video>

          <button @click=${this._turnVideoTrack}>Turn on camera</button>
          <button @click=${this._turnOffViewerVideo}>Turn off camera</button>
        `,
        () => html`<p>oops</p> `
      )}
    `
  }

  static styles = css`
    :host {
      flex-grow: 1;
      background: gray;
    }

    video {
      width: 100%;
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  `
}

// declare global {
//   interface HTMLElementTagNameMap {
//     'bell-member': Member
//   }
// }
