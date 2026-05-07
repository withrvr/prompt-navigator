// Header component. Brand row + prompt count + theme toggle + refresh + settings.

import { cycleTheme, getStoredTheme, themeLabel } from '../theme';

export interface HeaderOptions {
  count?: number;
  onRefresh?: () => void;
  onSettings?: () => void;
}

/** Renders the header bar inside `container` and returns it for later updates. */
export function renderHeader(container: HTMLElement, opts: HeaderOptions = {}): HTMLElement {
  container.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';

  const brand = document.createElement('div');
  brand.className = 'app__brand';
  brand.innerHTML = `
    <span class="app__logo" aria-hidden="true">🧭</span>
    <h1 class="app__title">Prompt Navigator</h1>
  `;

  const actions = document.createElement('div');
  actions.className = 'app__actions';

  const countEl = document.createElement('span');
  countEl.className = 'app__count';
  countEl.setAttribute('aria-live', 'polite');
  if (opts.count !== undefined) {
    countEl.textContent = formatCount(opts.count, opts.count);
  }
  actions.appendChild(countEl);

  // Theme toggle
  const themeBtn = document.createElement('button');
  themeBtn.className = 'app__btn app__btn--icon';
  themeBtn.setAttribute('title', 'Toggle theme');
  themeBtn.setAttribute('aria-label', 'Toggle theme');
  themeBtn.textContent = themeLabel(getStoredTheme());
  themeBtn.addEventListener('click', () => {
    const next = cycleTheme();
    themeBtn.textContent = themeLabel(next);
  });
  actions.appendChild(themeBtn);

  if (opts.onRefresh) {
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'app__btn app__btn--icon';
    refreshBtn.setAttribute('aria-label', 'Refresh prompts');
    refreshBtn.setAttribute('title', 'Refresh');
    refreshBtn.textContent = '🔄';
    refreshBtn.addEventListener('click', opts.onRefresh);
    actions.appendChild(refreshBtn);
  }

  if (opts.onSettings) {
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'app__btn app__btn--icon';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.setAttribute('title', 'Settings');
    settingsBtn.textContent = '⚙️';
    settingsBtn.addEventListener('click', opts.onSettings);
    actions.appendChild(settingsBtn);
  }

  header.appendChild(brand);
  header.appendChild(actions);
  container.appendChild(header);
  return header;
}

/** Update the count display without re-rendering the whole header. */
export function updateHeaderCount(
  header: HTMLElement,
  visibleCount: number,
  totalCount: number,
): void {
  const el = header.querySelector<HTMLElement>('.app__count');
  if (el) el.textContent = formatCount(visibleCount, totalCount);
}

function formatCount(visible: number, total: number): string {
  if (visible === total) return `${total} prompt${total !== 1 ? 's' : ''}`;
  return `${visible} / ${total}`;
}
