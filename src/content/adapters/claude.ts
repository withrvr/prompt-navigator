// Claude adapter (claude.ai).
//
// User turns are identified by [data-testid="user-message"]. This attribute
// is present in Claude's React tree and is more stable than class names, which
// are hashed and change across deployments.
//
// IMPORTANT: Claude.ai intercepts Element#scrollIntoView in a way that can
// break the app's own virtual scroll container. We delegate to safeScrollTo
// which finds the nearest scrollable ancestor and uses scrollTo() instead.

import type { DomPrompt, PromptAdapter } from './base';
import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { PlatformId } from '@/shared/types';

const USER_MESSAGE_SELECTOR = '[data-testid="user-message"]';

export class ClaudeAdapter implements PromptAdapter {
  readonly id: PlatformId = 'claude';

  matches(url: URL): boolean {
    return url.hostname === 'claude.ai' || url.hostname.endsWith('.claude.ai');
  }

  getPrompts(): DomPrompt[] {
    const nodes = document.querySelectorAll<HTMLElement>(USER_MESSAGE_SELECTOR);
    const prompts: DomPrompt[] = [];

    nodes.forEach((el, index) => {
      const text = extractText(el);
      if (!text) return;
      prompts.push({
        id: `claude-${index}`,
        index,
        text,
        length: text.length,
        element: el,
      });
    });

    return prompts;
  }

  scrollTo(prompt: DomPrompt): void {
    // Never call scrollIntoView on Claude — use the safe scroller.
    safeScrollTo(prompt.element);
  }

  observe(onChange: () => void): () => void {
    return observeDom(onChange);
  }
}
