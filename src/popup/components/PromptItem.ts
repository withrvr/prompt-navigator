// PromptItem component. Renders a single row in the prompt list.
//
// Phase 2: number badge + truncated text + click-to-navigate.
// Phase 6+: search highlight, copy, favorite buttons added.

import type { Prompt } from '@/shared/types';

const MAX_DISPLAY_CHARS = 120;

export interface PromptItemOptions {
  prompt: Prompt;
  onNavigate: (id: string) => void;
}

/** Creates and returns a list-item element for one prompt. */
export function createPromptItem(opts: PromptItemOptions): HTMLLIElement {
  const { prompt, onNavigate } = opts;
  const displayText = truncate(prompt.text, MAX_DISPLAY_CHARS);

  const li = document.createElement('li');
  li.className = 'prompt-item';
  li.setAttribute('data-prompt-id', prompt.id);
  li.setAttribute('title', prompt.text);

  li.innerHTML = `
    <span class="prompt-item__index" aria-label="Prompt ${prompt.index + 1}">${prompt.index + 1}</span>
    <span class="prompt-item__text">${escapeHtml(displayText)}</span>
  `;

  li.addEventListener('click', () => onNavigate(prompt.id));
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(prompt.id);
    }
  });

  li.setAttribute('role', 'button');
  li.setAttribute('tabindex', '0');

  return li;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
