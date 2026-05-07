// PromptList component. Renders the scrollable list of user prompts.

import type { Prompt } from '@/shared/types';
import { createPromptItem } from './PromptItem';
import { renderEmptyState } from './EmptyState';
import { getFavorites, toggleFavorite } from '@/shared/storage';

export interface PromptListOptions {
  prompts: Prompt[];
  onNavigate: (id: string) => void;
  highlight?: string;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onSelect?: (id: string, selected: boolean) => void;
}

/** Renders (or re-renders) the prompt list into `container`. */
export async function renderPromptList(
  container: HTMLElement,
  opts: PromptListOptions,
): Promise<void> {
  const {
    prompts, onNavigate, highlight,
    selectionMode = false, selectedIds = new Set(), onSelect,
  } = opts;
  container.innerHTML = '';

  if (prompts.length === 0) {
    renderEmptyState(container, { reason: 'no-prompts' });
    return;
  }

  const favorites = await getFavorites();

  const ul = document.createElement('ul');
  ul.className = 'prompt-list';
  ul.setAttribute('aria-label', 'User prompts');
  if (selectionMode) ul.classList.add('prompt-list--select-mode');

  for (const prompt of prompts) {
    ul.appendChild(
      createPromptItem({
        prompt,
        onNavigate,
        highlight,
        isFavorite: favorites.has(prompt.text),
        onFavorite: toggleFavorite,
        selectionMode,
        selected: selectedIds.has(prompt.id),
        onSelect,
      }),
    );
  }

  container.appendChild(ul);
}
