// Gemini adapter (gemini.google.com).
//
// User turns are rendered as <user-query> custom elements. Text lives in a
// .query-text or .user-query-content child depending on the Gemini version.
// Gemini occasionally prefixes the visible text with "You said:" in a
// visually-hidden span — we strip known prefix patterns after extraction.

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { PlatformId } from '@/shared/types';

const USER_QUERY_SELECTOR = 'user-query';
const TEXT_CHILD_SELECTORS = ['.query-text', '.user-query-content', 'p'];

// Regex that matches "You said" (any capitalisation) followed by optional
// colon, comma, or whitespace — covers every variant Gemini currently renders.
const STRIP_PREFIX_RE = /^you\s+said[:\s,]*/i;

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
      const t = stripKnownPrefixes(extractText(child));
      if (t) return t;
    }
  }
  return stripKnownPrefixes(extractText(el));
}

function stripKnownPrefixes(text: string): string {
  return text.replace(STRIP_PREFIX_RE, '').trimStart();
}
