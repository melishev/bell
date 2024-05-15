import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('bell-button')
export class Button extends LitElement {
  @property()
  size: 'small' | 'medium' = 'medium'

  protected render() {
    return html`
      <button class=${this.size}>
        <slot></slot>
      </button>
    `
  }

  static styles = css`
    button {
      border: unset;
      background: unset;
      padding: unset;

      backdrop-filter: blur(26px);
      background-color: #ffffff36;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;

      &.small {
        width: 22px;
        height: 22px;
      }

      &.medium {
        width: 40px;
        height: 40px;
      }

      &:active {
        background-color: #ffffff;
      }
    }
  `
}
