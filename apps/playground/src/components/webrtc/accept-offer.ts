import { LitElement, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { IMember } from '../../types'
import { compressSDP, decompressSDP } from '../../shared/lib/crypto'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { PeerController } from './peer.controller'

@customElement('bell-accept-offer')
export class AcceptOffer extends LitElement {
  @property({ type: Array })
  readonly members?: IMember[]

  @query('#drawer-accept')
  drawerAccept?: SlDrawer

  @state()
  peerController?: PeerController

  async createNewMember() {
    if (!Array.isArray(this.members)) return

    this.peerController = new PeerController(this)

    const member: IMember = {
      id: crypto.randomUUID(),
      name: `Someone else #${this.members.length + 1}`,
      peerController: this.peerController,
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
    if (!Array.isArray(this.members)) return

    const { value } = e.target as HTMLTextAreaElement
    const offer = decompressSDP(value)

    this.peerController?.peerConnection.setRemoteDescription(
      new RTCSessionDescription(offer)
    )

    const answer = await this.peerController?.peerConnection.createAnswer()
    this.peerController?.peerConnection.setLocalDescription(answer)
  }

  render() {
    // TODO: [0] fix it
    const textareaOffer = this.members?.length
      ? html`<sl-textarea
          label="Answer"
          size="small"
          value=${this.peerController?.peerConnection.localDescription
            ? compressSDP(this.peerController.peerConnection.localDescription)
            : ''}
          readonly
          help-text="Copy this invitation and send it to your contact"
        ></sl-textarea>`
      : nothing

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

        ${textareaOffer}

        <sl-button slot="footer" variant="primary">Close</sl-button>
      </sl-drawer>
    `
  }
}
