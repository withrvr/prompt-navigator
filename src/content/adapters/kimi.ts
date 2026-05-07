// Kimi adapter (kimi.com — Moonshot AI's chat product).
//
// Kimi's web UI follows a chat layout where each user turn is a
// right-aligned bubble. The team uses both English and Chinese class
// hints in different builds, so we lead with attribute-based selectors
// and fall back to common class patterns.
//
// Selector chain:
//   1. div[data-role="user"]            — semantic
//   2. div[data-message-role="user"]    — alternate semantic
//   3. div.user-content                 — current Kimi marker
//   4. div.user-question                — alternate marker
//   5. div[class*="user_"]              — generic BEM-ish

import { makeAdapter } from './common';

export const KimiAdapter = makeAdapter({
  id: 'kimi',
  hosts: ['kimi.com', 'www.kimi.com', 'kimi.moonshot.cn'],
  selectors: [
    'div[data-role="user"]',
    'div[data-message-role="user"]',
    'div.user-content',
    'div.user-question',
    'div[class*="user_"]',
  ],
});
