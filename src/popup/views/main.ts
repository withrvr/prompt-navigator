// Main popup view. Queries the active tab's content script for user prompts
// and renders them as a clickable list. Clicking a prompt sends a SCROLL_TO
// message back so the page scrolls to that turn.

import browser from '@/shared/browser';
import { logger } from '@/shared/logger';
import type { Message } from '@/shared/messages';
import type { PromptsResponse } from '@/shared/types';
import { renderHeader, updateHeaderCount } from '../components/Header';
import { renderPromptList } from '../components/PromptList';
import { renderEmptyState } from '../components/EmptyState';

// ── Helpers ────────────────────────────────────────────────────────────────

async function getActiveTabId(): Promise<number | null> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

async function sendToContent<T>(tabId: number, msg: Message): Promise<T | null> {
  try {
    return (await browser.tabs.sendMessage(tabId, msg)) as T;
  } catch (err) {
    logger.warn('popup: sendMessage failed', err);
    return null;
  }
}

// ── Main render ─────────────────────────────────────────────────────────────

export async function renderMainView(root: HTMLElement): Promise<void> {
  root.innerHTML = '';

  // Skeleton: header + body
  const headerContainer = document.createElement('div');
  const body = document.createElement('section');
  body.className = 'app__body';

  root.appendChild(headerContainer);
  root.appendChild(body);

  renderHeader(headerContainer, {});
  renderEmptyState(body, { reason: 'loading' });

  // ── Fetch prompts from content script ──────────────────────────────────
  const tabId = await getActiveTabId();
  if (tabId === null) {
    renderEmptyState(body, { reason: 'error', detail: 'No active tab found.' });
    return;
  }

  const response = await sendToContent<PromptsResponse>(tabId, { type: 'GET_PROMPTS' });

  if (!response) {
    // Content script isn't running — likely an unsupported page or the
    // script hasn't loaded yet.
    renderHeader(headerContainer, {});
    renderEmptyState(body, { reason: 'unsupported' });
    return;
  }

  const { prompts, platform } = response;
  logger.debug('popup: got', prompts.length, 'prompts from', platform);

  const header = renderHeader(headerContainer, { count: prompts.length });

  // ── Navigate handler ───────────────────────────────────────────────────
  async function onNavigate(promptId: string): Promise<void> {
    await sendToContent(tabId!, { type: 'SCROLL_TO', promptId });
    // Close the popup so the user can see the page scroll to the prompt.
    window.close();
  }

  renderPromptList(body, { prompts, onNavigate });
  updateHeaderCount(header, prompts.length);
}
