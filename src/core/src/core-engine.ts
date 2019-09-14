import { PluginEngine, ApiMap } from "@remixproject/engine";
import { StarRequirement } from "./type";

export class CoreEngine extends PluginEngine<ApiMap> {
  constructor() {
    super({});
  }

  meetRequirement(requirement: StarRequirement) {
    const plugin = this.plugins[requirement.name];

    if (!plugin) return false; // required plugin is not registered
    if (!this.actives.some(active => active === requirement.name)) return false; // required plugin exist but is not active

    // check if all required methods exists in the required plugin
    return !requirement.methods.some(requirementMethod =>
      !plugin.profile.methods.some(pluginMethod => pluginMethod === requirementMethod));
  }
}