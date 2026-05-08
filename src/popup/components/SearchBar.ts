// SearchBar component. Live-filters the prompt list, with an optional
// "favorites-only" toggle next to the input.

export interface SearchBarOptions {
  onSearch: (query: string) => void;
  onToggleFavorites?: (active: boolean) => void;
  initialFavoritesActive?: boolean;
  placeholder?: string;
}

/** Creates and returns the search bar element. */
export function createSearchBar(opts: SearchBarOptions): HTMLElement {
  const { onSearch, onToggleFavorites, placeholder = 'Search prompts…' } = opts;

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

  // Clear button — shown only when the input has text
  const clearBtn = document.createElement('button');
  clearBtn.className = 'search-bar__clear';
  clearBtn.setAttribute('aria-label', 'Clear search');
  clearBtn.setAttribute('title', 'Clear search');
  clearBtn.textContent = '✕';
  clearBtn.hidden = true;

  const syncClear = (): void => {
    clearBtn.hidden = input.value.length === 0;
  };

  clearBtn.addEventListener('click', () => {
    input.value = '';
    onSearch('');
    syncClear();
    input.focus();
  });

  input.addEventListener('input', () => {
    onSearch(input.value);
    syncClear();
  });

  // Clear on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      input.value = '';
      onSearch('');
      syncClear();
    }
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(input);
  wrapper.appendChild(clearBtn);

  // Favorites-only toggle
  if (onToggleFavorites) {
    let active = opts.initialFavoritesActive ?? false;
    const favBtn = document.createElement('button');
    favBtn.className = 'search-bar__fav';
    favBtn.setAttribute('aria-label', 'Show favorites only');
    favBtn.setAttribute('aria-pressed', String(active));
    favBtn.setAttribute('title', 'Show favorites only');
    const updateIcon = () => {
      favBtn.textContent = active ? '⭐' : '☆';
      favBtn.classList.toggle('search-bar__fav--active', active);
      favBtn.setAttribute('aria-pressed', String(active));
    };
    updateIcon();
    favBtn.addEventListener('click', () => {
      active = !active;
      updateIcon();
      onToggleFavorites(active);
    });
    wrapper.appendChild(favBtn);
  }

  return wrapper;
}

/** Filter prompts by query. Case-insensitive substring match. */
export function filterPrompts<T extends { text: string }>(prompts: T[], query: string): T[] {
  if (!query.trim()) return prompts;
  const lower = query.toLowerCase();
  return prompts.filter((p) => p.text.toLowerCase().includes(lower));
}

/** Keep only prompts whose text is in the favorites set. */
export function filterFavorites<T extends { text: string }>(
  prompts: T[],
  favorites: Set<string>,
): T[] {
  return prompts.filter((p) => favorites.has(p.text));
}
