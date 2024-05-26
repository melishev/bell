import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

import '../components/menuButton'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { registerIconLibrary } from '@shoelace-style/shoelace/dist/utilities/icon-library.js'
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/')

registerIconLibrary('lucide', {
  resolver: (name) =>
    `https://cdn.jsdelivr.net/npm/lucide-static@0/icons/${name}.svg`,
})

@customElement('bell-tray-menu')
export class TrayMenu extends LitElement {
  @state()
  myID?: string

  @state()
  contacts?: any[]

  connectedCallback(): void {
    super.connectedCallback()

    window.electron.onLocalData((value) => {
      this.myID = value.id
      this.contacts = value.contacts.entries().reduce((acc, [id, value]) => {
        acc.push({ id, ...value })

        return acc
      }, [])
    })
  }

  private _callToContact(id: string): void {
    window.electron.openIntercom(id)
  }

  private _quit() {
    window.electron.quit()
  }

  protected render() {
    return html`
      <bell-menu-button class="bio">
        <p>ID</p>
        <span>${this.myID}</span>
      </bell-menu-button>

      <hr />

      <bell-menu-button @click=${() => this._callToContact(this.myID)}>
        <sl-icon
          library="lucide"
          name="antenna"
          style="font-size: 20px;"
        ></sl-icon>
        Manual call
      </bell-menu-button>

      <hr />

      ${repeat(
        this.contacts,
        (contact) => contact.id,
        (contact) => html`
          <bell-menu-button @click=${() => this._callToContact(contact.id)}
            >${contact.name}</bell-menu-button
          >
        `
      )}

      <hr />

      <bell-menu-button> Settings </bell-menu-button>

      <bell-menu-button> About </bell-menu-button>

      <hr />

      <bell-menu-button @click=${this._quit}> Quit </bell-menu-button>
    `
  }

  static styles = css`
    :host {
      display: block;
      padding: 4px;
      background: #ffffff;
    }

    .bio {
      &::part(base) {
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        gap: 0;
      }

      p {
        width: 100%;
        text-align: left;
        font-size: 11px;
        font-weight: 500;
        color: #9d9d9d;
        margin: 0;
      }

      span {
        font-size: 13px;
        font-weight: 500;
      }
    }

    hr {
      height: 1px;
      background: #eeeeee;
      border: unset;
      margin: 2px 0;
    }
  `
}
