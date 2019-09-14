import { HostPlugin, HostProfile, Profile, Plugin } from "@remixproject/engine";

export class ViewHostPlugin extends Plugin {

  private container: Element;
  private views: Record<string, HTMLIFrameElement>;

  constructor(profile: Profile, selector: string) {
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