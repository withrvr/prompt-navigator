// Header component. Brand row + prompt count. Phase 6 adds refresh button.

export interface HeaderOptions {
  count?: number;
}

/** Renders the header bar inside `container` and returns it for later updates. */
export function renderHeader(container: HTMLElement, opts: HeaderOptions = {}): HTMLElement {
  container.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';

  header.innerHTML = `
    <div class="app__brand">
      <span class="app__logo" aria-hidden="true">🧭</span>
      <h1 class="app__title">Prompt Navigator</h1>
    </div>
    <span class="app__count" aria-live="polite">
      ${opts.count !== undefined ? `${opts.count} prompt${opts.count !== 1 ? 's' : ''}` : ''}
    </span>
  `;

  container.appendChild(header);
  return header;
}

/** Update just the count badge without re-rendering the whole header. */
export function updateHeaderCount(header: HTMLElement, count: number): void {
  const el = header.querySelector<HTMLElement>('.app__count');
  if (el) el.textContent = `${count} prompt${count !== 1 ? 's' : ''}`;
}
