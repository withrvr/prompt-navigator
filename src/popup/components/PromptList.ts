// PromptList component. Renders the scrollable list of user prompts.

import type { Prompt } from '@/shared/types';
import { createPromptItem } from './PromptItem';
import { renderEmptyState } from './EmptyState';

export interface PromptListOptions {
  prompts: Prompt[];
  onNavigate: (id: string) => void;
  highlight?: string;
}

/** Renders (or re-renders) the prompt list into `container`. */
export function renderPromptList(container: HTMLElement, opts: PromptListOptions): void {
  const { prompts, onNavigate, highlight } = opts;
  container.innerHTML = '';

  if (prompts.length === 0) {
    renderEmptyState(container, { reason: 'no-prompts' });
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'prompt-list';
  ul.setAttribute('aria-label', 'User prompts');

  for (const prompt of prompts) {
    ul.appendChild(createPromptItem({ prompt, onNavigate, highlight }));
  }

  container.appendChild(ul);
}
