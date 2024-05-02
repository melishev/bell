import { LitElement, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { IMember, IViewer } from '../../types'
import { compressSDP, decompressSDP } from '../../shared/lib/crypto'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { PeerController } from './peer.controller'

@customElement('bell-create-offer')
export class CreateOffer extends LitElement {
  @property({ type: Object })
  readonly viewer?: IViewer

  @property({ type: Array })
  readonly members?: IMember[]

  @state()
  private _peerController?: PeerController

  @query('#drawer-create')
  drawerCreate?: SlDrawer

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

  async handleClickCreateOffer() {
    if (!this.drawerCreate) return
    if (!Array.isArray(this.members)) return

    await this.createNewMember()

    if (!this._peerController) return

    const offer = await this._peerController.peerConnection.createOffer()
    this._peerController.peerConnection.setLocalDescription(offer)

    this.drawerCreate.show()
  }

  handleAnswer(e: InputEvent) {
    if (!this._peerController) return
    if (!Array.isArray(this.members)) return

    const { value } = e.target as HTMLTextAreaElement
    const answer = decompressSDP(value)

    this._peerController.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    )
  }

  render() {
    const compressedOffer = this._peerController?.peerConnection
      .localDescription
      ? compressSDP(this._peerController.peerConnection.localDescription)
      : ''

    return html`
      <sl-button @click=${this.handleClickCreateOffer}>
        Create offer
      </sl-button>
      <sl-drawer id="drawer-create" label="Create offer">
        <sl-textarea
          label="Offer"
          size="small"
          value=${compressedOffer}
          readonly
          help-text="Copy this invitation and send it to your contact"
        ></sl-textarea>

        <sl-textarea
          label="Answer"
          size="small"
          help-text="Paste here the answer you received from your contact"
          @sl-input=${this.handleAnswer}
        ></sl-textarea>

        <sl-button slot="footer" variant="primary">Close</sl-button>
      </sl-drawer>
    `
  }
}
