// Lightweight i18n foundation.
//
// All user-visible strings live here. Currently ships English only.
// To add a locale: create an object matching the `Strings` type and
// register it in LOCALES below. Locale selection falls back to English
// for any missing key.
//
// Usage:
//   import { t } from '@/shared/i18n';
//   element.textContent = t('search.placeholder');

// ── String catalogue ───────────────────────────────────────────────────────

export interface Strings {
  // Header
  'header.title': string;
  'header.refresh': string;
  'header.settings': string;
  'header.themeToggle': string;
  // Count
  'count.prompts': (n: number) => string;
  'count.filtered': (visible: number, total: number) => string;
  // Search
  'search.placeholder': string;
  'search.favToggleLabel': string;
  // Prompt item
  'item.copy': string;
  'item.copyDone': string;
  'item.favorite': string;
  'item.unfavorite': string;
  // Empty states
  'empty.loading.heading': string;
  'empty.loading.body': string;
  'empty.noPrompts.heading': string;
  'empty.noPrompts.body': string;
  'empty.noMatch.heading': string;
  'empty.noMatch.body': string;
  'empty.noFavs.body': string;
  'empty.unsupported.heading': string;
  'empty.unsupported.body': string;
  'empty.error.heading': string;
  'empty.error.body': string;
  'empty.report': string;
  // Footer
  'footer.select': string;
  'footer.selectDone': string;
  'footer.export': string;
  'footer.exportN': (n: number) => string;
  // Settings
  'settings.title': string;
  'settings.back': string;
  'settings.theme.heading': string;
  'settings.theme.auto': string;
  'settings.theme.light': string;
  'settings.theme.dark': string;
  'settings.kb.heading': string;
  'settings.kb.desc': string;
  'settings.kb.copy': string;
  'settings.kb.favorite': string;
  'settings.float.heading': string;
  'settings.float.label': string;
  'settings.float.hint': string;
  'settings.favs.heading': string;
  'settings.favs.manage': string;
  'settings.support.heading': string;
  'settings.support.body': string;
  // Favorites view
  'favs.title': string;
  'favs.hint': string;
  'favs.empty.heading': string;
  'favs.empty.body': string;
  'favs.remove': string;
  // Info view
  'info.title': string;
  'info.platforms': string;
  'info.keyboard': string;
  'info.keyboardDesc': string;
  'info.links': string;
  'info.github': string;
  'info.issues': string;
  // Export
  'export.json': string;
  'export.csv': string;
  'export.pdf': string;
}

// ── English (default) ──────────────────────────────────────────────────────

const en: Strings = {
  'header.title': 'Prompt Navigator',
  'header.refresh': 'Refresh prompts',
  'header.settings': 'Settings',
  'header.themeToggle': 'Toggle theme',

  'count.prompts': (n) => `${n} prompt${n !== 1 ? 's' : ''}`,
  'count.filtered': (v, t) => `${v} / ${t}`,

  'search.placeholder': 'Search prompts…',
  'search.favToggleLabel': 'Show favorites only',

  'item.copy': 'Copy prompt',
  'item.copyDone': '✅',
  'item.favorite': 'Toggle favorite',
  'item.unfavorite': 'Remove from favorites',

  'empty.loading.heading': 'Loading…',
  'empty.loading.body': 'Scanning the conversation.',
  'empty.noPrompts.heading': 'No messages yet',
  'empty.noPrompts.body': 'Already chatting but nothing shows up?',
  'empty.noMatch.heading': 'No matches',
  'empty.noMatch.body': 'Try a different search term.',
  'empty.noFavs.body': 'No starred prompts yet. Tap ⭐ on a prompt to favorite it.',
  'empty.unsupported.heading': 'Site not supported',
  'empty.unsupported.body':
    'Prompt Navigator works on ChatGPT, Claude, Gemini, and more. Open a conversation there first.',
  'empty.error.heading': 'Something went wrong',
  'empty.error.body':
    'Could not read the page. Try refreshing the AI tab, then click the icon again.',
  'empty.report': '🐛 Report broken selectors',

  'footer.select': 'Select',
  'footer.selectDone': 'Done',
  'footer.export': '📤 Export',
  'footer.exportN': (n) => `📤 Export (${n})`,

  'settings.title': 'Settings',
  'settings.back': 'Back',
  'settings.theme.heading': 'Theme',
  'settings.theme.auto': 'Auto',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.kb.heading': 'Keyboard shortcuts',
  'settings.kb.desc':
    'Always-on: 1–9 jump to prompt, ↑↓ navigate list. When a prompt is focused:',
  'settings.kb.copy': 'Copy prompt',
  'settings.kb.favorite': 'Toggle favorite',
  'settings.float.heading': 'In-page panel',
  'settings.float.label': '🧭 Show floating navigator button',
  'settings.float.hint':
    'Adds a 🧭 button to supported AI pages. Click it to open a floating prompt list panel. Off by default.',
  'settings.favs.heading': 'Favorites',
  'settings.favs.manage': '⭐ Manage favorites & reorder',
  'settings.support.heading': 'Support',
  'settings.support.body': 'Found a bug or a site that\'s not working? Please',

  'favs.title': 'Favorites',
  'favs.hint': 'Drag ⠿ to reorder. Changes save instantly.',
  'favs.empty.heading': 'No favorites yet',
  'favs.empty.body': 'Star a prompt in the main list to add it here.',
  'favs.remove': 'Remove from favorites',

  'info.title': 'About',
  'info.platforms': 'Supported platforms',
  'info.keyboard': 'Keyboard',
  'info.keyboardDesc': 'Press Alt+P to open Prompt Navigator from anywhere. Customize at chrome://extensions/shortcuts.',
  'info.links': 'Links',
  'info.github': 'GitHub',
  'info.issues': 'Report an issue',

  'export.json': 'JSON',
  'export.csv': 'CSV',
  'export.pdf': 'PDF',
};

// ── Locale registry ────────────────────────────────────────────────────────

type LocaleCode = 'en';

const LOCALES: Record<LocaleCode, Strings> = { en };

// ── Locale detection ───────────────────────────────────────────────────────

function detectLocale(): LocaleCode {
  const lang = (navigator.language ?? 'en').split('-')[0].toLowerCase();
  return (lang in LOCALES ? lang : 'en') as LocaleCode;
}

const activeStrings: Strings = LOCALES[detectLocale()] ?? en;

// ── Public API ─────────────────────────────────────────────────────────────

/** Look up a string by key. For function-valued strings, pass args via the returned function. */
export function t<K extends keyof Strings>(
  key: K,
): Strings[K] {
  return (activeStrings[key] ?? en[key]) as Strings[K];
}
