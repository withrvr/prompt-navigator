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

// Prefixes injected by Gemini's own UI that we strip from user-visible text.
const STRIP_PREFIXES = ['you said:', 'you said '];

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
  const lower = text.toLowerCase();
  for (const prefix of STRIP_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return text.slice(prefix.length).trimStart();
    }
  }
  return text;
}
