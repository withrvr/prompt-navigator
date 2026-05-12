// Favorites management view.
// Full-featured: drag-to-reorder, search/filter, select mode, export.

import { getFavoritesOrdered, saveFavoritesOrdered, toggleFavorite } from '@/shared/storage';
import { createSearchBar } from '../components/SearchBar';
import { exportJson } from '@/shared/exporters/json';
import { exportCsv } from '@/shared/exporters/csv';
import { exportPdf } from '@/shared/exporters/pdf';
import type { Prompt } from '@/shared/types';

const COPY_FEEDBACK_MS = 1200;

export async function renderFavoritesView(root: HTMLElement, onBack: () => void): Promise<void> {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';
  header.innerHTML = `
    <div class="app__brand">
      <button class="app__btn app__btn--icon" id="back-btn" aria-label="Back" title="Back">←</button>
      <h1 class="app__title">Favorites</h1>
    </div>
    <div class="app__actions">
      <span class="app__count" id="fav-count"></span>
    </div>
  `;
  header.querySelector('#back-btn')!.addEventListener('click', onBack);
  const countEl = header.querySelector<HTMLElement>('#fav-count')!;

  const searchContainer = document.createElement('div');
  searchContainer.className = 'app__search';

  const body = document.createElement('section');
  body.className = 'app__body';

  const footerContainer = document.createElement('div');

  root.appendChild(header);
  root.appendChild(searchContainer);
  root.appendChild(body);
  root.appendChild(footerContainer);

  const ordered = await getFavoritesOrdered();

  if (ordered.length === 0) {
    searchContainer.hidden = true;
    body.innerHTML = `
      <div class="empty-state">
        <span class="empty-state__icon" aria-hidden="true">⭐</span>
        <h2 class="empty-state__heading">No favorites yet</h2>
        <p class="empty-state__body">Star a prompt in the main list to add it here.</p>
      </div>
    `;
    return;
  }

  // ── View state ─────────────────────────────────────────────────────────────
  let currentQuery = '';
  let selectionMode = false;
  const selectedTexts = new Set<string>();

  // Convert favorites to pseudo-Prompt objects for filter/export compatibility
  const toPrompts = (texts: string[]): Prompt[] =>
    texts.map((text, index) => ({
      id: `fav-${index}`,
      index,
      text,
      length: text.length,
    }));

  // ── Search bar ─────────────────────────────────────────────────────────────
  const searchBar = createSearchBar({
    placeholder: 'Search favorites…',
    onSearch: (q) => {
      currentQuery = q;
      rebuildList();
    },
  });
  searchContainer.appendChild(searchBar);

  // ── Footer ─────────────────────────────────────────────────────────────────
  // Mirrors the structure of Footer.ts so layout and behaviour are consistent:
  //   leftGroup  → scroll buttons + Select/Done + All/None (always in DOM)
  //   rightGroup → Export button + dropdown menu (position:relative for menu)
  const renderFooter = (): void => {
    footerContainer.innerHTML = '';
    const footer = document.createElement('footer');
    footer.className = 'app__footer';

    // ── Left group ───────────────────────────────────────────────────────────
    const leftGroup = document.createElement('div');
    leftGroup.className = 'footer__left';

    const scrollGroup = document.createElement('div');
    scrollGroup.className = 'footer__scroll-group';

    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'app__btn app__btn--icon footer__scroll-btn';
    scrollTopBtn.textContent = '⬆';
    scrollTopBtn.title = 'Scroll to top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.addEventListener('click', () => body.scrollTo({ top: 0, behavior: 'smooth' }));

    const scrollBotBtn = document.createElement('button');
    scrollBotBtn.className = 'app__btn app__btn--icon footer__scroll-btn';
    scrollBotBtn.textContent = '⬇';
    scrollBotBtn.title = 'Scroll to bottom';
    scrollBotBtn.setAttribute('aria-label', 'Scroll to bottom');
    scrollBotBtn.addEventListener('click', () =>
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' }),
    );
    scrollGroup.appendChild(scrollTopBtn);
    scrollGroup.appendChild(scrollBotBtn);

    const selectBtn = document.createElement('button');
    selectBtn.className = `app__btn app__btn--select${selectionMode ? ' app__btn--select-active' : ''}`;
    selectBtn.textContent = selectionMode ? 'Done' : 'Select';
    selectBtn.setAttribute('aria-pressed', String(selectionMode));
    selectBtn.setAttribute('title', selectionMode ? 'Exit selection mode' : 'Select favorites to export');
    selectBtn.addEventListener('click', () => {
      selectionMode = !selectionMode;
      if (!selectionMode) selectedTexts.clear();
      rebuildList();
      renderFooter();
    });

    // Always in the DOM — visibility toggled so layout never shifts (same as Footer.ts)
    const selectAllGroup = document.createElement('div');
    selectAllGroup.className =
      'footer__select-all-group' + (selectionMode ? ' footer__select-all-group--visible' : '');
    selectAllGroup.setAttribute('aria-hidden', String(!selectionMode));

    const allBtn = document.createElement('button');
    allBtn.className = 'app__btn footer__all-btn';
    allBtn.textContent = '✓ All';
    allBtn.title = 'Select all';
    allBtn.addEventListener('click', () => {
      filteredTexts().forEach((t) => selectedTexts.add(t));
      rebuildList();
      renderFooter();
    });
    const noneBtn = document.createElement('button');
    noneBtn.className = 'app__btn footer__all-btn';
    noneBtn.textContent = '✕ None';
    noneBtn.title = 'Deselect all';
    noneBtn.addEventListener('click', () => {
      selectedTexts.clear();
      rebuildList();
      renderFooter();
    });
    selectAllGroup.appendChild(allBtn);
    selectAllGroup.appendChild(noneBtn);

    leftGroup.appendChild(scrollGroup);
    leftGroup.appendChild(selectBtn);
    leftGroup.appendChild(selectAllGroup);

    // ── Right group (position:relative so export menu anchors correctly) ─────
    const rightGroup = document.createElement('div');
    rightGroup.className = 'footer__right';

    const visible = filteredTexts();
    const exportTexts =
      selectionMode && selectedTexts.size > 0 ? [...selectedTexts] : visible;
    const exportLabel =
      selectionMode && selectedTexts.size > 0
        ? `📤 Export (${selectedTexts.size})`
        : exportTexts.length < ordered.length
          ? `📤 Export (${exportTexts.length})`
          : '📤 Export';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'app__btn app__btn--export';
    exportBtn.textContent = exportLabel;
    exportBtn.setAttribute('aria-haspopup', 'true');
    exportBtn.setAttribute('aria-expanded', 'false');

    const menu = document.createElement('ul');
    menu.className = 'export-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'menu');

    let outsideListener: ((e: MouseEvent) => void) | null = null;
    const closeMenu = (): void => {
      menu.hidden = true;
      exportBtn.setAttribute('aria-expanded', 'false');
      if (outsideListener) {
        document.removeEventListener('click', outsideListener);
        outsideListener = null;
      }
    };
    const openMenu = (): void => {
      menu.hidden = false;
      exportBtn.setAttribute('aria-expanded', 'true');
      outsideListener = (e: MouseEvent) => {
        if (!rightGroup.contains(e.target as Node)) closeMenu();
      };
      setTimeout(() => document.addEventListener('click', outsideListener!), 0);
    };
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!menu.hidden) closeMenu();
      else openMenu();
    });

    const prompts = toPrompts(exportTexts);
    const favSet = new Set(ordered);
    const ctx = { platform: 'favorites', favorites: favSet };

    const formats: Array<{ label: string; action: () => void }> = [
      { label: '📄 JSON', action: () => exportJson(prompts, ctx) },
      { label: '📊 CSV',  action: () => exportCsv(prompts, ctx) },
      { label: '🖨️ PDF',  action: () => exportPdf(prompts, ctx) },
    ];
    for (const fmt of formats) {
      const li = document.createElement('li');
      li.setAttribute('role', 'menuitem');
      li.className = 'export-menu__item';
      li.textContent = fmt.label;
      li.addEventListener('click', () => { fmt.action(); closeMenu(); });
      menu.appendChild(li);
    }

    rightGroup.appendChild(exportBtn);
    rightGroup.appendChild(menu);

    footer.appendChild(leftGroup);
    footer.appendChild(rightGroup);
    footerContainer.appendChild(footer);
  };

  // ── Drag state ─────────────────────────────────────────────────────────────
  let dragSrcIdx: number | null = null;

  const filteredTexts = (): string[] => {
    if (!currentQuery.trim()) return [...ordered];
    const lower = currentQuery.toLowerCase();
    return ordered.filter((t) => t.toLowerCase().includes(lower));
  };

  const rebuildList = (): void => {
    body.innerHTML = '';

    const visible = filteredTexts();
    countEl.textContent = `${visible.length} / ${ordered.length}`;

    if (visible.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon" aria-hidden="true">🔍</span>
          <h2 class="empty-state__heading">No matches</h2>
          <p class="empty-state__body">No favorites match your search.</p>
        </div>
      `;
      return;
    }

    const hint = document.createElement('p');
    hint.className = 'fav-hint';
    hint.textContent = selectionMode
      ? 'Select favorites to export.'
      : 'Drag ⠿ to reorder. Changes save instantly.';
    body.appendChild(hint);

    const ul = document.createElement('ul');
    ul.className = 'fav-list';
    body.appendChild(ul);

    for (let i = 0; i < visible.length; i++) {
      ul.appendChild(buildItem(visible[i]));
    }
  };

  const buildItem = (text: string): HTMLLIElement => {
    const realIdx = ordered.indexOf(text);
    const li = document.createElement('li');
    li.className = 'fav-item';
    if (!selectionMode) li.draggable = true;
    li.dataset['idx'] = String(realIdx);

    // Checkbox (select mode only)
    if (selectionMode) {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'prompt-item__checkbox';
      cb.checked = selectedTexts.has(text);
      cb.addEventListener('change', () => {
        if (cb.checked) selectedTexts.add(text);
        else selectedTexts.delete(text);
        renderFooter();
      });
      li.appendChild(cb);
    }

    const handle = document.createElement('span');
    handle.className = 'fav-item__handle';
    handle.setAttribute('aria-hidden', 'true');
    handle.textContent = '⠿';
    handle.title = 'Drag to reorder';
    if (selectionMode) handle.style.opacity = '0.3';

    const textSpan = document.createElement('span');
    textSpan.className = 'fav-item__text';
    textSpan.textContent = text.length > 120 ? text.slice(0, 120).trimEnd() + '…' : text;
    textSpan.title = text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'fav-item__actions';

    const copyBtn = buildIconBtn('📋', 'Copy');
    copyBtn.addEventListener('click', () => {
      void navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => (copyBtn.textContent = '📋'), COPY_FEEDBACK_MS);
      });
    });

    const removeBtn = buildIconBtn('⭐', 'Remove from favorites');
    removeBtn.addEventListener('click', async () => {
      await toggleFavorite(text);
      ordered.splice(realIdx, 1);
      selectedTexts.delete(text);
      rebuildList();
      renderFooter();
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(removeBtn);
    li.appendChild(handle);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    // ── Drag-and-drop (disabled in select mode) ────────────────────────────
    if (!selectionMode) {
      li.addEventListener('dragstart', (e) => {
        dragSrcIdx = realIdx;
        li.classList.add('fav-item--dragging');
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', String(realIdx));
        }
      });

      li.addEventListener('dragend', () => {
        li.classList.remove('fav-item--dragging');
        li.closest('ul')?.querySelectorAll('.fav-item--over').forEach((node) => (node as HTMLElement).classList.remove('fav-item--over'));
      });

      li.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
        li.closest('ul')?.querySelectorAll('.fav-item--over').forEach((el) => el.classList.remove('fav-item--over'));
        li.classList.add('fav-item--over');
      });

      li.addEventListener('dragleave', () => li.classList.remove('fav-item--over'));

      li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('fav-item--over');
        if (dragSrcIdx === null || dragSrcIdx === realIdx) return;
        const [moved] = ordered.splice(dragSrcIdx, 1);
        ordered.splice(realIdx, 0, moved);
        dragSrcIdx = null;
        void saveFavoritesOrdered([...ordered]);
        rebuildList();
      });
    }

    return li;
  };

  rebuildList();
  renderFooter();
}

function buildIconBtn(icon: string, label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'prompt-item__btn';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
  btn.textContent = icon;
  return btn;
}
