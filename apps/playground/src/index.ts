import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import type { IMember, IViewer } from './types'
import { createEmptyAudioTrack } from './shared/lib/emptyTrack'

import './components/room'
import './components/webrtc/accept-offer'
import './components/webrtc/create-offer'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js'

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  private _viewer: IViewer = {
    id: crypto.randomUUID(),
    name: 'Me',
    // FIXME: hack prevent infinite load page
    stream: new MediaStream([createEmptyAudioTrack()]),
  }

  @state()
  private _members: IMember[] = []

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
