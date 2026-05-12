// PromptItem component. Renders a single row in the prompt list.

import type { Prompt } from '@/shared/types';
import { attachTooltip } from './Tooltip';

const MAX_DISPLAY_CHARS = 200;
const COPY_FEEDBACK_MS = 1200;

export interface PromptItemOptions {
  prompt: Prompt;
  onNavigate: (id: string) => void;
  onFavorite: (text: string) => Promise<boolean>;
  isFavorite: boolean;
  highlight?: string;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

/** Creates and returns a list-item element for one prompt. */
export function createPromptItem(opts: PromptItemOptions): HTMLLIElement {
  const {
    prompt, onNavigate, onFavorite, isFavorite, highlight,
    selectionMode = false, selected = false, onSelect,
  } = opts;
  const displayText = truncate(prompt.text, MAX_DISPLAY_CHARS);

  const li = document.createElement('li');
  li.className = 'prompt-item';
  li.setAttribute('data-prompt-id', prompt.id);
  if (selectionMode) li.classList.add('prompt-item--select-mode');
  if (selected) li.classList.add('prompt-item--selected');
  if (isFavorite) li.classList.add('prompt-item--favorited');

  // Checkbox (shown only in selection mode)
  if (selectionMode) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'prompt-item__checkbox';
    cb.checked = selected;
    cb.setAttribute('aria-label', `Select prompt ${prompt.index + 1}`);
    cb.addEventListener('change', () => {
      li.classList.toggle('prompt-item--selected', cb.checked);
      onSelect?.(prompt.id, cb.checked);
    });
    li.appendChild(cb);
  }

  // Index badge
  const indexSpan = document.createElement('span');
  indexSpan.className = 'prompt-item__index';
  indexSpan.setAttribute('aria-label', `Prompt ${prompt.index + 1}`);
  indexSpan.textContent = String(prompt.index + 1);

  // Text (clickable only when not in selection mode)
  const textSpan = document.createElement('span');
  textSpan.className = 'prompt-item__text';
  textSpan.innerHTML = highlight
    ? highlightMatch(escapeHtml(displayText), escapeHtml(highlight))
    : escapeHtml(displayText);
  if (!selectionMode) {
    textSpan.addEventListener('click', () => onNavigate(prompt.id));
  }
  // Show full text in a tooltip on hover (text may be truncated at MAX_DISPLAY_CHARS).
  if (prompt.text.length > 0) {
    attachTooltip(textSpan, prompt.text);
  }

  // Actions wrapper
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'prompt-item__actions';

  // Copy button
  const copyBtn = buildIconBtn('📋', 'Copy prompt');
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(prompt.text).then(() => {
      copyBtn.textContent = '✅';
      setTimeout(() => (copyBtn.textContent = '📋'), COPY_FEEDBACK_MS);
    });
  });

  // Favorite button
  const favBtn = buildIconBtn(isFavorite ? '⭐' : '☆', 'Toggle favorite');
  favBtn.classList.toggle('prompt-item__btn--active', isFavorite);
  favBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const nowFav = await onFavorite(prompt.text);
    favBtn.textContent = nowFav ? '⭐' : '☆';
    favBtn.classList.toggle('prompt-item__btn--active', nowFav);
    li.classList.toggle('prompt-item--favorited', nowFav);
  });

  actionsDiv.appendChild(copyBtn);
  actionsDiv.appendChild(favBtn);

  li.appendChild(indexSpan);
  li.appendChild(textSpan);
  li.appendChild(actionsDiv);

  li.setAttribute('tabindex', '0');
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (selectionMode) {
        const cb = li.querySelector<HTMLInputElement>('.prompt-item__checkbox');
        if (cb) {
          cb.checked = !cb.checked;
          li.classList.toggle('prompt-item--selected', cb.checked);
          onSelect?.(prompt.id, cb.checked);
        }
      } else {
        onNavigate(prompt.id);
      }
    }
  });

  return li;
}

function buildIconBtn(icon: string, label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'prompt-item__btn';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
  btn.textContent = icon;
  return btn;
}

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
