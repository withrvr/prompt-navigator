// Perplexity adapter (perplexity.ai).
//
// Perplexity renders user queries in a prominent heading at the top of each
// answer block. The UI has changed across versions; we try a broad chain.
//
// Selector chain (tried in order, first match wins):
//   1. h1.group\/query-h1               — late-2025 stable marker
//   2. div[data-testid="thread-query"]  — semi-stable test attribute
//   3. div.query-text                   — older /search variant
//   4. div[class*="QueryPair"] h1       — React component name fallback
//   5. [class*="UserQuery"]             — generic user-query class
//   6. [class*="user-query"]            — kebab variant
//   7. div[data-message-role="user"]    — role-based (if added)

import { makeAdapter } from './common';

export const PerplexityAdapter = makeAdapter({
  id: 'perplexity',
  hosts: ['perplexity.ai', 'www.perplexity.ai'],
  selectors: [
    'h1.group\\/query-h1',
    'div[data-testid="thread-query"]',
    'div.query-text',
    'div[class*="QueryPair"] h1',
    '[class*="UserQuery"]',
    '[class*="user-query"]',
    'div[data-message-role="user"]',
  ],
});
