import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { IMember } from '../../types'
import { when } from 'lit/directives/when.js'
import { repeat } from 'lit/directives/repeat.js'

import './member'
import './control'

@customElement('bell-room')
export class Room extends LitElement {
  @property({ type: Object })
  readonly viewer?: IMember

  @property({ type: Array })
  readonly members?: IMember[]

  @property({ type: Object })
  readonly peerConnection?: RTCPeerConnection

  connectedCallback() {
    super.connectedCallback()

    if (!this.peerConnection) return

    this.peerConnection.ontrack = (e) => {
      if (!this.members) return

      const updatedMembers = [...this.members]
      updatedMembers.splice(0, 1, {
        ...this.members[0],
        stream: e.streams[0],
      })

      this.dispatchEvent(
        new CustomEvent('update:members', {
          composed: true,
          detail: updatedMembers,
        })
      )
    }
  }

  render() {
    return html`
      <div class="room-members">
        <bell-member .member=${this.viewer} viewer></bell-member>

        ${when(
          this.members,
          (members) => html`
            ${repeat(
              members,
              (member) => member.id,
              (member) => html`<bell-member .member=${member}></bell-member>`
            )}
          `,
          () => html`<p>Members not exist</p>`
        )}
      </div>

      <bell-control
        .viewer=${this.viewer}
        .peerConnection=${this.peerConnection}
      ></bell-control>
    `
  }

  static styles = css`
    :host {
      width: 100%;
      display: block;
      flex-wrap: wrap;
      background: var(--sl-color-neutral-900);
    }

    .room-members {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 10px;
      padding: 10px;

      * {
        aspect-ratio: 16 / 9;
      }
    }
  `
}
