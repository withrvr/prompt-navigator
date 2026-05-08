// DeepSeek adapter (chat.deepseek.com).
//
// DeepSeek uses generated/hashed class names. We lead with the most stable
// structural/attribute selectors and fall back broadly.
//
// Selector chain:
//   1. div[class*="_user_"]              — BEM-ish hashed prefix (common)
//   2. div._user_message                — alternate hashed prefix
//   3. [class*="human-turn"]            — human turn pattern
//   4. div[class*="user-message"]       — generic kebab-case
//   5. div[data-message-role="user"]    — semantic attribute
//   6. div[role="user"]                 — ARIA fallback
//   7. div[data-role="user"]            — data attribute fallback
//   8. div[class*="Human"]              — capitalized variant
//   9. div[class*="UserMessage"]        — camel-case variant

import { makeAdapter } from './common';

export const DeepSeekAdapter = makeAdapter({
  id: 'deepseek',
  hosts: ['chat.deepseek.com', 'www.deepseek.com', 'deepseek.com'],
  // Match any path except the sign-up page and the bare root (no conversation loaded)
  pathMatches: (url) =>
    url.pathname !== '/sign_up' && url.pathname !== '/sign_in',
  selectors: [
    'div[class*="_user_"]',
    'div._user_message',
    '[class*="human-turn"]',
    'div[class*="user-message"]',
    'div[data-message-role="user"]',
    'div[role="user"]',
    'div[data-role="user"]',
    'div[class*="Human"]',
    'div[class*="UserMessage"]',
  ],
});
