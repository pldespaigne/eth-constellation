import { Plugin, Profile, HostProfile, IframePlugin, IframeProfile, Message } from "@remixproject/engine";
import { ViewHostPlugin } from "./view-host-plugin";
import { StarProfile, StarRequirement } from "../type";
import { NebulaEngine } from "../nebula-engine";
import { StarPlugin } from "../star-plugin";
import { NeutronStarPlugin } from "../neutron-star-plugin";

type MessageListener = ['message', (e: MessageEvent) => void, false];

export class SystemPlugin extends NeutronStarPlugin {

  public engine: NebulaEngine;

  constructor(profile: StarProfile, engine: NebulaEngine) {
    super(profile);
    this.engine = engine;

    // system register & activate itself
    this.engine.register(this);
    this.engine.activate(profile.name);
  }

  public assertRequirements(profile: StarProfile) {
    profile.requirements.forEach(requirement => {
      if (!this.engine.meetRequirement(requirement))
        throw new Error(`RequirementError: ${profile.name} require ${requirement.name} with the following methods : ${requirement.methods.join(', ')}`);
    });
  }

  public registerIframe(profile: StarProfile) {
    this.assertRequirements(profile);
    const plugin = new StarPlugin(profile);

    // if this function has been 'called' (i.e. the plugin is nt instantiated by 'system')
    // then the plugin will be hosted by another iframe plugin,  // TODO warning I'm not sure about that
    // so we need to cripple the render() function to prevent
    // the StructuredClone algorithm to throw trying to pass an HTMLIframeElement trough postMessage
    if (!!this.currentRequest) {
      (plugin as any).render = () => {}; // cripple render
      // (plugin as any).performHandshake = () => { // create a onload callback
      //   console.log('performHandshake', this);
        // (this as any).origin = new URL((this.profile as IframeProfile).url).origin;
        // (this as any).source = this.iframe.contentWindow
        // window.addEventListener(...(this as any).listener as MessageListener);
        // const methods: string[] = await this.callPluginMethod('handshake')
        // if (methods) {
          // this.profile.methods = methods
        // }
        
      // };
      // TODO maybe deactivate() also needs to be crippled
    }

    this.engine.register(plugin);
  }

  public activatePlugins(names: string[] | string) {
    console.log('activate', names);
    this.engine.activate(names);
  }

  public async performHandshake(name: string) {
    const plugin = this.engine.getPlugin(name);
    if (!plugin) throw new Error(`${name} not found for handshake`);
    if (!this.engine.isStarPlugin(plugin)) return;
    
    const origin = new URL((plugin.profile as IframeProfile).url).origin;
    const source = this.engine.getWindow(plugin.name);
    source.postMessage({id: 0, action: 'request', key: 'handshake', name}, origin);
    (plugin as any).source = source;
    (plugin as any).origin = origin;

    console.log('on', plugin);
  }

  // load natives plugins
  async onActivation() {

    const appProfile: StarProfile = {
      methods: ['addView', 'setStyle'],
      name: 'app',
      url: '',
      location: 'system',
      requirements: []
    }
    const app = new ViewHostPlugin(appProfile, '#app');
    this.engine.register(app);
    this.engine.activate(appProfile.name);
    
    // const backgroundProfile: Profile = {
    //   methods: ['addView', 'setStyle'],
    //   name: 'background',
    // }
    // const background = new ViewHostPlugin(backgroundProfile, '#background');
    // this.engine.register(background);
    // this.engine.activate(backgroundProfile.name);

    // TODO REMOVE THAT : this is a test of loading an external star plugin
    const sideMenu: StarProfile = {
      name: 'sideMenu',
      methods: ['addIcon', 'removeIcon', 'focusIcon'],
      url: 'http://localhost:8081',
      location: 'app',
      requirements: [
        { name: 'app', methods: ['addView', 'setStyle'] }
      ]
    }
    this.registerIframe(sideMenu);
    this.activatePlugins(sideMenu.name);

    // TODO REMOVE THAT : this is a test of loading an external star plugin
    const sidePanel: StarProfile = {
      name: 'sidePanel',
      methods: ['openPanel', 'closePanel', 'addView'],
      url: 'http://localhost:8082',
      location: 'app',
      requirements: [
        { name: 'system', methods: ['registerIframe', 'activatePlugins'] },
        { name: 'app', methods: ['addView', 'setStyle'] }
      ]
    }
    this.registerIframe(sidePanel);
    this.activatePlugins(sidePanel.name);

    // TODO REMOVE THAT : this is a test of loading an external star plugin
    const mainPanel: StarProfile = {
      name: 'mainPanel',
      methods: [],
      url: 'http://localhost:8083',
      location: 'app',
      requirements: [
        { name: 'app', methods: ['addView', 'setStyle'] }
      ]
    }
    this.registerIframe(mainPanel);
    this.activatePlugins(mainPanel.name);
  }
}