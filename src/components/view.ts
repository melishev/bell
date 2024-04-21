import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { Client } from '../types'

@customElement('my-view')
export class View extends LitElement {
  @property({ type: Object })
  client?: Client

  render() {
    return html`
      <p>${this.client?.name}</p>
      <video .srcObject=${this.client?.stream} autoplay playsinline></video>
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

declare global {
  interface HTMLElementTagNameMap {
    'my-view': View
  }
}
