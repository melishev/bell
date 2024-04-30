import { LitElement, html, nothing } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
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

  @query('#drawer-generate')
  drawerGenerate?: SlDrawer

  async createNewMember() {
    if (!Array.isArray(this.members)) return

    const peer = new PeerController(this)
    peer.autoUpgradePeerConnection()

    const member: IMember = {
      id: crypto.randomUUID(),
      name: `Someone else #${this.members.length + 1}`,
      peerConnection: peer.peerConnection!,
    }

    const updatedMembers = [...this.members]
    updatedMembers.push(member)

    this.dispatchEvent(
      new CustomEvent('update:members', {
        composed: true,
        detail: updatedMembers,
      })
    )

    return member
  }

  async handleClickGenerateOffer() {
    if (!this.drawerGenerate) return
    if (!Array.isArray(this.members)) return

    const member = await this.createNewMember()

    if (!member) return

    // TODO: если viewer имеет стрим, подождать пока в peer не будут добавлены треки
    // или можно не подвязывать на это, а просто реализовать механизм апгрейда коннекта
    if (this.viewer?.stream) {
      const tracks = this.viewer.stream.getTracks()
      for await (let track of tracks) {
        member.peerConnection.addTrack(track, this.viewer.stream)
      }
    }

    const offer = await member.peerConnection.createOffer()
    member.peerConnection.setLocalDescription(offer)

    this.drawerGenerate.show()
  }

  handleAnswer(e: InputEvent) {
    if (!Array.isArray(this.members)) return

    const { value } = e.target as HTMLTextAreaElement
    const answer = decompressSDP(value)

    this.members[0].peerConnection.setRemoteDescription(
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
          value=${this.members[0].peerConnection?.localDescription
            ? compressSDP(this.members[0].peerConnection.localDescription)
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
