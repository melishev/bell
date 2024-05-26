import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('bell-menu-button')
export class MenuButton extends LitElement {
  protected render() {
    return html`
      <button part="base">
        <slot></slot>
      </button>
    `
  }

  static styles = css`
    button {
      width: 100%;
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
      color: #3c3c3c;
      border: unset;
      padding: 10px 14px;
      border-radius: 6px;

      background: unset;

      &:hover {
        background: #f2f1f1;
      }
    }
  `
}
