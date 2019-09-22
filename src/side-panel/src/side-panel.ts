
import {
  LitElement,
  html,
  customElement
} from 'lit-element'

import { PluginClient, connectIframe } from '@remixproject/plugin';

@customElement('side-panel')
export class SidePanel extends LitElement {

  plugin: PluginClient;

  constructor() {
    super();

    this.plugin = new PluginClient();
    this.plugin.onload(() => {
      console.log('sidePanel ready');
      this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 300px;');
    });
    connectIframe(this.plugin);
  }

  public render() {
    return html`
      <div
        style="
          min-height: 100%;
          width: 100%;
          background-color: blue;
        "
      >
        <h1 style="margin: 0;">Side Panel</h1>
      </div>
    `;
  }
}