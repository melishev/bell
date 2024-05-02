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

  handleUpdateMember(e) {
    if (!this.members) return

    const member = e.detail

    const updatedMembers = [...this.members]
    updatedMembers.splice(0, 1, member)

    this.dispatchEvent(
      new CustomEvent('update:members', {
        composed: true,
        detail: updatedMembers,
      })
    )
  }

  render() {
    return html`
      <div class="room-members">
        <bell-member
          isViewer
          .member=${this.viewer}
          @update:member=${this.handleUpdateMember}
        ></bell-member>

        ${when(
          this.members,
          (members) => html`
            ${repeat(
              members,
              (member) => member.id,
              (member) =>
                html`<bell-member
                  .member=${member}
                  @update:member=${this.handleUpdateMember}
                ></bell-member>`
            )}
          `,
          () => html`<p>Members not exist</p>`
        )}
      </div>

      <bell-control
        .viewer=${this.viewer}
        .members=${this.members}
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
      justify-items: center;
      align-items: center;

      * {
        aspect-ratio: 16 / 9;
      }
    }
  `
}
