// Empty-state component. Renders when the popup has nothing useful to list.

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

export function renderEmptyState(container: HTMLElement, opts: EmptyStateOptions): void {
  const { icon, heading, body } = getCopy(opts.reason);

  const el = document.createElement('div');
  el.className = 'empty-state';
  el.innerHTML = `
    <span class="empty-state__icon" aria-hidden="true">${icon}</span>
    <h2 class="empty-state__heading">${escapeHtml(heading)}</h2>
    <p class="empty-state__body">${escapeHtml(opts.detail ?? body)}</p>
  `;

  // For unsupported sites: show an inline list of all supported platforms.
  if (opts.reason === 'unsupported') {
    const siteList = document.createElement('div');
    siteList.className = 'empty-state__site-list';
    siteList.innerHTML = `
      <p class="empty-state__site-list-heading">Supported sites</p>
      <ul class="empty-state__sites">
        <li><span class="empty-state__site-name">ChatGPT</span><span class="empty-state__site-url">chatgpt.com</span></li>
        <li><span class="empty-state__site-name">Claude</span><span class="empty-state__site-url">claude.ai</span></li>
        <li><span class="empty-state__site-name">Gemini</span><span class="empty-state__site-url">gemini.google.com</span></li>
        <li><span class="empty-state__site-name">Perplexity</span><span class="empty-state__site-url">perplexity.ai</span></li>
        <li><span class="empty-state__site-name">Grok</span><span class="empty-state__site-url">grok.com · x.com/i/grok</span></li>
        <li><span class="empty-state__site-name">DeepSeek</span><span class="empty-state__site-url">chat.deepseek.com</span></li>
        <li><span class="empty-state__site-name">Mistral</span><span class="empty-state__site-url">chat.mistral.ai</span></li>
        <li><span class="empty-state__site-name">Kimi</span><span class="empty-state__site-url">kimi.com</span></li>
        <li><span class="empty-state__site-name">Meta AI</span><span class="empty-state__site-url">meta.ai</span></li>
      </ul>
    `;
    el.appendChild(siteList);
  }

  if (opts.reason === 'no-prompts') {
    const steps = document.createElement('ol');
    steps.className = 'empty-state__steps';

    const s1 = document.createElement('li');
    s1.innerHTML = 'Hit <strong>🔄 Refresh</strong> in the top-right header';

    const s2 = document.createElement('li');
    s2.textContent = 'Reload the page, then open the extension again';

    const s3 = document.createElement('li');
    if (opts.reportUrl) {
      s3.innerHTML = 'Still empty? It may be a bug or unsupported — ';
      const link = document.createElement('a');
      link.className = 'settings-link';
      link.href = opts.reportUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'report it';
      s3.appendChild(link);
    } else {
      s3.textContent = 'Still empty? This site may not be fully supported yet';
    }

    steps.appendChild(s1);
    steps.appendChild(s2);
    steps.appendChild(s3);
    el.appendChild(steps);
  } else if (opts.reportUrl) {
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
