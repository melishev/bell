import { LitElement, html, css, nothing } from 'lit'
import { customElement, state } from 'lit/decorators.js'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

import './incomingCall'
import './outgoingCall'

import '../components/button'

import './member'
import '../features/control'
import '../features/inviteCode'
import '../features/responseCode'
import { IMember, IViewer } from '../types'
import { PeerController } from '../../../playground/src/components/webrtc/peer.controller'

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

  // FIXME: надо понять, как отправить из main в renderer, до события callback
  @state()
  private _callType: 'outgoing' | 'incoming'

  @state()
  private _currentCallStatus: 'connection' | 'connected' // TODO: можно брать состояние из webrtc

  // TODO: при открытии окна, важно учитывать на какой стороне его открывают, исходящей или принимающей
  async connectedCallback(): Promise<void> {
    super.connectedCallback()

    const peerController = new PeerController(this, this._viewer.stream)

    window.electron.onType(async (value) => {
      this._callType = value

      if (this._callType === 'outgoing') {
        const offer = await peerController.peerConnection.createOffer()
        peerController.peerConnection.setLocalDescription(offer)

        window.electron.sendLocalSDP(offer)
      }

      this.requestUpdate()
    })

    window.electron.onRemoteSDP(async (value) => {
      // TODO: возможно будут проблемы, так как он должен выполняться до создания answer
      peerController.peerConnection.setRemoteDescription(value)

      if (this._callType === 'incoming') {
        const answer = await peerController.peerConnection.createAnswer()
        peerController.peerConnection.setLocalDescription(answer)

        window.electron.sendLocalSDP(answer)
      }

      this.requestUpdate()
    })

    const member: IMember = {
      id: crypto.randomUUID(),
      name: `Someone else #1`,
      peerController: peerController,
    }

    const updatedMembers = [...this._members]
    updatedMembers.push(member)
    this._members = updatedMembers
  }

  private _handleAcceptCall() {
    // создать на этой стороне клиента peerconnection
    // принять входящий оффер, и положить его в remoteDescription
    // ------------
    // сгенерировать ответ и отправить его по ws
  }

  private _handleRejectCall() {}

  render() {
    const callStatus1 =
      this._callType === 'incoming'
        ? html`<bell-incoming-call
            @call:accept=${this._handleAcceptCall}
            @call:reject=${this._handleRejectCall}
          ></bell-incoming-call>`
        : html`<bell-outgoing-call></bell-outgoing-call>`

    const callStatus = this._callType ? callStatus1 : nothing

    return html`
      <bell-member isViewer .member=${this._viewer}></bell-member>

      ${callStatus}

      <bell-button class="close" size="small" @click=${() => window.close()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-x"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </bell-button>

      <bell-control
        class="bell-control"
        .viewer=${this._viewer}
        .members=${this._members}
        .initialConstraints=${{ video: true, audio: false }}
      ></bell-control>
    `
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
      /* left: 50%; */
      /* transform: translateX(-50%); */
      left: 8px;
    }
  `
}
