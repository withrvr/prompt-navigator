// Grok adapter (grok.com, x.com/i/grok).
//
// grok.com: user bubbles are right-aligned via `items-end`/`justify-end`.
// x.com/i/grok: Grok is embedded inside X's SPA; the same message-bubble
// structure is used but the conversation ID appears as a query param
// (?conversation=...) rather than in the path.
//
// Selector chain:
//   1. div.items-end div.message-bubble         — right-aligned wrapper (primary)
//   2. div.justify-end div.message-bubble       — alternate Tailwind layout
//   3. div[data-message-author="user"]          — semantic author attribute
//   4. div[data-testid="user-message"]          — test ID (if Grok adds one)
//   5. [class*="UserMessage"]                   — camel-case React component
//   6. [class*="user-message"]                  — kebab fallback
//   7. div.message-bubble (even-indexed)        — fallback: user = even turns

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { PlatformId } from '@/shared/types';

const PRIMARY_SELECTORS = [
  'div.items-end div.message-bubble',
  'div.justify-end div.message-bubble',
  'div[data-message-author="user"]',
  'div[data-testid="user-message"]',
  '[class*="UserMessage"]',
  '[class*="user-message"]',
];

const FALLBACK_ALL_BUBBLES = 'div.message-bubble';

const GROK_HOSTS = new Set(['grok.com', 'www.grok.com']);

export class GrokAdapter implements PromptAdapter {
  readonly id: PlatformId = 'grok';

  matches(url: URL): boolean {
    if (GROK_HOSTS.has(url.hostname)) return true;
    // Also handle subdomains of grok.com
    if (url.hostname.endsWith('.grok.com')) return true;
    // Grok embedded in x.com and twitter.com at /i/grok
    if (url.hostname === 'x.com' || url.hostname === 'twitter.com') {
      return url.pathname.startsWith('/i/grok');
    }
    return false;
  }

  getPrompts(): DomPrompt[] {
    let nodes = querySelectorFromList(PRIMARY_SELECTORS);

    if (nodes.length === 0) {
      // Fallback: even-indexed message bubbles (user turn first in a conversation).
      const all = Array.from(
        document.querySelectorAll<HTMLElement>(FALLBACK_ALL_BUBBLES),
      );
      nodes = all.filter((_, i) => i % 2 === 0);
    }

    return nodes
      .map((el, index) => {
        const text = extractText(el);
        if (!text) return null;
        return {
          id: `grok-${index}`,
          index,
          text,
          length: text.length,
          element: el,
        } satisfies DomPrompt;
      })
      .filter((p): p is DomPrompt => p !== null);
  }

  scrollTo(prompt: DomPrompt): void {
    safeScrollTo(prompt.element);
  }

  observe(onChange: () => void): () => void {
    return observeDom(onChange);
  }
}

function querySelectorFromList(selectors: string[]): HTMLElement[] {
  for (const sel of selectors) {
    const nodes = document.querySelectorAll<HTMLElement>(sel);
    if (nodes.length > 0) return Array.from(nodes);
  }
  return [];
}
