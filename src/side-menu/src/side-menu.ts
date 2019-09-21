
import {
  LitElement,
  html,
  customElement
} from 'lit-element'

import { PluginClient, connectIframe } from '@remixproject/plugin';

import './menu-button';

interface ButtonData {
  icon: string,
  name: string,
}

@customElement('side-menu')
export class SideMenu extends LitElement {

  plugin: PluginClient;
  buttons: ButtonData[];
  selected: number;

  constructor() {
    super();

    this.buttons = [];
    this.selected = -1;

    this.plugin = new PluginClient();
    this.plugin.methods = ['addIcon', 'removeIcon', 'focusIcon'];

    // binding methods
    (this.plugin as any).addIcon = (name: string, icon: string) => {this.addIcon(name, icon)};
    (this.plugin as any).removeIcon = (name: string) => {this.removeIcon(name)};
    (this.plugin as any).focusIcon = (name: string) => {this.focusIcon(name)};

    this.plugin.onload(() => {
      console.log('sideMenu ready');
      this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 60px;');
    });
    connectIframe(this.plugin);
  }

  public addIcon(name: string, icon: string) {
    this.buttons.push({name, icon});
    this.requestUpdate();
  }
  public removeIcon(name: string) {
    this.buttons = this.buttons.filter(button => button.name !== name);
    this.requestUpdate();
  }
  public focusIcon(name: string) {
    const index = this.buttons.findIndex(button => button.name === name);
    this.handleClick(name, index);
  }

  private handleClick(name: string, index: number) {
    this.selected = index;
    this.plugin.emit('focus', name);
    this.requestUpdate();
  }

  public render() {
    return html`
      <div
        style="
          min-height: 100%;
          width: 100%;
          background-color: #546e7a;
          overflow-x: hidden;
        "
      >
        ${this.buttons.map((button, i) => 
          html`<menu-button
            @click="${() => {this.handleClick(button.name, i)}}"
            icon="${button.icon}"
            ?selected="${i === this.selected}"
          ></menu-button>`)
        }
      </div>
    `;
  }
}