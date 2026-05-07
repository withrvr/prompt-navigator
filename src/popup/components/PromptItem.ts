// PromptItem component. Renders a single row in the prompt list.

import type { Prompt } from '@/shared/types';

const MAX_DISPLAY_CHARS = 120;

export interface PromptItemOptions {
  prompt: Prompt;
  onNavigate: (id: string) => void;
  /** Highlight this substring (case-insensitive) in the text. */
  highlight?: string;
}

/** Creates and returns a list-item element for one prompt. */
export function createPromptItem(opts: PromptItemOptions): HTMLLIElement {
  const { prompt, onNavigate, highlight } = opts;
  const displayText = truncate(prompt.text, MAX_DISPLAY_CHARS);

  const li = document.createElement('li');
  li.className = 'prompt-item';
  li.setAttribute('data-prompt-id', prompt.id);
  li.setAttribute('title', prompt.text);

  const indexSpan = document.createElement('span');
  indexSpan.className = 'prompt-item__index';
  indexSpan.setAttribute('aria-label', `Prompt ${prompt.index + 1}`);
  indexSpan.textContent = String(prompt.index + 1);

  const textSpan = document.createElement('span');
  textSpan.className = 'prompt-item__text';
  textSpan.innerHTML = highlight
    ? highlightMatch(escapeHtml(displayText), escapeHtml(highlight))
    : escapeHtml(displayText);

  li.appendChild(indexSpan);
  li.appendChild(textSpan);

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

/** Wrap matched substring in a <mark> for visual highlight. */
function highlightMatch(escapedText: string, escapedQuery: string): string {
  if (!escapedQuery) return escapedText;
  const re = new RegExp(`(${escapeRegex(escapedQuery)})`, 'gi');
  return escapedText.replace(re, '<mark class="prompt-item__match">$1</mark>');
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

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
