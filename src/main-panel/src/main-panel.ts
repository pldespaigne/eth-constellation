
import {
  LitElement,
  html,
  customElement
} from 'lit-element'

import { PluginClient, connectIframe } from '@remixproject/plugin';

@customElement('main-panel')
export class MainPanel extends LitElement {

  plugin: PluginClient;

  constructor() {
    super();

    this.plugin = new PluginClient();

    this.plugin.onload(() => {
      console.log('mainPanel ready');
      this.plugin.call('app' as any, 'setStyle', 'height: 100%; flex-grow: 1;');
    });
    connectIframe(this.plugin);
  }

  public render() {
    return html`
      <div
        style="
          min-height: 100%;
          background-color: green;
        "
      >
        <h1 style="margin: 0;">Main Panel</h1>
      </div>
    `;
  }
}