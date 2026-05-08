// Shared helpers used by every concrete adapter.
//
// Concentrates the boilerplate (text extraction, prompt construction,
// observe wiring) so each platform file only contains the parts that are
// actually unique to that site — the selector and (optionally) the text
// extractor strategy.

import { observeDom } from '@/content/observer';
import { safeScrollTo } from '@/content/scroll';
import { extractText } from './extract';
import type { DomPrompt, PromptAdapter } from './base';
import type { PlatformId } from '@/shared/types';

export interface CommonAdapterConfig {
  id: PlatformId;
  /** URL hostname(s) this adapter handles. */
  hosts: string[];
  /** Extra URL predicate for path-scoped routing (e.g. x.com/i/grok). */
  pathMatches?: (url: URL) => boolean;
  /** Selector(s) used to find user-prompt elements; tried in order. */
  selectors: string[];
  /** Optional: pull text from a different element than the matched node. */
  textFor?: (el: HTMLElement) => string;
}

/** Build a concrete adapter from a config object. */
export function makeAdapter(cfg: CommonAdapterConfig): PromptAdapter {
  const idPrefix = cfg.id;

  return {
    id: cfg.id,

    matches(url: URL): boolean {
      const hostname = url.hostname;
      // Support both exact match and subdomain wildcard (e.g. "perplexity.ai" matches "www.perplexity.ai")
      const matched = cfg.hosts.some(
        (h) => hostname === h || hostname.endsWith(`.${h}`),
      );
      if (!matched) return false;
      if (cfg.pathMatches && !cfg.pathMatches(url)) return false;
      return true;
    },

    getPrompts(): DomPrompt[] {
      const nodes = querySelectorAllFromList(cfg.selectors);
      const prompts: DomPrompt[] = [];

      nodes.forEach((el, index) => {
        const text = cfg.textFor ? cfg.textFor(el) : extractText(el);
        if (!text) return;
        prompts.push({
          id: `${idPrefix}-${index}`,
          index,
          text,
          length: text.length,
          element: el,
        });
      });

      return prompts;
    },

    scrollTo(prompt: DomPrompt): void {
      safeScrollTo(prompt.element);
    },

    observe(onChange: () => void): () => void {
      return observeDom(onChange);
    },
  };
}

/**
 * Try each selector in order; returns the matches from the first one that
 * yields any nodes. Lets adapters degrade across DOM revisions without
 * combining unrelated elements.
 */
function querySelectorAllFromList(selectors: string[]): HTMLElement[] {
  for (const sel of selectors) {
    const nodes = document.querySelectorAll<HTMLElement>(sel);
    if (nodes.length > 0) return Array.from(nodes);
  }
  return [];
}
