import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('bell-outgoing-call')
export class OutgoingCall extends LitElement {
  render() {
    return html`
      <div class="overlay"></div>

      <div class="info">
        <p>Connecting ...</p>
      </div>
    `
  }

  static styles = css`
    :host {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
    }

    .overlay {
      width: 100%;
      height: 100%;
      background: #ffffff57;
      backdrop-filter: blur(2px);
      position: absolute;
      top: 0;
      left: 0;
    }

    .info {
      z-index: 1;
      text-align: center;

      p {
        font-size: 13px;
        font-weight: 400;
        margin: 0;
      }
    }
  `
}
