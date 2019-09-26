
import { Profile } from '@remixproject/engine';
import { SystemPlugin } from './native-plugins/system-plugin';
import { NebulaEngine } from './nebula-engine';
import { StarProfile } from './type';

// Bootstrap Constellation
const engine = new NebulaEngine();
const systemProfile: StarProfile = {
  name: 'system',
  methods: ['registerIframe', 'activatePlugins', 'performHandshake'],
  url: '',
  location: '',
  requirements: []
}
new SystemPlugin(systemProfile, engine);

(window as any).engine = engine;