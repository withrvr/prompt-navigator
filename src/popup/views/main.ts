// Main popup view. Fetches user prompts from the active tab, then provides
// live search, a prompt count, refresh, favorites-only toggle, and access
// to settings/info views.

import browser from '@/shared/browser';
import { logger } from '@/shared/logger';
import type { Message } from '@/shared/messages';
import type { Prompt, PromptsResponse } from '@/shared/types';
import { renderHeader, updateHeaderCount } from '../components/Header';
import { renderPromptList } from '../components/PromptList';
import { renderEmptyState } from '../components/EmptyState';
import { createSearchBar, filterPrompts, filterFavorites } from '../components/SearchBar';
import { renderFooter } from '../components/Footer';
import { getFavorites } from '@/shared/storage';
import type { ViewName } from '../popup';

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

export async function renderMainView(
  root: HTMLElement,
  navigate: (view: ViewName) => void,
): Promise<void> {
  root.innerHTML = '';

  const headerContainer = document.createElement('div');
  const searchContainer = document.createElement('div');
  searchContainer.className = 'app__search';
  const body = document.createElement('section');
  body.className = 'app__body';
  const footerContainer = document.createElement('div');

  root.appendChild(headerContainer);
  root.appendChild(searchContainer);
  root.appendChild(body);
  root.appendChild(footerContainer);

  renderHeader(headerContainer, { onSettings: () => navigate('settings') });
  renderEmptyState(body, { reason: 'loading' });

  const tabId = await getActiveTabId();
  if (tabId === null) {
    renderEmptyState(body, { reason: 'error', detail: 'No active tab found.' });
    return;
  }

  const fetchAndRender = async (): Promise<void> => {
    renderEmptyState(body, { reason: 'loading' });
    const response = await sendToContent<PromptsResponse>(tabId, { type: 'GET_PROMPTS' });

    if (!response) {
      renderHeader(headerContainer, { onSettings: () => navigate('settings') });
      searchContainer.innerHTML = '';
      renderEmptyState(body, { reason: 'unsupported' });
      return;
    }

    const { prompts, platform } = response;
    logger.debug('popup: got', prompts.length, 'prompts from', platform);

    // Local view state
    let currentQuery = '';
    let favoritesOnly = false;
    let favorites = await getFavorites();

    const header = renderHeader(headerContainer, {
      count: prompts.length,
      onRefresh: () => void fetchAndRender(),
      onSettings: () => navigate('settings'),
    });

    const applyFilters = async (): Promise<void> => {
      let list = prompts;
      if (favoritesOnly) list = filterFavorites(list, favorites);
      list = filterPrompts(list, currentQuery);
      await renderList(list, currentQuery, favoritesOnly);
      updateHeaderCount(header, list.length, prompts.length);
    };

    searchContainer.innerHTML = '';
    if (prompts.length > 0) {
      const bar = createSearchBar({
        onSearch: (q) => {
          currentQuery = q;
          void applyFilters();
        },
        onToggleFavorites: async (active) => {
          favoritesOnly = active;
          // Re-read favorites in case the user starred something this session
          favorites = await getFavorites();
          void applyFilters();
        },
      });
      searchContainer.appendChild(bar);
    }

    const renderList = async (
      list: Prompt[],
      query: string,
      favsOnly: boolean,
    ): Promise<void> => {
      if (list.length === 0) {
        if (query.trim()) {
          renderEmptyState(body, { reason: 'no-match' });
          return;
        }
        if (favsOnly) {
          renderEmptyState(body, {
            reason: 'no-match',
            detail: 'No starred prompts yet. Tap ⭐ on a prompt to favorite it.',
          });
          return;
        }
      }
      await renderPromptList(body, {
        prompts: list,
        onNavigate: async (promptId) => {
          await sendToContent(tabId, { type: 'SCROLL_TO', promptId });
          window.close();
        },
        highlight: query,
      });
    };

    await applyFilters();

    if (prompts.length > 0) {
      renderFooter(footerContainer, { prompts, platform });
    }
  };

  await fetchAndRender();
}
