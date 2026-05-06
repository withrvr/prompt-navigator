// Popup entry point. Bootstraps the main view inside `#app`.
//
// Phase 1 scope: render a placeholder header + empty body so we can verify
// the build, the popup loads, and the theme tokens are wired. Subsequent
// phases (2+) replace the body with the live prompt list.

import { applyStoredTheme } from './theme';
import { renderMainView } from './views/main';

function mount(): void {
  const root = document.getElementById('app');
  if (!root) throw new Error('Popup root #app not found');
  applyStoredTheme();
  renderMainView(root);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
