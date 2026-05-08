// Footer component. Export menu (JSON / CSV / PDF) + bulk-select toggle + scroll helpers.

import type { Prompt } from '@/shared/types';
import { exportJson } from '@/shared/exporters/json';
import { exportCsv } from '@/shared/exporters/csv';
import { exportPdf } from '@/shared/exporters/pdf';

export interface FooterOptions {
  prompts: Prompt[];
  /** The currently-visible filtered subset — exported when no items are selected. */
  filteredPrompts?: Prompt[];
  platform: string;
  pageUrl?: string;
  favorites?: Set<string>;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onToggleSelectionMode: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  /** Reference to the scrollable body element for scroll-to-top/bottom. */
  bodyEl?: HTMLElement;
}

/** Renders the footer bar inside `container`. */
export function renderFooter(container: HTMLElement, opts: FooterOptions): void {
  const {
    prompts, filteredPrompts, platform, pageUrl, favorites,
    selectionMode, selectedIds, onToggleSelectionMode,
    onSelectAll, onDeselectAll, bodyEl,
  } = opts;
  container.innerHTML = '';

  const footer = document.createElement('footer');
  footer.className = 'app__footer';

  // ── Scroll helpers (top / bottom) ─────────────────────────────────────────
  const scrollGroup = document.createElement('div');
  scrollGroup.className = 'footer__scroll-group';

  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.className = 'app__btn app__btn--icon footer__scroll-btn';
  scrollTopBtn.textContent = '⬆';
  scrollTopBtn.title = 'Scroll to top';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.addEventListener('click', () => bodyEl?.scrollTo({ top: 0, behavior: 'smooth' }));

  const scrollBotBtn = document.createElement('button');
  scrollBotBtn.className = 'app__btn app__btn--icon footer__scroll-btn';
  scrollBotBtn.textContent = '⬇';
  scrollBotBtn.title = 'Scroll to bottom';
  scrollBotBtn.setAttribute('aria-label', 'Scroll to bottom');
  scrollBotBtn.addEventListener('click', () =>
    bodyEl?.scrollTo({ top: bodyEl.scrollHeight, behavior: 'smooth' }),
  );

  scrollGroup.appendChild(scrollTopBtn);
  scrollGroup.appendChild(scrollBotBtn);

  // ── Select / Done toggle ───────────────────────────────────────────────────
  const selectBtn = document.createElement('button');
  selectBtn.className = `app__btn app__btn--select${selectionMode ? ' app__btn--select-active' : ''}`;
  selectBtn.textContent = selectionMode ? 'Done' : 'Select';
  selectBtn.setAttribute('aria-pressed', String(selectionMode));
  selectBtn.setAttribute('title', selectionMode ? 'Exit selection mode' : 'Select prompts to export');
  selectBtn.addEventListener('click', onToggleSelectionMode);

  // ── Select-all / Deselect-all (only in selection mode) ────────────────────
  const selectAllGroup = document.createElement('div');
  selectAllGroup.className = 'footer__select-all-group';
  selectAllGroup.hidden = !selectionMode;

  if (selectionMode) {
    const allBtn = document.createElement('button');
    allBtn.className = 'app__btn footer__all-btn';
    allBtn.textContent = '✓ All';
    allBtn.title = 'Select all';
    allBtn.addEventListener('click', () => onSelectAll?.());

    const noneBtn = document.createElement('button');
    noneBtn.className = 'app__btn footer__all-btn';
    noneBtn.textContent = '✕ None';
    noneBtn.title = 'Deselect all';
    noneBtn.addEventListener('click', () => onDeselectAll?.());

    selectAllGroup.appendChild(allBtn);
    selectAllGroup.appendChild(noneBtn);
  }

  // ── Determine which prompts to export ─────────────────────────────────────
  // Priority: hand-selected > filtered > all
  const visible = filteredPrompts ?? prompts;
  const exportList =
    selectionMode && selectedIds.size > 0
      ? prompts.filter((p) => selectedIds.has(p.id))
      : visible;
  const exportLabel =
    selectionMode && selectedIds.size > 0
      ? `📤 Export (${selectedIds.size})`
      : exportList.length < prompts.length
        ? `📤 Export (${exportList.length})`
        : '📤 Export';

  const exportContext = { platform, pageUrl, favorites };

  const exportBtn = document.createElement('button');
  exportBtn.className = 'app__btn app__btn--export';
  exportBtn.setAttribute('aria-haspopup', 'true');
  exportBtn.setAttribute('aria-expanded', 'false');
  exportBtn.textContent = exportLabel;

  const menu = document.createElement('ul');
  menu.className = 'export-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');

  // ── Export menu open/close (self-contained, no global capture leaks) ───────
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
      if (!footer.contains(e.target as Node)) closeMenu();
    };
    // Defer so the current click doesn't immediately close the menu.
    setTimeout(() => document.addEventListener('click', outsideListener!), 0);
  };

  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!menu.hidden) closeMenu();
    else openMenu();
  });

  const formats: Array<{ label: string; action: () => void }> = [
    { label: '📄 JSON', action: () => exportJson(exportList, exportContext) },
    { label: '📊 CSV',  action: () => exportCsv(exportList, exportContext) },
    { label: '🖨️ PDF',  action: () => exportPdf(exportList, exportContext) },
  ];

  for (const fmt of formats) {
    const li = document.createElement('li');
    li.setAttribute('role', 'menuitem');
    li.className = 'export-menu__item';
    li.textContent = fmt.label;
    li.addEventListener('click', () => {
      fmt.action();
      closeMenu();
    });
    menu.appendChild(li);
  }

  footer.appendChild(scrollGroup);
  footer.appendChild(selectBtn);
  footer.appendChild(selectAllGroup);
  footer.appendChild(exportBtn);
  footer.appendChild(menu);
  container.appendChild(footer);
}
