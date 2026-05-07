// Adapter registry. Maps the current page URL to the right platform adapter.
//
// Adapters are tried in order; the first whose `matches()` returns true wins.
// New adapters are registered here — no other file needs to change for routing.

import type { PromptAdapter } from './base';
import { ChatGptAdapter } from './chatgpt';
import { ClaudeAdapter } from './claude';
import { GeminiAdapter } from './gemini';
import { PerplexityAdapter } from './perplexity';

const ADAPTERS: PromptAdapter[] = [
  new ChatGptAdapter(),
  new ClaudeAdapter(),
  new GeminiAdapter(),
  PerplexityAdapter,
];

/**
 * Return the adapter for the given URL, or `null` if no adapter recognizes
 * the host (triggers the "unsupported site" empty state in the popup).
 */
export function findAdapter(url: URL): PromptAdapter | null {
  return ADAPTERS.find((a) => a.matches(url)) ?? null;
}
