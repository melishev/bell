import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { IMember, IViewer } from '../../types'

@customElement('bell-control')
export class Control extends LitElement {
  @property({ type: Object })
  readonly viewer?: IViewer

  @property({ type: Array })
  readonly members?: IMember[]

  @state()
  private _constraints: MediaStreamConstraints = {
    video: false,
    audio: false,
  }

  private async _updateStream() {
    if (!this.viewer) return
    if (!this.viewer.stream) return

    const stream = await navigator.mediaDevices.getUserMedia(this._constraints)

    const tracks = stream.getTracks()
    for (let track of tracks) {
      this.viewer.stream.addTrack(track)

      // TODO: код, обновления трека при изначальном коннекте с стримом, если изначальный коннект был без стрима, добавит и вызовет onnegotiationneeded
      if (this.members?.length) {
        for (let member of this.members) {
          const senders = member.peerConnection.getSenders()

          if (senders.length) {
            for (let sender of senders) {
              sender.replaceTrack(track)
            }
          } else {
            member.peerConnection.addTrack(track, this.viewer.stream)
          }
        }
      }
    }
  }

  private async _turnViewerVideo() {
    if (!this.viewer) return

    if (this.viewer.stream && this._constraints.video) {
      this._constraints = { ...this._constraints, video: false }
      const tracks = this.viewer.stream.getVideoTracks()
      for (let track of tracks) {
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
      for (let track of tracks) {
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

    return html`
      <sl-icon-button
        class=${enabledVideo ? 'enabled' : 'disabled'}
        name=${enabledVideo ? 'camera-video' : 'camera-video-off'}
        label="turn camera"
        @click=${this._turnViewerVideo}
      ></sl-icon-button>

      <sl-icon-button
        class=${enabledAudio ? 'enabled' : 'disabled'}
        name=${enabledAudio ? 'mic' : 'mic-mute'}
        label="turn microphone"
        @click=${this._turnViewerAudio}
      ></sl-icon-button>
    `
  }

  static styles = css`
    :host {
      width: 80%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: var(--sl-color-neutral-50);
      border-radius: var(--sl-border-radius-x-large)
        var(--sl-border-radius-x-large) 0 0;

      margin: 0 auto 0 auto;
    }

    sl-icon-button {
      &::part(base) {
        font-size: 2rem;
      }

      &::part(base):hover {
        background: var(--sl-color-neutral-100);
      }

      &::part(base):focus {
        background: var(--sl-color-neutral-100);
      }

      &.disabled {
        &::part(base) {
          color: var(--sl-color-danger-500);
        }

        &::part(base):hover {
          color: var(--sl-color-danger-400);
        }

        &::part(base):focus {
          color: var(--sl-color-danger-400);
        }
      }

      &.enabled {
        &::part(base) {
          color: var(--sl-color-neutral-500);
        }

        &::part(base):hover {
          color: var(--sl-color-neutral-600);
        }

        &::part(base):focus {
          color: var(--sl-color-neutral-600);
        }
      }
    }
  `
}
