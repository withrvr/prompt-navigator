// Content script entry point.
//
// Runs once per supported page load (document_idle). Picks an adapter for
// the current URL, watches for new turns via a debounced MutationObserver,
// and answers messages from the popup.

import browser from '@/shared/browser';
import { logger } from '@/shared/logger';
import { findAdapter } from './adapters/registry';
import { toMessagePrompt } from './adapters/base';
import type { DomPrompt } from './adapters/base';
import type { Message, AnyResponse } from '@/shared/messages';
import type { PromptAdapter } from './adapters/base';

logger.debug('content: bootstrap', location.href);

// ── State ──────────────────────────────────────────────────────────────────

let adapter: PromptAdapter | null = null;
let cachedPrompts: DomPrompt[] = [];
let disposeObserver: (() => void) | null = null;

// ── Initialization ─────────────────────────────────────────────────────────

function init(): void {
  const url = new URL(location.href);
  adapter = findAdapter(url);

  if (!adapter) {
    logger.debug('content: no adapter for', url.hostname);
    return;
  }

  logger.info('content: using adapter', adapter.id);
  refresh();

  disposeObserver = adapter.observe(() => {
    logger.debug('content: DOM changed, refreshing prompts');
    refresh();
  });
}

function refresh(): void {
  if (!adapter) return;
  cachedPrompts = adapter.getPrompts();
  logger.debug('content: found', cachedPrompts.length, 'prompts');
}

// ── Message handler ────────────────────────────────────────────────────────

browser.runtime.onMessage.addListener(
  (rawMsg: unknown): Promise<AnyResponse> | undefined => {
    const msg = rawMsg as Message;

    if (msg.type === 'PING') {
      return Promise.resolve({ ok: true });
    }

    if (msg.type === 'GET_PROMPTS') {
      refresh(); // always re-scan so the popup is never stale
      return Promise.resolve({
        platform: adapter?.id ?? 'unknown',
        prompts: cachedPrompts.map(toMessagePrompt),
        url: location.href,
      });
    }

    if (msg.type === 'SCROLL_TO') {
      const target = cachedPrompts.find((p) => p.id === msg.promptId);
      if (target && adapter) {
        adapter.scrollTo(target);
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: false });
    }

    return undefined;
  },
);

// ── Handle SPA navigations ─────────────────────────────────────────────────
// ChatGPT (and many other AI apps) are SPAs that mutate the URL without a
// full page reload. We watch for that and re-initialize.

let lastHref = location.href;

const navObserver = new MutationObserver(() => {
  if (location.href !== lastHref) {
    lastHref = location.href;
    logger.debug('content: SPA navigation detected, re-initializing');
    disposeObserver?.();
    init();
  }
});

navObserver.observe(document.body, { childList: true, subtree: true });

// ── Boot ───────────────────────────────────────────────────────────────────

init();
