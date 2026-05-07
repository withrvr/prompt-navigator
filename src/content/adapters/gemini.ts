// Gemini adapter (gemini.google.com).
//
// User turns are rendered as <user-query> custom elements. The text lives
// inside a .query-text or .user-query-content child depending on the Gemini
// version. We try both, then fall back to the element's own text content.

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { PlatformId } from '@/shared/types';

const USER_QUERY_SELECTOR = 'user-query';
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
      const text = extractGeminiText(el);
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

function extractGeminiText(el: HTMLElement): string {
  for (const sel of TEXT_CHILD_SELECTORS) {
    const child = el.querySelector<HTMLElement>(sel);
    if (child) {
      const t = extractText(child);
      if (t) return t;
    }
  }
  return extractText(el);
}
