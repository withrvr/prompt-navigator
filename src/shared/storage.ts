// Typed wrapper over browser.storage.local.
//
// All keys are namespaced with "pn:" to avoid collisions with the host page's
// storage (we're in the extension context, so collisions are impossible, but
// the prefix makes keys easy to spot in devtools).

import browser from './browser';
import { logger } from './logger';

const FAVORITES_KEY = 'pn:favorites';
const SETTINGS_KEY = 'pn:settings';

// ── Favorites ──────────────────────────────────────────────────────────────
// Stored as an ordered string[] so the user can reorder their favorites list.
// All callers that only need membership testing get a Set<string> wrapper.

/** Returns favorites in their saved order as an array. */
export async function getFavoritesOrdered(): Promise<string[]> {
  try {
    const result = await browser.storage.local.get(FAVORITES_KEY);
    const raw = result[FAVORITES_KEY];
    if (Array.isArray(raw)) return raw as string[];
  } catch (err) {
    logger.warn('storage: getFavoritesOrdered failed', err);
  }
  return [];
}

/** Persists a fully reordered favorites array. */
export async function saveFavoritesOrdered(ordered: string[]): Promise<void> {
  try {
    await browser.storage.local.set({ [FAVORITES_KEY]: ordered });
  } catch (err) {
    logger.warn('storage: saveFavoritesOrdered failed', err);
  }
}

// ── App Settings ───────────────────────────────────────────────────────────

export interface PnSettings {
  /** Whether to inject a floating navigator button on supported AI pages. */
  floatingButton: boolean;
  /** Key bindings for in-popup actions. Defaults applied at runtime. */
  shortcuts: {
    copy: string;     // default 'c'
    favorite: string; // default 'f'
  };
}

const DEFAULT_SETTINGS: PnSettings = {
  floatingButton: false,
  shortcuts: { copy: 'c', favorite: 'f' },
};

export async function getSettings(): Promise<PnSettings> {
  try {
    const result = await browser.storage.local.get(SETTINGS_KEY);
    const raw = result[SETTINGS_KEY] as Partial<PnSettings> | undefined;
    return { ...DEFAULT_SETTINGS, ...raw };
  } catch (err) {
    logger.warn('storage: getSettings failed', err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(patch: Partial<PnSettings>): Promise<void> {
  try {
    const current = await getSettings();
    await browser.storage.local.set({ [SETTINGS_KEY]: { ...current, ...patch } });
  } catch (err) {
    logger.warn('storage: saveSettings failed', err);
  }
}

/** Returns favorites as a Set for O(1) membership testing. */
export async function getFavorites(): Promise<Set<string>> {
  return new Set(await getFavoritesOrdered());
}

export async function toggleFavorite(text: string): Promise<boolean> {
  const ordered = await getFavoritesOrdered();
  const idx = ordered.indexOf(text);
  if (idx !== -1) {
    ordered.splice(idx, 1);
  } else {
    ordered.push(text);
  }
  await saveFavoritesOrdered(ordered);
  return idx === -1; // true = now a favorite
}
