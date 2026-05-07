// Footer component. Export menu (JSON / CSV / PDF) + bulk-select toggle.

import type { Prompt } from '@/shared/types';
import { exportJson } from '@/shared/exporters/json';
import { exportCsv } from '@/shared/exporters/csv';
import { exportPdf } from '@/shared/exporters/pdf';

export interface FooterOptions {
  prompts: Prompt[];
  platform: string;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onToggleSelectionMode: () => void;
}

/** Renders the footer bar inside `container`. */
export function renderFooter(container: HTMLElement, opts: FooterOptions): void {
  const { prompts, platform, selectionMode, selectedIds, onToggleSelectionMode } = opts;
  container.innerHTML = '';

  const footer = document.createElement('footer');
  footer.className = 'app__footer';

  // Select / Done toggle button
  const selectBtn = document.createElement('button');
  selectBtn.className = `app__btn app__btn--select${selectionMode ? ' app__btn--select-active' : ''}`;
  selectBtn.textContent = selectionMode ? 'Done' : 'Select';
  selectBtn.setAttribute('aria-pressed', String(selectionMode));
  selectBtn.setAttribute('title', selectionMode ? 'Exit selection mode' : 'Select prompts to export');
  selectBtn.addEventListener('click', onToggleSelectionMode);

  // Determine which prompts to export
  const selectedList = selectionMode && selectedIds.size > 0
    ? prompts.filter((p) => selectedIds.has(p.id))
    : prompts;
  const exportLabel = selectionMode && selectedIds.size > 0
    ? `📤 Export (${selectedIds.size})`
    : '📤 Export';

  const exportBtn = document.createElement('button');
  exportBtn.className = 'app__btn app__btn--export';
  exportBtn.setAttribute('aria-haspopup', 'true');
  exportBtn.setAttribute('aria-expanded', 'false');
  exportBtn.textContent = exportLabel;

  const menu = document.createElement('ul');
  menu.className = 'export-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');

  const formats: Array<{ label: string; action: () => void }> = [
    { label: 'JSON', action: () => exportJson(selectedList) },
    { label: 'CSV', action: () => exportCsv(selectedList) },
    {
      label: 'PDF',
      action: () => exportPdf(selectedList, `${platform} prompts`),
    },
  ];

  for (const fmt of formats) {
    const li = document.createElement('li');
    li.setAttribute('role', 'menuitem');
    li.className = 'export-menu__item';
    li.textContent = fmt.label;
    li.addEventListener('click', () => {
      fmt.action();
      menu.hidden = true;
      exportBtn.setAttribute('aria-expanded', 'false');
    });
    menu.appendChild(li);
  }

  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    exportBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener(
    'click',
    () => {
      menu.hidden = true;
      exportBtn.setAttribute('aria-expanded', 'false');
    },
    { capture: true, passive: true },
  );

  footer.appendChild(selectBtn);
  footer.appendChild(exportBtn);
  footer.appendChild(menu);
  container.appendChild(footer);
}
