import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import type { IMember, IViewer } from './types'

import './components/room'
import './components/webrtc2/accept-offer'
import './components/webrtc2/create-offer'
import './components/chat'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _viewer: IViewer = {
    id: crypto.randomUUID(),
    name: 'Me',
    stream: new MediaStream(),
  }

  // TODO: переделать в Map
  @state()
  private _members: IMember[] = []

  private _handleUpdateViewer(e) {
    this._viewer = e.detail
  }

  private _handleUpdateMembers(e) {
    this._members = e.detail
  }

  render() {
    return html`
      <bell-room
        .viewer=${this._viewer}
        .members=${this._members}
        @update:members=${this._handleUpdateMembers}
      ></bell-room>

      <bell-create-offer
        .viewer=${this._viewer}
        .members=${this._members}
        @update:members=${this._handleUpdateMembers}
      ></bell-create-offer>
      <bell-accept-offer
        .viewer=${this._viewer}
        .members=${this._members}
        @update:members=${this._handleUpdateMembers}
      ></bell-accept-offer>
    `
  }
}
