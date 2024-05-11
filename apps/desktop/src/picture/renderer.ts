import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

import './member'
import '../../../playground/src/components/room/control' // TODO: replace
import { IMember, IViewer } from '../types'

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _viewer: IViewer = {
    id: crypto.randomUUID(),
    name: 'Me',
    stream: new MediaStream(),
  }

  @state()
  private _members: IMember[] = []

  render() {
    return html`
      <bell-member isViewer .member=${this._viewer}></bell-member>

      <bell-control
        class="bell-control"
        .viewer=${this._viewer}
        .members=${this._members}
      ></bell-control>

      <div class="drag"></div>
    `
  }

  static styles = css`
    :host {
      position: relative;
      display: block;
    }

    :host(:hover) > .bell-control {
      background: var(--sl-color-neutral-50);
    }

    .bell-control {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      background: none;
      transition: background 2s;
    }

    .drag {
      width: 20px;
      height: 20px;
      background: green;
      -webkit-app-region: drag;
      position: absolute;
      top: 0;
      right: 0;
    }
  `
}
