import { LitElement, css, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { Client } from '../types';

@customElement('my-view')
export class View extends LitElement {
  @property({ type: Object })
  client?: Client;

  @query('#bell-view-video')
  videoEl: HTMLVideoElement;
  
  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    console.log('here')
    if (changedProperties.has('client') && this.client?.stream) {
      if (this.videoEl) {
        this.videoEl.srcObject = this.client.stream;
      }
    }
  }

  render() {
    return html`
      <p>${ this.client?.name }</p>
      <video id="bell-view-video" .srcObject=${this.client?.stream} autoplay playsinline></video>
    `
  }

  static styles = css`
    :host {
      flex-grow: 1;
      background: gray;
    }

    #bell-view-video {
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