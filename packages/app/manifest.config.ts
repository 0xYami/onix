import { defineManifest } from '@crxjs/vite-plugin';
import { version } from './package.json';

const [major, minor, patch, label = '0'] = version.replace(/[^\d.-]+/g, '').split(/[.-]/);

export default defineManifest({
  manifest_version: 3,
  name: 'Onix Wallet',
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  description: 'Modern Web3 wallet',
  action: {
    default_title: 'Onix Wallet',
    default_popup: 'index.html',
  },
  host_permissions: ['<all_urls>'],
  permissions: ['alarms', 'tabs', 'clipboardWrite', 'scripting'],
});
