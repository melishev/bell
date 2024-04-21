import { LitElement, PropertyValueMap, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

@customElement('bell-chat')
export class Chat extends LitElement {
  @property({ type: Object })
  readonly peerConnection?: RTCPeerConnection

  @property({ type: Object })
  readonly channel?: RTCDataChannel

  @state()
  private _messages: string[] = []

  @query('#bell-input')
  inputRef?: HTMLInputElement

  _sendMessage() {
    if (!this.inputRef) return
    if (!this.peerConnection) return
    if (this.peerConnection.connectionState !== 'connected') return

    const message = this.inputRef.value
    this.inputRef.value = ''

    this._messages.push(message) // TODO: remove

    this.channel?.send(message)
    this.requestUpdate()
  }

  protected update(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has('channel') && this.channel) {
      this.channel.onopen = () => {
        console.log('channel open')
      }

      this.channel.onmessage = (e) => {
        console.log('message:', e.data)
      }
    }

    super.update(changedProperties)
  }

  connectedCallback() {
    super.connectedCallback()

    console.log(this.channel)
    if (!this.peerConnection) return

    this.peerConnection.ondatachannel = (e) => {
      const typeToken = this.shadowRoot?.querySelector(
        'input[name="way"]:checked'
      )?.value

      if (typeToken === 'answer') {
        this.dispatchEvent(
          new CustomEvent('update:channel', {
            detail: e.channel,
            bubbles: true,
            composed: true,
          })
        )
      }
    }
  }

  render() {
    return html`
      <div>
        <label>
          <input type="radio" name="way" value="call" checked />
          call
        </label>
        <label>
          <input type="radio" name="way" value="answer" />
          answer
        </label>
      </div>

      <div id="chatWrapper">
        <div id="chat">
          ${repeat(
            this._messages,
            (message) => message,
            (message) => html` <div>${message}</div> `
          )}
        </div>
        <input id="bell-input" type="text" />
        <button @click=${this._sendMessage}>send</button>
      </div>
    `
  }
}
