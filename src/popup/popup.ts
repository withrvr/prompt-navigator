// Popup entry point. Bootstraps the main view inside `#app`.

import { applyStoredTheme } from './theme';
import { renderMainView } from './views/main';

function mount(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('Popup root #app not found');
  applyStoredTheme();
  void renderMainView(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
