import './index.css'

import { LitElement, html, css } from 'lit' // TODO: добавить LIT в зависимости проекта
import { customElement, state } from 'lit/decorators.js'

// Shoelace
import '@shoelace-style/shoelace/dist/themes/light.css'
import '@shoelace-style/shoelace/dist/themes/dark.css'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
// TODO: temporary solution, as I don't want to drag all existing svg into the build
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.0/cdn/') ;

@customElement('bell-main')
export class Main extends LitElement {
  @state()
  viewer: any

  render() {
    return html`
      <video></video>
    `
  }

  static styles = css`
    video {
      border: 1px solid red;
    }
  ` 
}
