// Empty-state component. Renders when the popup has nothing useful to list.
// Covers every non-happy path so the user always has an explanation + next step.

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

const COPY: Record<EmptyReason, { icon: string; heading: string; body: string }> = {
  loading: {
    icon: '⏳',
    heading: 'Loading…',
    body: 'Scanning the conversation.',
  },
  'no-prompts': {
    icon: '💬',
    heading: 'No messages yet',
    body: 'Start chatting and your prompts will appear here.',
  },
  'no-match': {
    icon: '🔍',
    heading: 'No matches',
    body: 'Try a different search term.',
  },
  unsupported: {
    icon: '🌐',
    heading: 'Site not supported',
    body: 'Prompt Navigator works on ChatGPT, Claude, Gemini, and more. Open a conversation there first.',
  },
  error: {
    icon: '⚠️',
    heading: 'Something went wrong',
    body: 'Could not read the page. Try refreshing the AI tab, then click the icon again.',
  },
};

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
  const { icon, heading, body } = COPY[opts.reason];

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
    link.textContent = '🐛 Report broken selectors';
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
