// Popup entry point. Bootstraps the view router inside `#app`.
//
// Views: main (default) ↔ settings ↔ info.
// Navigation is in-process (no URL changes); each view replaces #app content.

import { applyStoredTheme } from './theme';
import { renderMainView } from './views/main';
import { renderSettingsView } from './views/settings';
import { renderInfoView } from './views/info';
import { renderFavoritesView } from './views/favorites';

export type ViewName = 'main' | 'settings' | 'info' | 'favorites';

let root: HTMLElement;

export function navigate(view: ViewName): void {
  root.innerHTML = '';
  document.body.classList.toggle('pn-list-view', view === 'main' || view === 'favorites');
  switch (view) {
    case 'main':
      void renderMainView(root, navigate);
      break;
    case 'settings':
      renderSettingsView(root, () => navigate('main'), navigate);
      break;
    case 'info':
      renderInfoView(root, () => navigate('main'));
      break;
    case 'favorites':
      void renderFavoritesView(root, () => navigate('main'));
      break;
  }
}

function mount(): void {
  const el = document.getElementById('app');
  if (!el) throw new Error('Popup root #app not found');
  root = el;
  applyStoredTheme();
  navigate('main');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
