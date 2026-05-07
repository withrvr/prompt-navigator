// Grok adapter (grok.com, x.com/i/grok).
//
// Source confirms `div.message-bubble` is the per-turn container
// (verified via the give-me/bookmarklets export script). Grok renders both
// user and assistant turns with the same class, so we filter user turns by
// alignment: user bubbles live inside a flex row with `items-end` /
// `justify-end` (right-aligned), assistant bubbles are left-aligned.
//
// Selector chain:
//   1. div.items-end div.message-bubble        — current right-aligned wrapper
//   2. div.justify-end div.message-bubble      — alternate Tailwind layout
//   3. div[data-message-author="user"]         — hopeful future-proof attr
//
// If the structure changes and none of the above hit, fall back to even-
// indexed message bubbles (chat conventions: index 0 = user, 1 = assistant).

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { PlatformId } from '@/shared/types';

const PRIMARY_SELECTORS = [
  'div.items-end div.message-bubble',
  'div.justify-end div.message-bubble',
  'div[data-message-author="user"]',
];

const FALLBACK_ALL_BUBBLES = 'div.message-bubble';

const GROK_HOSTS = new Set(['grok.com', 'www.grok.com']);

export class GrokAdapter implements PromptAdapter {
  readonly id: PlatformId = 'grok';

  matches(url: URL): boolean {
    if (GROK_HOSTS.has(url.hostname)) return true;
    // Grok also lives at x.com/i/grok and twitter.com/i/grok
    if (url.hostname === 'x.com' || url.hostname === 'twitter.com') {
      return url.pathname.startsWith('/i/grok');
    }
    return false;
  }

  getPrompts(): DomPrompt[] {
    let nodes = querySelectorFromList(PRIMARY_SELECTORS);

    if (nodes.length === 0) {
      // Fallback: alternate every other message-bubble starting at index 0.
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
