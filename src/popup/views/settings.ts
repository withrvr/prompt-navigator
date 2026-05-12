// Settings view. Theme, floating button, support.

import { getStoredTheme, setStoredTheme, applyTheme, themeLabel, type ThemePreference } from '../theme';
import { getSettings, saveSettings } from '@/shared/storage';

export function renderSettingsView(
  root: HTMLElement,
  onBack: () => void,
): void {
  void renderSettingsAsync(root, onBack);
}

async function renderSettingsAsync(
  root: HTMLElement,
  onBack: () => void,
): Promise<void> {
  const settings = await getSettings();
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

  // ── Floating button ────────────────────────────────────────────────────
  const floatSection = document.createElement('div');
  floatSection.className = 'settings-section';
  floatSection.innerHTML = `
    <h2 class="settings-section__title">In-page panel</h2>
  `;

  const floatLabel = document.createElement('label');
  floatLabel.className = 'settings-toggle';
  floatLabel.innerHTML = `
    <input type="checkbox" class="settings-toggle__input" ${settings.floatingButton ? 'checked' : ''} />
    <span class="settings-toggle__label">🧭 Show floating navigator button</span>
  `;
  floatLabel.querySelector('input')!.addEventListener('change', (e) => {
    const checked = (e.target as HTMLInputElement).checked;
    void saveSettings({ floatingButton: checked });
  });

  const floatHint = document.createElement('p');
  floatHint.className = 'settings-section__body';
  floatHint.textContent =
    'Adds a 🧭 button to supported AI pages. Click it to open a floating prompt list panel. Off by default.';

  floatSection.appendChild(floatLabel);
  floatSection.appendChild(floatHint);

  // ── Keyboard shortcuts (read-only info) ────────────────────────────────
  const kbSection = document.createElement('div');
  kbSection.className = 'settings-section';
  kbSection.innerHTML = `
    <h2 class="settings-section__title">Keyboard shortcuts</h2>
    <p class="settings-section__body">
      <kbd>1</kbd>–<kbd>9</kbd> jump to prompt &nbsp;·&nbsp;
      <kbd>↑</kbd><kbd>↓</kbd> navigate list &nbsp;·&nbsp;
      <kbd>Enter</kbd> open prompt
    </p>
  `;

  // ── Support ────────────────────────────────────────────────────────────
  const supportSection = document.createElement('div');
  supportSection.className = 'settings-section';
  supportSection.innerHTML = `
    <h2 class="settings-section__title">Support</h2>
    <p class="settings-section__body">
      Found a bug or a site not working?
      <a class="settings-link" href="https://github.com/withrvr/prompt-navigator/issues" target="_blank" rel="noopener noreferrer">Open an issue on GitHub</a>.
    </p>
  `;

  body.appendChild(themeSection);
  body.appendChild(floatSection);
  body.appendChild(kbSection);
  body.appendChild(supportSection);
  root.appendChild(header);
  root.appendChild(body);
}
