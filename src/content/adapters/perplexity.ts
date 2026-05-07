// Perplexity adapter (perplexity.ai, www.perplexity.ai).
//
// Perplexity threads render the user query as a heading at the top of each
// answer block. Selectors here are a fallback chain — Perplexity uses
// Tailwind so class names are stable but generic, and the team occasionally
// re-tags blocks.
//
// Try, in order:
//   1. h1.group\/query-h1                — current (late-2025) marker
//   2. div[data-testid="thread-query"]   — semi-stable test attribute
//   3. div.query-text                    — older variant still seen on /search
//   4. div[class*="QueryPair"] h1        — generic React-component fallback

import { makeAdapter } from './common';

export const PerplexityAdapter = makeAdapter({
  id: 'perplexity',
  hosts: ['perplexity.ai', 'www.perplexity.ai'],
  selectors: [
    'h1.group\\/query-h1',
    'div[data-testid="thread-query"]',
    'div.query-text',
    'div[class*="QueryPair"] h1',
  ],
});
