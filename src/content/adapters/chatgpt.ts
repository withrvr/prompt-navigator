// ChatGPT adapter.
//
// Targets chatgpt.com and the legacy chat.openai.com domain. User turns are
// identified by [data-message-author-role="user"] — the most stable selector
// across ChatGPT's React re-renders (the attribute has been present since
// mid-2023 and is used by ChatGPT's own accessibility tree).

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import type { PlatformId } from '@/shared/types';

const USER_ROLE_SELECTOR = '[data-message-author-role="user"]';
const CHATGPT_HOSTS = new Set(['chatgpt.com', 'chat.openai.com']);

export class ChatGptAdapter implements PromptAdapter {
  readonly id: PlatformId = 'chatgpt';

  matches(url: URL): boolean {
    return CHATGPT_HOSTS.has(url.hostname);
  }

  getPrompts(): DomPrompt[] {
    const nodes = document.querySelectorAll<HTMLElement>(USER_ROLE_SELECTOR);
    const prompts: DomPrompt[] = [];

    nodes.forEach((el, index) => {
      const text = extractText(el);
      if (!text) return;
      prompts.push({
        id: `chatgpt-${index}`,
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

/** Extract visible text content from a user-turn element. */
function extractText(el: HTMLElement): string {
  // ChatGPT wraps the actual message in a nested div; innerText gives the
  // human-readable content (respects br → newline, collapses CSS-hidden).
  return el.innerText?.trim() ?? '';
}
