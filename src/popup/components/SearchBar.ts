// SearchBar component. Live-filters the prompt list as the user types.

export interface SearchBarOptions {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/** Creates and returns the search bar element. */
export function createSearchBar(opts: SearchBarOptions): HTMLElement {
  const { onSearch, placeholder = 'Search prompts…' } = opts;

  const wrapper = document.createElement('div');
  wrapper.className = 'search-bar';

  const icon = document.createElement('span');
  icon.className = 'search-bar__icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '🔍';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'search-bar__input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', 'Search prompts');
  input.autocomplete = 'off';
  input.spellcheck = false;

  input.addEventListener('input', () => onSearch(input.value));

  // Clear on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      onSearch('');
    }
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(input);

  return wrapper;
}

/** Filter prompts by query. Case-insensitive substring match. */
export function filterPrompts<T extends { text: string }>(prompts: T[], query: string): T[] {
  if (!query.trim()) return prompts;
  const lower = query.toLowerCase();
  return prompts.filter((p) => p.text.toLowerCase().includes(lower));
}
