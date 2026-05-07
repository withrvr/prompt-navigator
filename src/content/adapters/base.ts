// PromptAdapter — the contract every AI-platform integration implements.
//
// Adapters are intentionally small: each one knows just enough about its
// host site to find user-prompt elements, hand back text + ids, and scroll
// the page back to a specific prompt. The content script (`src/content/
// index.ts`) is responsible for adapter selection, observation, and
// messaging — keeping per-platform code laser-focused.

import type { PlatformId, Prompt } from '@/shared/types';

/**
 * One prompt as found in the DOM, before being serialized for the popup.
 * The element reference stays inside the content script — only the
 * sanitized {@link Prompt} crosses the message boundary.
 */
export interface DomPrompt extends Prompt {
  element: HTMLElement;
}

/** Contract every adapter implements. */
export interface PromptAdapter {
  /** Stable identifier (also the registry key). */
  readonly id: PlatformId;

  /** Returns true if this adapter handles the given URL. */
  matches(url: URL): boolean;

  /** Extracts every user prompt currently in the DOM. */
  getPrompts(): DomPrompt[];

  /**
   * Scrolls the page so the given prompt is visible. Implementations should
   * prefer `window.scrollTo`/parent-scroller-based approaches and avoid
   * `Element.scrollIntoView` when the host app intercepts scroll events
   * (e.g. Claude.ai).
   */
  scrollTo(prompt: DomPrompt): void;

  /**
   * Subscribe to DOM changes that may add/remove/edit user prompts. Returns
   * a disposer that detaches the underlying observer.
   */
  observe(onChange: () => void): () => void;
}

/** Strip a {@link DomPrompt} into the message-safe {@link Prompt} shape. */
export function toMessagePrompt(p: DomPrompt): Prompt {
  return { id: p.id, index: p.index, text: p.text, length: p.length };
}
