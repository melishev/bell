import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { IMember, IViewer } from '../types'

import '../components/button'

@customElement('bell-control')
export class Control extends LitElement {
  @property({ type: Object })
  readonly viewer?: IViewer

  @property({ type: Array })
  readonly members?: IMember[]

  @property({ type: Object })
  readonly initialConstraints?: MediaStreamConstraints

  @state()
  private _constraints: MediaStreamConstraints = {
    video: false,
    audio: false,
  }

  connectedCallback(): void {
    super.connectedCallback()

    if (this.initialConstraints) {
      if (this.initialConstraints.video) {
        this._turnViewerVideo()
      }

      if (this.initialConstraints.audio) {
        this._turnViewerAudio()
      }
    }
  }

  private async _updateStream() {
    if (!this.viewer) return
    if (!this.viewer.stream) return

    const stream = await navigator.mediaDevices.getUserMedia(this._constraints)

    for (const track of this.viewer.stream.getTracks()) {
      this.viewer.stream.removeTrack(track)
    }

    for (const track of stream.getTracks()) {
      this.viewer.stream.addTrack(track)

      // if (this.members?.length) {
      //   for (let member of this.members) {
      //     // const senders = member.peerConnection.getSenders()
      //     // const senders = member.peerController.peerConnection.getSenders()
      //     // if (senders.length) {
      //     //   for await (let sender of senders) {
      //     //     await sender.replaceTrack(track)
      //     //   }
      //     // } else {
      //     // member.peerConnection.addTrack(track, this.viewer.stream)
      //     // member.peerController.peerConnection.addTrack(
      //     //   track,
      //     //   this.viewer.stream
      //     // )
      //     // }
      //   }
      // }
    }

    if (this.members?.length) {
      for (const member of this.members) {
        member.peerController.addTrackToPeerConnection()
      }
    }
  }

  private async _turnViewerVideo() {
    if (!this.viewer) return

    if (this.viewer.stream && this._constraints.video) {
      this._constraints = { ...this._constraints, video: false }
      const tracks = this.viewer.stream.getVideoTracks()
      for (const track of tracks) {
        track.stop()
        this.viewer.stream.removeTrack(track)

        // if (this.members?.length) {
        //   for (let member of this.members) {
        //     // member.peerConnection.addTrack(track, this.viewer.stream)
        //     member.peerConnection.removeTrack(track)
        //   }
        // }
      }
      return
    }

    this._constraints = { ...this._constraints, video: true }
    await this._updateStream()
  }

  private async _turnViewerAudio() {
    if (!this.viewer) return

    if (this.viewer.stream && this._constraints.audio) {
      this._constraints = { ...this._constraints, audio: false }
      const tracks = this.viewer.stream.getAudioTracks()
      for (const track of tracks) {
        track.stop()
        this.viewer.stream.removeTrack(track)
      }
      return
    }

    this._constraints = { ...this._constraints, audio: true }
    await this._updateStream()
  }

  render() {
    const enabledVideo = !!this._constraints.video
    const enabledAudio = !!this._constraints.audio

    const videoIcon = enabledVideo
      ? html`<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-video"
        >
          <path
            d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"
          />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>`
      : html`<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF2727"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-video-off"
        >
          <path
            d="M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196"
          />
          <path d="M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
          <path d="m2 2 20 20" />
        </svg>`

    const audioIcon = enabledAudio
      ? html`<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000000"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-mic"
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>`
      : html`<svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#EF2727"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-mic-off"
        >
          <line x1="2" x2="22" y1="2" y2="22" />
          <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
          <path d="M5 10v2a7 7 0 0 0 12 5" />
          <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>`

    return html`
      <bell-button @click=${this._turnViewerVideo}>${videoIcon}</bell-button>

      <bell-button @click=${this._turnViewerAudio}>${audioIcon}</bell-button>
    `
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  `
}
