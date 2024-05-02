import { LitElement, html, nothing } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { IMember } from '../../types'
import { compressSDP, decompressSDP } from '../../shared/lib/crypto'
import SlDrawer from '@shoelace-style/shoelace/dist/components/drawer/drawer.js'
import { PeerController } from './peer.controller'

@customElement('bell-create-offer')
export class CreateOffer extends LitElement {
  @property({ type: Object })
  readonly viewer?: IMember

  @property({ type: Array })
  readonly members?: IMember[]

  @state()
  peerController?: PeerController

  @query('#drawer-generate')
  drawerGenerate?: SlDrawer

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

  async handleClickGenerateOffer() {
    if (!this.drawerGenerate) return
    if (!Array.isArray(this.members)) return

    await this.createNewMember()

    if (!this.peerController) return

    if (this.viewer?.stream) {
      await this.peerController.addTrackToPeerConnection(this.viewer?.stream)
    }

    const offer = await this.peerController.peerConnection.createOffer()
    this.peerController.peerConnection.setLocalDescription(offer)

    this.drawerGenerate.show()
  }

  handleAnswer(e: InputEvent) {
    if (!Array.isArray(this.members)) return

    const { value } = e.target as HTMLTextAreaElement
    const answer = decompressSDP(value)

    this.peerController?.peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    )

    // console.log(this.members)
  }

  render() {
    // TODO: [0] fix it
    const textareaOffer = this.members?.length
      ? html`<sl-textarea
          label="Offer"
          size="small"
          value=${this.peerController?.peerConnection.localDescription
            ? compressSDP(this.peerController.peerConnection.localDescription)
            : ''}
          readonly
          help-text="Copy this invitation and send it to your contact"
        ></sl-textarea>`
      : nothing

    return html`
      <sl-button @click=${this.handleClickGenerateOffer}>
        Generate offer
      </sl-button>
      <sl-drawer id="drawer-generate" label="Generate offer">
        ${textareaOffer}

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
