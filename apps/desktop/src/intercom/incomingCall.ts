import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

// SVG
import PhoneSVG from '../assets/svg/phone.svg?raw'
import PhoneOffSVG from '../assets/svg/phone-off.svg?raw'

@customElement('bell-incoming-call')
export class IncomingCall extends LitElement {
  private _acceptIncomingCall() {
    console.log('accept call')

    this.dispatchEvent(new CustomEvent('call:accept'))
  }

  private _rejectIncomingCall() {
    console.log('reject call')

    this.dispatchEvent(new CustomEvent('call:reject'))
  }

  render() {
    return html`
      <div class="overlay"></div>

      <div class="info">
        <span>Donatello</span>
        <p>is calling you</p>
      </div>

      <div class="actions">
        <bell-button @click=${this._rejectIncomingCall}>
          ${unsafeHTML(PhoneOffSVG)}
        </bell-button>
        <bell-button @click=${this._acceptIncomingCall}>
          ${unsafeHTML(PhoneSVG)}
        </bell-button>
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
      justify-content: space-between;
      padding: 18px 0 8px 0;
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

      span {
        font-size: 26px;
        font-weight: 700;
      }

      p {
        font-size: 13px;
        font-weight: 400;
        margin: 0;
      }
    }

    .actions {
      display: flex;
      gap: 10px;

      bell-button {
        stroke: #00b607 !important; // #EF2727
      }
    }
  `
}
