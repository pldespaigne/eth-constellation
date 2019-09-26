
import {
  LitElement,
  html,
  customElement
} from 'lit-element'

import { PluginClient, connectIframe, Profile, IframeProfile, Message } from '@remixproject/plugin';

// TODO find a way to share the interface
interface StarRequirement {
  name: string;
  methods: string[];
}
interface StarProfile extends IframeProfile {
  requirements: StarRequirement[]
}

// TODO REMOVE THAT : this is a test of loading an external star plugin
const debug: StarProfile = {
  name: 'debug',
  methods: [],
  url: 'https://remix-debug-a.surge.sh:',
  location: 'sidePanel',
  requirements: [
    { name: 'sidePanel', methods: ['addView'] }
  ]
}
// this.registerIframe(debug);
// this.activatePlugins(debug.name);

@customElement('side-panel')
export class SidePanel extends LitElement {

  plugin: PluginClient;
  profiles: StarProfile[];


  constructor() {
    super();

    this.profiles = [];

    this.plugin = new PluginClient();
    this.plugin.methods = ['openPanel', 'closePanel', 'addView'];

    (this.plugin as any).openPanel = () => {this.openPanel()};
    (this.plugin as any).closePanel = () => {this.closePanel()};
    (this.plugin as any).addView = (profile: StarProfile) => {this.addView(profile)};

    this.plugin.onload(async () => {
      console.log('sidePanel ready');
      this.openPanel();

      await this.plugin.call('system' as any, 'registerIframe', debug);
      this.plugin.call('system' as any, 'activatePlugins', debug.name);
    });
    connectIframe(this.plugin);

    window.addEventListener('message', (msg) => { 
      if (msg.origin !== window.origin && !!msg.data) {
        const message = msg.data as Message;
        console.log('@@@', msg.origin, message);
      }
    });
  }

  public openPanel() {
    this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 300px;');
  }
  public closePanel() {
    this.plugin.call('app' as any, 'setStyle', 'height: 100%; width: 300px; display: none');
  }
  public addView(profile: StarProfile) { //, view: HTMLIFrameElement): void {
    this.profiles.push(profile);
    this.requestUpdate();
  }
  // removeView() {}
  // focusView() {}

  private requestHandshake(name: string) {
    this.plugin.call('system' as any, 'performHandshake', name);
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
        ${this.profiles.map((profile, i) => 
          html`<iframe
            sandbox="allow-popups allow-scripts allow-same-origin allow-forms allow-top-navigation"
            seamless="true"
            src="${profile.url}"
            @load="${() => this.requestHandshake(profile.name)}"
          ></iframe>`
        )}
      </div>
    `;
  }
}