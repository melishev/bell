import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { IMember, IViewer } from '../types'

@customElement('bell-member')
export class Member extends LitElement {
  @property({ type: Object })
  member: IMember | IViewer

  @property({ type: Boolean })
  readonly isViewer: boolean = false

  render() {
    return html`
      <video
        class="member-stream"
        .srcObject=${this.isViewer
          ? this.member.stream
          : this.member.peerController.stream}
        autoplay
        playsinline
        disablepictureinpicture
        @canplay=${(e) => (this.isViewer ? (e.target.muted = true) : undefined)}
      ></video>
    `
  }

  static styles = css`
    video {
      display: block;
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;

      transform: scaleX(-1);
    }
  `
}
