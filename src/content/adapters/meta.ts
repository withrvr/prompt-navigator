// Meta AI adapter (meta.ai).
//
// Meta AI runs on a React stack with hashed Tailwind class names. We lead
// with attribute-based selectors (Meta uses data-testid heavily across its
// products) and fall back to structural / kebab-case patterns.
//
// Selector chain:
//   1. div[data-testid="user-message"]   — most likely (Meta's standard)
//   2. div[data-message-author="user"]
//   3. div[data-author="user"]
//   4. div.user-message
//   5. div.x1n2onr6.x1ja2u2z              — Meta's typical hashed bubble class

import { makeAdapter } from './common';

export const MetaAdapter = makeAdapter({
  id: 'meta',
  hosts: ['meta.ai', 'www.meta.ai'],
  selectors: [
    'div[data-testid="user-message"]',
    'div[data-message-author="user"]',
    'div[data-author="user"]',
    'div.user-message',
    'div[class*="user_message"]',
  ],
});
