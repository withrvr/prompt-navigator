// Mistral / Le Chat adapter (chat.mistral.ai).
//
// Le Chat uses a fairly conventional React layout. User turns are
// right-aligned bubble containers that carry a role-derived data attribute
// or a Tailwind alignment class.
//
// Selector chain:
//   1. div[data-message-role="user"]   — semantic, most preferred
//   2. div[data-role="user"]
//   3. div.user-message                — generic kebab-case
//   4. div[class*="user_message"]      — BEM-ish hashed
//   5. div.justify-end div.message     — alignment-based fallback

import { makeAdapter } from './common';

export const MistralAdapter = makeAdapter({
  id: 'mistral',
  hosts: ['chat.mistral.ai', 'mistral.ai', 'www.mistral.ai'],
  selectors: [
    'div[data-message-role="user"]',
    'div[data-role="user"]',
    'div.user-message',
    'div[class*="user_message"]',
    'div.justify-end div.message',
  ],
});
