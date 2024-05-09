import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'

import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/copy-button/copy-button.js'

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

@customElement('bell-menu')
export class Menu extends LitElement {
  render() {
    return html`
      <div class="qwe1">
        <p>Invite code</p>
        <sl-copy-button from="invite-code"></sl-copy-button>
        <span id="invite-code">
          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
        </span>
      </div>

      <hr />

      <sl-textarea
        placeholder="Response code"
        size="small"
        resize="none"
      ></sl-textarea>

      <sl-textarea
        placeholder="Invite code"
        size="small"
        resize="none"
      ></sl-textarea>

      <hr />

      <div class="qwe1">
        <p>Response code</p>
        <sl-copy-button from="response-code"></sl-copy-button>
        <span id="response-code">
          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
        </span>
      </div>
    `
  }

  static styles = css`
    /* :host {
      overflow: hidden;
    } */

    sl-textarea::part(base) {
      background: #fff;
      border: none;
    }

    sl-textarea::part(base) {
      box-shadow: none;
    }

    sl-textarea::part(textarea) {
      padding: 10px;
    }

    sl-textarea::part(textarea)::placeholder {
      font-size: 13px;
      font-family: 'SF Pro'; // FIXME:
      font-weight: 500;
      color: #919191;
    }

    hr {
      height: 1px;
      background: #f7f7f7;
      border: unset;
      margin: unset;
    }

    .qwe1 {
      margin: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      p {
        /* font-family: 'SF Pro'; */
        font-weight: 600;
        font-size: 13px;
        color: #4c4c4c;
        margin: unset;
      }

      sl-copy-button {
      }

      span {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;

        font-weight: 500;
        font-size: 10px;
        line-height: 16px;
        color: #8b8b8b;
        word-break: break-all;
      }
    }
  `
}
