import { Plugin } from "@remixproject/engine";
import { StarProfile } from "./type";

/** Plugin that live in window */
export class NeutronStarPlugin extends Plugin {

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