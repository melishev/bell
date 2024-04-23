import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IMember } from '../../types'
import { repeat } from 'lit/directives/repeat.js'

import './member'
import { when } from 'lit/directives/when.js'

@customElement('bell-room')
export class Room extends LitElement {
  @property({ type: Array })
  readonly members?: IMember[]

  @property({ type: Object })
  readonly peerConnection?: RTCPeerConnection

  connectedCallback() {
    super.connectedCallback()

    if (!this.peerConnection) return

    this.peerConnection.ontrack = (e) => {
      if (!this.members) return

      // this.members[1] = { ...this._clients[1], stream: e.streams[0] }
      // TODO: добавить эвент на обновление мембера
      // this.requestUpdate()
    }
  }

  render() {
    return html`
      ${when(
        this.members,
        (members) =>
          html`<div style="display: flex">
            ${repeat(
              members,
              (member) => member.id,
              (member) => html` <bell-member .member=${member}></bell-member> `
            )}
          </div>`,
        () => html`<p>Members not exist</p>`
      )}
    `
  }
}
