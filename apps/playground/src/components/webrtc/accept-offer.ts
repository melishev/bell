import { LitElement, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { IMember, IViewer } from '../../types'
import { compressSDP, decompressSDP } from '../../shared/lib/crypto'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { PeerController } from './peer.controller'

@customElement('bell-accept-offer')
export class AcceptOffer extends LitElement {
  @property({ type: Object })
  readonly viewer?: IViewer

  @property({ type: Array })
  readonly members?: IMember[]

  @state()
  private _peerController?: PeerController

  @query('#drawer-accept')
  drawerAccept?: SlDrawer

  async createNewMember() {
    if (!this.viewer) return
    if (!Array.isArray(this.members)) return

    this._peerController = new PeerController(this, this.viewer?.stream)

    const member: IMember = {
      id: crypto.randomUUID(),
      name: `Someone else #${this.members.length + 1}`,
      peerController: this._peerController,
    }

    const updatedMembers = [...this.members]
    updatedMembers.push(member)

    this.dispatchEvent(
      new CustomEvent('update:members', {
        composed: true,
        detail: updatedMembers,
      })
    )
  }

  async handleClickAcceptOffer() {
    if (!this.drawerAccept) return
    if (!Array.isArray(this.members)) return

    await this.createNewMember()

    this.drawerAccept.show()
  }

  async handleReceivedOffer(e: InputEvent) {
    if (!this._peerController) return
    if (!Array.isArray(this.members)) return

    const { value } = e.target as HTMLTextAreaElement
    const offer = decompressSDP(value)

    this._peerController.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    )

    const answer = await this._peerController.peerConnection.createAnswer()
    this._peerController.peerConnection.setLocalDescription(answer)
  }

  render() {
    const compressedAnswer = this._peerController?.peerConnection
      .localDescription
      ? compressSDP(this._peerController.peerConnection.localDescription)
      : ''

    return html`
      <sl-button @click=${this.handleClickAcceptOffer}>
        Accept offer
      </sl-button>
      <sl-drawer id="drawer-accept" label="Accept offer">
        <sl-textarea
          label="Offer"
          size="small"
          help-text="Paste here the offer you received from your contact"
          @sl-input=${this.handleReceivedOffer}
        ></sl-textarea>

        <sl-textarea
          label="Answer"
          size="small"
          value=${compressedAnswer}
          readonly
          help-text="Copy this invitation and send it to your contact"
        ></sl-textarea>

        <sl-button slot="footer" variant="primary">Close</sl-button>
      </sl-drawer>
    `
  }
}
