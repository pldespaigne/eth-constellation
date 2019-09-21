import {
  html,
  LitElement,
  customElement,
  property,
} from "lit-element";

const theme = {
  light: '#78909c',
  base: 'none',
  dark: '#37474f'
}

@customElement('menu-button')
export class MenuButton extends LitElement {

  @property( { type : String }  ) icon = 'library_add';
  @property( { type : Boolean }  ) selected = false;

  background: string;
  transform: string;

  constructor() {
    super();
    this.background = theme.base;
    this.transform = 'none';
  }

  mouseOver() {
    this.background = theme.light;
    this.requestUpdate();
  }
  mouseOut() {
    this.background = theme.base;
    this.transform = 'none';
    this.requestUpdate();
  }
  mouseDown() {
    this.background = theme.dark;
    this.transform = 'translateY(3px)';
    this.requestUpdate();
  }
  mouseUp() {
    this.background = theme.light;
    this.transform = 'none';
    this.requestUpdate();
    // const click = new Event('click');
    // this.dispatchEvent(click);
  }

  public render() {
    return html`
      <button
        @mouseover="${this.mouseOver}"
        @mouseout="${this.mouseOut}"
        @mousedown="${this.mouseDown}"
        @mouseup="${this.mouseUp}"
        style="
          width: 40px;
          height: 40px;
          padding: 0;
          border: none;
          margin: 10px;
          border-radius: 5px;
          background: ${this.selected ? theme.light : this.background};
          transform: ${this.transform};
          display: block;
          cursor: pointer;
        "
      >
        <img
          style="width: 40px; height: 40px"
          src="${this.icon}"
        />
      </button>
    `;
  }
}