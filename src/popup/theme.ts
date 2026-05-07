// Theme management for the popup.
//
// Three modes: 'auto' (follows OS), 'light', 'dark'. The current preference
// is persisted in localStorage so it survives popup close/reopen. The <html>
// data-theme attribute is the CSS hook (see styles/theme.css).

import { logger } from '@/shared/logger';

export type ThemePreference = 'auto' | 'light' | 'dark';

const STORAGE_KEY = 'pn:theme';

export function getStoredTheme(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'auto') return v;
  } catch (err) {
    logger.warn('theme: localStorage read failed', err);
  }
  return 'auto';
}

export function setStoredTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    logger.warn('theme: localStorage write failed', err);
  }
}

export function applyTheme(theme: ThemePreference): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export function applyStoredTheme(): void {
  applyTheme(getStoredTheme());
}

/** Cycle: auto → dark → light → auto */
export function cycleTheme(): ThemePreference {
  const current = getStoredTheme();
  const next: ThemePreference = current === 'auto' ? 'dark' : current === 'dark' ? 'light' : 'auto';
  setStoredTheme(next);
  applyTheme(next);
  return next;
}

export function themeLabel(theme: ThemePreference): string {
  return theme === 'auto' ? '🌗' : theme === 'dark' ? '🌙' : '☀️';
}
