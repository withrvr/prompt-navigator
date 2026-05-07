// Empty-state component. Renders when the popup has nothing useful to list.
// Covers every non-happy path so the user always has an explanation + next step.
// All strings run through t() so locale overrides work automatically.

import { t } from '@/shared/i18n';

export type EmptyReason =
  | 'unsupported'
  | 'no-prompts'
  | 'loading'
  | 'error'
  | 'no-match';

interface EmptyStateOptions {
  reason: EmptyReason;
  detail?: string;
  /** If set, shows a "Report broken selectors" link (used for the no-prompts state on known platforms). */
  reportUrl?: string;
}

type CopyCfg = { icon: string; heading: string; body: string };

function getCopy(reason: EmptyReason): CopyCfg {
  switch (reason) {
    case 'loading':
      return { icon: '⏳', heading: t('empty.loading.heading'), body: t('empty.loading.body') };
    case 'no-prompts':
      return { icon: '💬', heading: t('empty.noPrompts.heading'), body: t('empty.noPrompts.body') };
    case 'no-match':
      return { icon: '🔍', heading: t('empty.noMatch.heading'), body: t('empty.noMatch.body') };
    case 'unsupported':
      return { icon: '🌐', heading: t('empty.unsupported.heading'), body: t('empty.unsupported.body') };
    case 'error':
      return { icon: '⚠️', heading: t('empty.error.heading'), body: t('empty.error.body') };
  }
}

/** Builds a pre-filled GitHub issue URL for a broken-selector report. */
export function buildReportUrl(platform: string, pageUrl: string): string {
  const title = `Broken selectors: ${platform}`;
  const body = [
    `**Platform:** ${platform}`,
    `**Page URL:** ${pageUrl}`,
    '',
    '**Describe the problem:**',
    'Prompt Navigator shows "No messages yet" even though the conversation has messages.',
    '',
    '**Steps to reproduce:**',
    '1. Open the conversation linked above',
    '2. Click the Prompt Navigator icon',
    '3. The prompt list is empty',
  ].join('\n');
  return (
    'https://github.com/withrvr/prompt-navigator/issues/new?' +
    `title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
  );
}

/** Renders an informative empty state into `container`, replacing its content. */
export function renderEmptyState(container: HTMLElement, opts: EmptyStateOptions): void {
  const { icon, heading, body } = getCopy(opts.reason);

  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <span class="empty-state__icon" aria-hidden="true">${icon}</span>
    <h2 class="empty-state__heading">${escapeHtml(heading)}</h2>
    <p class="empty-state__body">${escapeHtml(opts.detail ?? body)}</p>
  `;

  if (opts.reportUrl) {
    const link = document.createElement('a');
    link.className = 'settings-link empty-state__report';
    link.href = opts.reportUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('empty.report');
    el.appendChild(link);
  }

  container.innerHTML = '';
  container.appendChild(el);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
