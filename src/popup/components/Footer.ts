// Footer component. Export menu (JSON / CSV / PDF) + optional status text.

import type { Prompt } from '@/shared/types';
import { exportJson } from '@/shared/exporters/json';
import { exportCsv } from '@/shared/exporters/csv';
import { exportPdf } from '@/shared/exporters/pdf';

export interface FooterOptions {
  prompts: Prompt[];
  platform: string;
}

/** Renders the footer bar inside `container`. */
export function renderFooter(container: HTMLElement, opts: FooterOptions): void {
  container.innerHTML = '';

  const footer = document.createElement('footer');
  footer.className = 'app__footer';

  const exportBtn = document.createElement('button');
  exportBtn.className = 'app__btn app__btn--export';
  exportBtn.setAttribute('aria-haspopup', 'true');
  exportBtn.setAttribute('aria-expanded', 'false');
  exportBtn.textContent = '📤 Export';

  const menu = document.createElement('ul');
  menu.className = 'export-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');

  const formats: Array<{ label: string; action: () => void }> = [
    { label: 'JSON', action: () => exportJson(opts.prompts) },
    { label: 'CSV', action: () => exportCsv(opts.prompts) },
    {
      label: 'PDF',
      action: () => exportPdf(opts.prompts, `${opts.platform} prompts`),
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

  // Toggle menu open/close
  exportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    exportBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when clicking outside
  document.addEventListener(
    'click',
    () => {
      menu.hidden = true;
      exportBtn.setAttribute('aria-expanded', 'false');
    },
    { capture: true, passive: true },
  );

  footer.appendChild(exportBtn);
  footer.appendChild(menu);
  container.appendChild(footer);
}
