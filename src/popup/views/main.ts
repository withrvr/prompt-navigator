// Main popup view. Fetches user prompts from the active tab, then provides
// live search, a prompt count, refresh, favorites-only toggle, and access
// to settings/info views.

import browser from '@/shared/browser';
import { logger } from '@/shared/logger';
import type { Message, RuntimeMessage } from '@/shared/messages';
import type { Prompt, PromptsResponse } from '@/shared/types';
import { renderHeader, updateHeaderCount } from '../components/Header';
import { renderPromptList } from '../components/PromptList';
import { renderEmptyState, buildReportUrl } from '../components/EmptyState';
import { createSearchBar, filterPrompts, filterFavorites } from '../components/SearchBar';
import { renderFooter } from '../components/Footer';
import { getFavorites, getSettings, addRecentPrompt } from '@/shared/storage';
import { registerKeyboardShortcuts } from '../keyboard';
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
  searchContainer.hidden = true; // hidden until prompts arrive
  const body = document.createElement('section');
  body.className = 'app__body';
  const footerContainer = document.createElement('div');

  root.appendChild(headerContainer);
  root.appendChild(searchContainer);
  root.appendChild(body);
  root.appendChild(footerContainer);

  // All four header callbacks are wired up before data arrives so the buttons
  // are always visible from the first paint.
  let doFetch = async (): Promise<void> => {};
  renderHeader(headerContainer, {
    onRefresh:   () => void doFetch(),
    onFavorites: () => navigate('favorites'),
    onRecent:    () => navigate('recent'),
    onSettings:  () => navigate('settings'),
  });
  renderEmptyState(body, { reason: 'loading' });

  const tabId = await getActiveTabId();
  if (tabId === null) {
    renderEmptyState(body, { reason: 'error', detail: 'No active tab found.' });
    return;
  }

  doFetch = async (): Promise<void> => {
    renderEmptyState(body, { reason: 'loading' });
    const response = await sendToContent<PromptsResponse>(tabId, { type: 'GET_PROMPTS' });

    if (!response) {
      // Unsupported site: size the popup like the Settings view (auto-height)
      // so it doesn't show a tiny empty state inside a 600px shell.
      document.body.classList.remove('pn-list-view');
      searchContainer.hidden = true;
      searchContainer.innerHTML = '';
      footerContainer.innerHTML = '';
      renderEmptyState(body, { reason: 'unsupported' });
      return;
    }

    const { prompts, platform, url: pageUrl } = response;
    logger.debug('popup: got', prompts.length, 'prompts from', platform);

    // Local view state
    let currentQuery = '';
    let favoritesOnly = false;
    let favorites = await getFavorites();
    let selectionMode = false;
    const selectedIds = new Set<string>();
    const settings = await getSettings();
    let currentFiltered: Prompt[] = [...prompts];

    const header = renderHeader(headerContainer, {
      count: prompts.length,
      onRefresh:   () => void doFetch(),
      onFavorites: () => navigate('favorites'),
      onRecent:    () => navigate('recent'),
      onSettings:  () => navigate('settings'),
    });

    const refreshFooter = (): void => {
      if (prompts.length > 0) {
        renderFooter(footerContainer, {
          prompts,
          filteredPrompts: currentFiltered,
          platform,
          pageUrl,
          favorites,
          selectionMode,
          selectedIds,
          bodyEl: body,
          onToggleSelectionMode: () => {
            selectionMode = !selectionMode;
            if (!selectionMode) selectedIds.clear();
            void applyFilters();
            refreshFooter();
          },
          onSelectAll: () => {
            currentFiltered.forEach((p) => selectedIds.add(p.id));
            void applyFilters();
            refreshFooter();
          },
          onDeselectAll: () => {
            selectedIds.clear();
            void applyFilters();
            refreshFooter();
          },
        });
      }
    };

    const applyFilters = async (): Promise<void> => {
      let list = prompts;
      if (favoritesOnly) list = filterFavorites(list, favorites);
      list = filterPrompts(list, currentQuery);
      currentFiltered = list;
      await renderList(list, currentQuery, favoritesOnly);
      updateHeaderCount(header, list.length, prompts.length);
      refreshFooter();
    };

    if (prompts.length > 0) {
      searchContainer.hidden = false;
      searchContainer.innerHTML = '';
      const bar = createSearchBar({
        onSearch: (q) => {
          currentQuery = q;
          void applyFilters();
        },
        onToggleFavorites: async (active) => {
          favoritesOnly = active;
          favorites = await getFavorites();
          void applyFilters();
        },
      });
      searchContainer.appendChild(bar);
    } else {
      searchContainer.hidden = true;
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
        const isKnown = platform !== 'unknown';
        renderEmptyState(body, {
          reason: 'no-prompts',
          reportUrl: isKnown ? buildReportUrl(platform, pageUrl) : undefined,
        });
        return;
      }
      // Restore scroll position from session storage
      const scrollKey = `pn:scroll:${pageUrl}`;
      const savedScroll = sessionStorage.getItem(scrollKey);

      await renderPromptList(body, {
        prompts: list,
        onNavigate: async (promptId) => {
          sessionStorage.setItem(scrollKey, String(body.scrollTop));
          // Persist to recent-prompts history before closing
          const prompt = list.find((p) => p.id === promptId);
          if (prompt) {
            void addRecentPrompt({
              text: prompt.text,
              platform,
              url: pageUrl ?? '',
              usedAt: Date.now(),
            });
          }
          await sendToContent(tabId, { type: 'SCROLL_TO', promptId });
          window.close();
        },
        highlight: query,
        selectionMode,
        selectedIds,
        onSelect: (id, sel) => {
          if (sel) selectedIds.add(id);
          else selectedIds.delete(id);
          refreshFooter();
        },
        favorites,
      });

      // Restore scroll after render
      if (savedScroll !== null) {
        body.scrollTop = Number(savedScroll);
      }
    };

    await applyFilters();

    // Register keyboard shortcuts after the first render
    const disposeKeys = registerKeyboardShortcuts({
      getItems: () => body.querySelectorAll<HTMLElement>('.prompt-item'),
      onJump: (idx) => {
        const visiblePrompts = body.querySelectorAll<HTMLElement>('.prompt-item');
        const item = visiblePrompts[idx];
        if (!item) return;
        const id = item.getAttribute('data-prompt-id');
        if (id) void sendToContent(tabId, { type: 'SCROLL_TO', promptId: id }).then(() => window.close());
      },
      shortcuts: settings.shortcuts,
    });

    // Re-fetch when the floating navigator detects a SPA navigation.
    const urlChangedListener = (msg: unknown): void => {
      if ((msg as RuntimeMessage).type === 'URL_CHANGED') {
        void doFetch();
      }
    };
    browser.runtime.onMessage.addListener(urlChangedListener);

    // Dispose shortcuts and URL listener when the view is replaced
    const observer = new MutationObserver(() => {
      if (!document.contains(body)) {
        disposeKeys();
        browser.runtime.onMessage.removeListener(urlChangedListener);
        observer.disconnect();
      }
    });
    observer.observe(root, { childList: true });
  };

  await doFetch();
}
