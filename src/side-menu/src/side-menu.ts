
import {
  LitElement,
  html,
  customElement,
  property
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

  constructor() {
    super();
    this.buttons = [];
    this.plugin = new PluginClient();
    this.plugin.onload(() => {
      this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 60px;');
    });
    connectIframe(this.plugin);
  }

  handleClick(name: string) {
    console.log(`You have clicked on ${name}`);
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
        <div>
          <button @click="${() => {this.buttons.push({icon: 'stars', name: 'plugin'+this.buttons.length}); this.requestUpdate();}}">+</button>
          <button @click="${() => {this.buttons.pop(); this.requestUpdate();}}">-</button>
        </div>
        ${this.buttons.map(button => 
          html`<menu-button
            @click="${() => {this.handleClick(button.name)}}"
            icon="${button.icon}"
          ></menu-button>`)
        }
      </div>
    `;
  }
}