// Meta AI adapter (meta.ai).
//
// Meta AI is a React/Relay app with heavy test-ID usage. User messages are
// typically right-aligned bubbles. Extended selector chain for resilience.
//
// Selector chain:
//   1. div[data-testid="user-message"]     — Meta's standard test ID
//   2. div[data-testid="message-bubble-user"] — alternate test ID
//   3. div[data-message-author="user"]     — semantic author attribute
//   4. div[data-author="user"]             — alternate author attribute
//   5. div[data-message-role="user"]       — role attribute
//   6. div.user-message                    — generic class
//   7. div[class*="UserMessage"]           — camel-case
//   8. div[class*="user_message"]          — underscored variant
//   9. div[class*="outgoing"]              — direction-based (Meta uses this)

import { makeAdapter } from './common';

export const MetaAdapter = makeAdapter({
  id: 'meta',
  hosts: ['meta.ai', 'www.meta.ai'],
  selectors: [
    'div[data-testid="user-message"]',
    'div[data-testid="message-bubble-user"]',
    'div[data-message-author="user"]',
    'div[data-author="user"]',
    'div[data-message-role="user"]',
    'div.user-message',
    'div[class*="UserMessage"]',
    'div[class*="user_message"]',
    'div[class*="outgoing"]',
  ],
});
