import { IframeProfile } from "@remixproject/engine";

export interface StarRequirement {
  name: string;
  methods: string[];
}

export interface StarProfile extends IframeProfile {
  requirements: StarRequirement[]
}