// Gemini adapter (gemini.google.com).
//
// Gemini renders user turns as <user-query> custom elements. The text lives
// inside a .query-text or .user-query-content child depending on the
// Gemini version. We try both, then fall back to the element's own
// innerText so a minor DOM tweak doesn't break extraction entirely.

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import type { PlatformId } from '@/shared/types';

// Primary selector — the custom element wrapping each user turn.
const USER_QUERY_SELECTOR = 'user-query';

// Inner text selectors tried in order (most specific first).
const TEXT_CHILD_SELECTORS = ['.query-text', '.user-query-content', 'p'];

export class GeminiAdapter implements PromptAdapter {
  readonly id: PlatformId = 'gemini';

  matches(url: URL): boolean {
    return url.hostname === 'gemini.google.com';
  }

  getPrompts(): DomPrompt[] {
    const nodes = document.querySelectorAll<HTMLElement>(USER_QUERY_SELECTOR);
    const prompts: DomPrompt[] = [];

    nodes.forEach((el, index) => {
      const text = extractText(el);
      if (!text) return;
      prompts.push({
        id: `gemini-${index}`,
        index,
        text,
        length: text.length,
        element: el,
      });
    });

    return prompts;
  }

  scrollTo(prompt: DomPrompt): void {
    safeScrollTo(prompt.element);
  }

  observe(onChange: () => void): () => void {
    return observeDom(onChange);
  }
}

function extractText(el: HTMLElement): string {
  for (const sel of TEXT_CHILD_SELECTORS) {
    const child = el.querySelector<HTMLElement>(sel);
    if (child?.innerText?.trim()) return child.innerText.trim();
  }
  // Last resort: use the whole element's text (may include toolbar buttons)
  return el.innerText?.trim() ?? '';
}
