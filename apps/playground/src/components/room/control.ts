import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { IMember } from '../../types'

import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'

@customElement('bell-control')
export class Control extends LitElement {
  @property({ type: Object })
  readonly viewer?: IMember

  @property({ type: Object })
  readonly peerConnection?: RTCPeerConnection

  @state()
  private _constraints: MediaStreamConstraints = {
    video: false,
    audio: false,
  }

  private async _updateStream() {
    const stream = await navigator.mediaDevices.getUserMedia(this._constraints)
    this.dispatchEvent(
      new CustomEvent('update:viewer', {
        composed: true,
        detail: { ...this.viewer, stream },
      })
    )

    // TODO:
    const tracks = stream.getTracks()
    tracks.forEach((track) => this.peerConnection?.addTrack(track, stream))
  }

  private async _turnViewerVideo() {
    if (!this.viewer) return

    if (this.viewer.stream && this._constraints.video) {
      this._constraints = { ...this._constraints, video: false }
      this.viewer.stream.getVideoTracks().forEach((track) => track.stop())
      return
    }

    this._constraints = { ...this._constraints, video: true }
    await this._updateStream()
  }

  private async _turnViewerAudio() {
    if (!this.viewer) return

    if (this.viewer.stream && this._constraints.audio) {
      this._constraints = { ...this._constraints, audio: false }
      this.viewer.stream.getAudioTracks().forEach((track) => track.stop())
      return
    }

    this._constraints = { ...this._constraints, audio: true }
    await this._updateStream()
  }

  render() {
    const enabledVideo = this.viewer?.stream
      ?.getVideoTracks()
      .some((track) => track.readyState === 'live')
    const enabledAudio = this.viewer?.stream
      ?.getAudioTracks()
      .some((track) => track.readyState === 'live')

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
