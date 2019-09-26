import { Profile, Plugin } from "@remixproject/engine";
import { NeutronStarPlugin } from "../neutron-star-plugin";
import { StarProfile } from "../type";

export class ViewHostPlugin extends NeutronStarPlugin {

  private container: Element;
  private views: Record<string, HTMLIFrameElement>;

  constructor(profile: StarProfile, selector: string) {
    super(profile);
    this.container = document.querySelector(selector)!;
    this.views = {};
  }
  
  addView(profile: Profile<any>, view: HTMLIFrameElement): void {
    this.container.appendChild(view);
    this.views[profile.name] = view;

    // TODO emit an event ?
  }

  private assertPluginExist(name: string) {
    if (!this.views[name]) throw new Error(`${this.currentRequest.from} doesn't exist in ${this.profile.name}`);
  }

  setStyle(style: string) {
    this.assertPluginExist(this.currentRequest.from);

    const view = this.views[this.currentRequest.from];
    view.setAttribute('style', style);
  }
}