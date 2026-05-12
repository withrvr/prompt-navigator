// Header component. Brand row + prompt count + refresh + settings.
// Theme toggle lives in the settings view only.

export interface HeaderOptions {
  count?: number;
  onRefresh?: () => void;
  onSettings?: () => void;
  onRecent?: () => void;
  onFavorites?: () => void;
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

  if (opts.onRecent) {
    const recentBtn = document.createElement('button');
    recentBtn.className = 'app__btn app__btn--icon';
    recentBtn.setAttribute('aria-label', 'Recent prompts');
    recentBtn.setAttribute('title', 'Recent');
    recentBtn.textContent = '🕐';
    recentBtn.addEventListener('click', opts.onRecent);
    actions.appendChild(recentBtn);
  }

  if (opts.onFavorites) {
    const favBtn = document.createElement('button');
    favBtn.className = 'app__btn app__btn--icon';
    favBtn.setAttribute('aria-label', 'Favourites');
    favBtn.setAttribute('title', 'Favourites');
    favBtn.textContent = '⭐';
    favBtn.addEventListener('click', opts.onFavorites);
    actions.appendChild(favBtn);
  }

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
  return `${visible} / ${total}`;
}
