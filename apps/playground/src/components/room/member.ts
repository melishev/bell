import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IMember, IViewer } from '../../types'
import { when } from 'lit/directives/when.js'

@customElement('bell-member')
export class Member extends LitElement {
  @property({ type: Object })
  readonly member?: IMember | IViewer

  @property({ type: Boolean })
  readonly isViewer: boolean = false

  render() {
    return html`
      ${when(
        this.member,
        (member) => html`
          <div class="member-avatar">
            <sl-icon class="member-avatar-icon" name="person"></sl-icon>
          </div>

          <video
            class="member-stream"
            .srcObject=${this.isViewer
              ? member.stream
              : member.peerController.stream}
            autoplay
            playsinline
            disablepictureinpicture
            @canplay=${(e) =>
              this.isViewer ? (e.target.muted = true) : undefined}
          ></video>

          <p class="member-name">${member.name}</p>
        `,
        () => html`<p>oops</p> `
      )}
    `
  }

  static styles = css`
    :host {
      width: 100%;
      max-width: 50vw;
      position: relative;
      background: var(--sl-color-neutral-700);
      border-radius: var(--sl-border-radius-large);
      overflow: hidden;
    }

    .member-avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;

      * {
        font-size: 64px;
      }
    }

    .member-stream {
      width: 100%;

      aspect-ratio: 16 / 9;
      object-fit: cover;

      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }

    .member-name {
      position: absolute;
      bottom: 10px;
      left: 10px;

      padding: 2px 8px;
      margin: 0;
      background: var(--sl-overlay-background-color);
      backdrop-filter: blur(10px);

      font-size: var(--sl-font-size-small);

      color: var(--sl-color-neutral-0);
    }
  `
}
