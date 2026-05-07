// DeepSeek adapter (chat.deepseek.com).
//
// DeepSeek's web UI uses generated/hashed class names that change between
// deploys, so we lead with attribute and role-based selectors and only fall
// back to structural patterns. The user turn is a right-aligned message
// container; assistant turns are full-width.
//
// Selector chain:
//   1. div[class*="_user_"]              — common BEM-ish pattern
//   2. div._user_message                  — alternate hashed prefix
//   3. div[class*="user-message"]        — generic kebab-case fallback
//   4. div[role="user"]                  — semantic fallback
//   5. div[data-role="user"]             — semantic fallback

import { makeAdapter } from './common';

export const DeepSeekAdapter = makeAdapter({
  id: 'deepseek',
  hosts: ['chat.deepseek.com', 'www.deepseek.com', 'deepseek.com'],
  pathMatches: (url) => url.pathname.startsWith('/') && url.pathname !== '/sign_up',
  selectors: [
    'div[class*="_user_"]',
    'div._user_message',
    'div[class*="user-message"]',
    'div[role="user"]',
    'div[data-role="user"]',
  ],
});
