// Main popup view. Fetches user prompts from the active tab, then provides
// live search, a prompt count, and a refresh button. Clicking any prompt
// sends SCROLL_TO to the content script and closes the popup.

import browser from '@/shared/browser';
import { logger } from '@/shared/logger';
import type { Message } from '@/shared/messages';
import type { Prompt, PromptsResponse } from '@/shared/types';
import { renderHeader, updateHeaderCount } from '../components/Header';
import { renderPromptList } from '../components/PromptList';
import { renderEmptyState } from '../components/EmptyState';
import { createSearchBar, filterPrompts } from '../components/SearchBar';

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

  // Skeleton: header container + search + body
  const headerContainer = document.createElement('div');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'app__search';
  const body = document.createElement('section');
  body.className = 'app__body';

  root.appendChild(headerContainer);
  root.appendChild(searchContainer);
  root.appendChild(body);

  renderHeader(headerContainer, {});
  renderEmptyState(body, { reason: 'loading' });

  // ── Fetch prompts ──────────────────────────────────────────────────────
  const tabId = await getActiveTabId();
  if (tabId === null) {
    renderEmptyState(body, { reason: 'error', detail: 'No active tab found.' });
    return;
  }

  const fetchAndRender = async (): Promise<void> => {
    renderEmptyState(body, { reason: 'loading' });
    const response = await sendToContent<PromptsResponse>(tabId, { type: 'GET_PROMPTS' });

    if (!response) {
      renderHeader(headerContainer, {});
      searchContainer.innerHTML = '';
      renderEmptyState(body, { reason: 'unsupported' });
      return;
    }

    const { prompts, platform } = response;
    logger.debug('popup: got', prompts.length, 'prompts from', platform);

    let currentQuery = '';

    const header = renderHeader(headerContainer, {
      count: prompts.length,
      onRefresh: () => void fetchAndRender(),
    });

    // Search bar
    searchContainer.innerHTML = '';
    if (prompts.length > 0) {
      const bar = createSearchBar({
        onSearch: (q) => {
          currentQuery = q;
          const filtered = filterPrompts(prompts, q);
          renderList(filtered, q);
          updateHeaderCount(header, filtered.length, prompts.length);
        },
      });
      searchContainer.appendChild(bar);
    }

    const renderList = (list: Prompt[], query: string): void => {
      void renderPromptList(body, {
        prompts: list,
        onNavigate: async (promptId) => {
          await sendToContent(tabId, { type: 'SCROLL_TO', promptId });
          window.close();
        },
        highlight: query,
      });
    };

    renderList(prompts, currentQuery);
    updateHeaderCount(header, prompts.length, prompts.length);
  };

  await fetchAndRender();
}
