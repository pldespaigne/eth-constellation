import { IframePlugin } from "@remixproject/engine";
import { StarProfile } from "./type";

/** Plugin that live in an Iframe */
export class StarPlugin extends IframePlugin {

  public profile: StarProfile;
  public parent: string;
  public children: string[];

  constructor(profile: StarProfile) {
    super(profile);
    this.profile = profile;
    this.parent = profile.location;
    this.children = [];
  }
}