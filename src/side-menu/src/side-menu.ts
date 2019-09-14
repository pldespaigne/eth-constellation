
import {
  LitElement,
  html,
  customElement
} from 'lit-element'

import { PluginClient, connectIframe } from '@remixproject/plugin';

@customElement('side-menu')
export class SideMenu extends LitElement {

  plugin: PluginClient;

  constructor() {
    super();
    this.plugin = new PluginClient();
    this.plugin.onload(() => {
      this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 60px;');
    });
    connectIframe(this.plugin);
  }

  public render() {
    return html`
      <div
        style="
          height: 100%;
          width: 100%;
          background-color: #708090;
        "
      >
        Hello World
      </div>
    `;
  }
}