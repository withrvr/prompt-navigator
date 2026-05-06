// Theme bootstrap for the popup.
//
// Phase 1 just reflects the stored preference (or "auto") onto
// `<html data-theme>`. Phase 7 expands this into a full theme system
// with a togglable UI control.

import { logger } from '@/shared/logger';

export type ThemePreference = 'auto' | 'light' | 'dark';

const THEME_KEY = 'pn:theme';

/** Read stored preference, defaulting to "auto". */
export function getStoredTheme(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark' || v === 'auto') return v;
  } catch (err) {
    logger.warn('theme: localStorage read failed', err);
  }
  return 'auto';
}

/** Apply the stored theme to the popup's `<html>` element. */
export function applyStoredTheme(): void {
  document.documentElement.setAttribute('data-theme', getStoredTheme());
}
