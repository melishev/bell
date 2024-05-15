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
import '../features/control'
import '../features/inviteCode'
import '../features/responseCode'
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

  @state()
  private _inviteOrResponse?: 'invite' | 'response'

  private _handleUpdateMembers(e) {
    this._members = e.detail
  }

  // TODO: решить, как выводить invite code или response code
  render() {
    return this._inviteOrResponse === undefined
      ? html`
          <button @click=${() => (this._inviteOrResponse = 'invite')}>
            Invite
          </button>
          <button @click=${() => (this._inviteOrResponse = 'response')}>
            Response
          </button>
        `
      : this._inviteOrResponse === 'invite'
        ? html`
            <bell-invite-code
              .viewer=${this._viewer}
              .members=${this._members}
              @update:members=${this._handleUpdateMembers}
            ></bell-invite-code>
          `
        : html`
            <bell-response-code
              .viewer=${this._viewer}
              .members=${this._members}
              @update:members=${this._handleUpdateMembers}
            ></bell-response-code>
          `
    // : html`
    //     <bell-member isViewer .member=${this._viewer}></bell-member>

    //     <bell-button class="close" size="small">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         width="16"
    //         height="16"
    //         viewBox="0 0 24 24"
    //         fill="none"
    //         stroke="currentColor"
    //         stroke-width="1.5"
    //         stroke-linecap="round"
    //         stroke-linejoin="round"
    //         class="lucide lucide-x"
    //       >
    //         <path d="M18 6 6 18" />
    //         <path d="m6 6 12 12" />
    //       </svg>
    //     </bell-button>

    //     <bell-control
    //       class="bell-control"
    //       .viewer=${this._viewer}
    //       .members=${this._members}
    //     ></bell-control>
    //   `
  }

  static styles = css`
    :host {
      /* -webkit-app-region: drag; */

      position: relative;
      display: block;
    }

    /* :host(:hover) > .bell-control {
      display: flex;
    } */

    .close {
      -webkit-app-region: no-drag;

      position: absolute;
      top: 8px;
      left: 8px;
    }

    .bell-control {
      -webkit-app-region: no-drag;

      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);

      background: none;
      transition: background 2s;
    }
  `
}
