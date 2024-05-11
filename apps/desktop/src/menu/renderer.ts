import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

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
  protected render() {
    return html`
      <bell-menu-button @click=${() => window.electronAPI.openPicture()}>
        <sl-icon
          library="lucide"
          name="antenna"
          style="font-size: 20px;"
        ></sl-icon>
        Manual call
      </bell-menu-button>

      <hr />

      <bell-menu-button> Settings </bell-menu-button>

      <bell-menu-button> About </bell-menu-button>

      <hr />

      <bell-menu-button> Quit </bell-menu-button>
    `
  }

  static styles = css`
    :host {
      display: block;
      padding: 4px;
      background: #ffffff;
    }

    hr {
      height: 1px;
      background: #eeeeee;
      border: unset;
      margin: 2px 0;
    }
  `
}
