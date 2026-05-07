// Single source of truth for the browser-extension manifest.
// Authored as TypeScript so we can build per-target variants (Chrome,
// Firefox, etc.) without duplicating JSON.

import { defineManifest } from '@crxjs/vite-plugin';
import pkg from '../package.json' with { type: 'json' };

/**
 * Hosts the extension is allowed to inject content scripts into.
 * Kept narrow — we never request `<all_urls>` to keep the permissions
 * footprint store-friendly. Add a host here when you add an adapter.
 */
const SUPPORTED_HOSTS = [
  'https://chatgpt.com/*',
  'https://chat.openai.com/*',
  'https://claude.ai/*',
  'https://gemini.google.com/*',
  'https://www.perplexity.ai/*',
  'https://perplexity.ai/*',
  'https://grok.com/*',
  'https://www.grok.com/*',
  'https://x.com/i/grok*',
  'https://chat.deepseek.com/*',
  'https://chat.mistral.ai/*',
  'https://kimi.com/*',
  'https://www.kimi.com/*',
  'https://kimi.moonshot.cn/*',
];

export default defineManifest({
  manifest_version: 3,
  name: 'Prompt Navigator',
  version: pkg.version,
  description:
    'Jump to any prompt in your AI chat. Lists, searches, favorites, and exports your messages on ChatGPT, Claude, and Gemini.',
  icons: {
    16: 'public/icons/icon-16.png',
    32: 'public/icons/icon-32.png',
    48: 'public/icons/icon-48.png',
    128: 'public/icons/icon-128.png',
  },
  action: {
    default_title: 'Prompt Navigator',
    default_popup: 'src/popup/index.html',
    default_icon: {
      16: 'public/icons/icon-16.png',
      32: 'public/icons/icon-32.png',
    },
  },
  background: {
    service_worker: 'src/background/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: SUPPORTED_HOSTS,
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
      all_frames: false,
    },
  ],
  permissions: ['activeTab', 'storage', 'scripting'],
  host_permissions: SUPPORTED_HOSTS,
});
