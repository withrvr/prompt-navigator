// Typed wrapper over browser.storage.local.
//
// All keys are namespaced with "pn:" to avoid collisions with the host page's
// storage (we're in the extension context, so collisions are impossible, but
// the prefix makes keys easy to spot in devtools).

import browser from './browser';
import { logger } from './logger';

const FAVORITES_KEY = 'pn:favorites';

// ── Favorites ──────────────────────────────────────────────────────────────
// Favorites are stored as a Set of prompt texts (not IDs, which are
// positional and change when the conversation grows). Matching is exact.

export async function getFavorites(): Promise<Set<string>> {
  try {
    const result = await browser.storage.local.get(FAVORITES_KEY);
    const raw = result[FAVORITES_KEY];
    if (Array.isArray(raw)) return new Set<string>(raw as string[]);
  } catch (err) {
    logger.warn('storage: getFavorites failed', err);
  }
  return new Set();
}

export async function saveFavorites(favs: Set<string>): Promise<void> {
  try {
    await browser.storage.local.set({ [FAVORITES_KEY]: [...favs] });
  } catch (err) {
    logger.warn('storage: saveFavorites failed', err);
  }
}

export async function toggleFavorite(text: string): Promise<boolean> {
  const favs = await getFavorites();
  if (favs.has(text)) {
    favs.delete(text);
  } else {
    favs.add(text);
  }
  await saveFavorites(favs);
  return favs.has(text);
}
