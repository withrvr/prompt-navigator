// Settings view. Covers: theme preference, export format preference, reset.

import { getStoredTheme, setStoredTheme, applyTheme, themeLabel, type ThemePreference } from '../theme';

export function renderSettingsView(root: HTMLElement, onBack: () => void): void {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';
  header.innerHTML = `
    <div class="app__brand">
      <button class="app__btn app__btn--icon" id="back-btn" aria-label="Back" title="Back">←</button>
      <h1 class="app__title">Settings</h1>
    </div>
  `;
  header.querySelector('#back-btn')!.addEventListener('click', onBack);

  const body = document.createElement('section');
  body.className = 'app__body settings-body';

  // ── Theme ──────────────────────────────────────────────────────────────
  const themeSection = document.createElement('div');
  themeSection.className = 'settings-section';
  themeSection.innerHTML = `<h2 class="settings-section__title">Theme</h2>`;

  const themes: ThemePreference[] = ['auto', 'light', 'dark'];
  const themeGroup = document.createElement('div');
  themeGroup.className = 'settings-radio-group';

  const currentTheme = getStoredTheme();
  for (const t of themes) {
    const label = document.createElement('label');
    label.className = 'settings-radio';
    label.innerHTML = `
      <input type="radio" name="theme" value="${t}" ${t === currentTheme ? 'checked' : ''} />
      <span class="settings-radio__label">${themeLabel(t)} ${t.charAt(0).toUpperCase() + t.slice(1)}</span>
    `;
    label.querySelector('input')!.addEventListener('change', () => {
      setStoredTheme(t);
      applyTheme(t);
    });
    themeGroup.appendChild(label);
  }

  themeSection.appendChild(themeGroup);

  // ── Support ────────────────────────────────────────────────────────────
  const supportSection = document.createElement('div');
  supportSection.className = 'settings-section';
  supportSection.innerHTML = `
    <h2 class="settings-section__title">Support</h2>
    <p class="settings-section__body">
      Found a bug or a site that's not working? Please
      <a class="settings-link" href="https://github.com/withrvr/prompt-navigator/issues" target="_blank" rel="noopener noreferrer">open an issue on GitHub</a>.
    </p>
  `;

  body.appendChild(themeSection);
  body.appendChild(supportSection);
  root.appendChild(header);
  root.appendChild(body);
}
