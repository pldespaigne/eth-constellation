
import { Profile } from '@remixproject/engine';
import { SystemPlugin } from './native-plugins/system-plugin';
import { CoreEngine } from './core-engine';

// Bootstrap Constellation
const engine = new CoreEngine();
const systemProfile: Profile = {
  name: 'system',
  methods: ['registerIframe', 'activatePlugins'],
}
new SystemPlugin(systemProfile, engine);

(window as any).engine = engine;