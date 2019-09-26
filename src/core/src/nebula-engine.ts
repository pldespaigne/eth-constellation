import { PluginEngine, ApiMap, Plugin, IframeProfile, Message } from "@remixproject/engine";
import { StarRequirement, StarProfile } from "./type";
import { StarPlugin } from "./star-plugin";
import { NeutronStarPlugin } from "./neutron-star-plugin";

type StarOrNeutronStarPlugin = StarPlugin | NeutronStarPlugin;
type StarOrNeutronStarPluginMap = { [name: string]: StarOrNeutronStarPlugin }

export class NebulaEngine extends PluginEngine<ApiMap> {

  plugins: StarOrNeutronStarPluginMap;

  constructor() {
    super({});
    this.plugins = {};

    window.addEventListener('message', (msg) => { 
      if (msg.origin !== window.origin && !!msg.data) {
        const message = msg.data as Message;
        console.log(msg.origin, message);
        if (message.action === 'response' && message.key === 'handshake') {
          const plugin = this.getPlugin(message.name);
          if (!!message.payload) plugin.profile.methods = [...message.payload];
        }
      }
    });
  }

  register(plugins: StarOrNeutronStarPlugin | StarOrNeutronStarPlugin[]) {
    super.register(plugins);
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => this.initPath(plugin));
    } else {
      this.initPath(plugins);
    }
  }

  initPath(plugin: StarOrNeutronStarPlugin) {
    plugin.parent = plugin.profile.location;
    const parent = this.getPlugin(plugin.parent);
    if (!!parent) {
      parent.children.push(plugin.name);
    }
  }

  getWindow(name: string) {
    const path: number[] = [];
    let currentName = name;

    // loop until we reach the root,
    // we use plugins.length as max loop because it's the worse case
    // (i.e. every plugin has only one child, the tree is linear)
    for (let i = 0 ; i < Object.keys(this.plugins).length ; i++) {
      const currentPlugin = this.getPlugin(currentName);
      if (!currentPlugin) throw new Error(`It seems that ${currentName} is not registered`);

      const parentPlugin = this.getPlugin(currentPlugin.parent);
      if (!parentPlugin) break; // if current plugin has no parent, it's the root
      
      const currentIndex = parentPlugin.children.findIndex(child => child === currentName);
      if (currentIndex === -1) throw new Error(`Parent plugin ${parentPlugin.name} doesn't recognize his child ${currentName}`);

      if (this.isStarPlugin(currentPlugin)) path.unshift(currentIndex);
      currentName = parentPlugin.name;
    }
    let result = window as Window;
    path.forEach(i => result = result.frames[i]);
    return result;
  }

  isStarPlugin(plugin: StarOrNeutronStarPlugin) {
    return plugin instanceof StarPlugin;
  }

  getPlugin(name: string) {
    return this.plugins[name];
  }

  meetRequirement(requirement: StarRequirement) {
    const plugin = this.getPlugin(requirement.name);

    if (!plugin) return false; // required plugin is not registered
    if (!this.actives.some(active => active === requirement.name)) return false; // required plugin exist but is not active

    // check if all required methods exists in the required plugin
    return !requirement.methods.some(requirementMethod =>
      !plugin.profile.methods.some(pluginMethod => pluginMethod === requirementMethod));
  }
}