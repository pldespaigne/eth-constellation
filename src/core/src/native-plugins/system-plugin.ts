import { Plugin, Profile, HostProfile, IframePlugin } from "@remixproject/engine";
import { ViewHostPlugin } from "./view-host-plugin";
import { StarProfile, StarRequirement } from "../type";
import { CoreEngine } from "../core-engine";

export class SystemPlugin extends Plugin {

  public engine: CoreEngine;

  constructor(profile: Profile, engine: CoreEngine) {
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
    const plugin = new IframePlugin(profile);
    this.engine.register(plugin);
  }

  public activatePlugins(names: string[] | string) {
    this.engine.activate(names);
  }

  // load natives plugins
  async onActivation() {

    const appProfile: Profile = {
      methods: ['addView', 'setStyle'],
      name: 'app',
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
      methods: [],
      url: 'http://localhost:8081',
      location: 'app',
      requirements: [
        { name: 'app', methods: ['addView', 'setStyle'] }
      ]
    }
    this.registerIframe(sideMenu);
    this.activatePlugins(sideMenu.name);
  }
}