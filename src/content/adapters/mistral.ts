// Mistral / Le Chat adapter (chat.mistral.ai).
//
// Le Chat uses a React stack; user turns live in right-aligned bubble
// containers. The UI has changed post-2025; we extend the selector chain.
//
// Selector chain:
//   1. div[data-message-role="user"]    — semantic attribute (preferred)
//   2. div[data-role="user"]            — alternate data attribute
//   3. div[data-testid="user-message"]  — test ID
//   4. div.user-message                 — kebab-case class
//   5. div[class*="user_message"]       — BEM-ish hashed
//   6. div[class*="UserMessage"]        — camel-case variant
//   7. div[class*="human"]              — human-turn fallback
//   8. div.justify-end div.message      — Tailwind alignment fallback

import { makeAdapter } from './common';

export const MistralAdapter = makeAdapter({
  id: 'mistral',
  hosts: ['chat.mistral.ai', 'mistral.ai', 'www.mistral.ai'],
  selectors: [
    'div[data-message-role="user"]',
    'div[data-role="user"]',
    'div[data-testid="user-message"]',
    'div.user-message',
    'div[class*="user_message"]',
    'div[class*="UserMessage"]',
    'div[class*="human"]',
    'div.justify-end div.message',
  ],
});
