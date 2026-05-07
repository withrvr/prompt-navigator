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
    body: 'Prompt Navigator works on ChatGPT, Claude, and Gemini. Open a conversation there first.',
  },
  error: {
    icon: '⚠️',
    heading: 'Something went wrong',
    body: 'Could not read the page. Try refreshing the AI tab, then click the icon again.',
  },
};

/** Renders an informative empty state into `container`, replacing its content. */
export function renderEmptyState(container: HTMLElement, opts: EmptyStateOptions): void {
  const { icon, heading, body } = COPY[opts.reason];
  container.innerHTML = `
    <div class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">${icon}</span>
      <h2 class="empty-state__heading">${heading}</h2>
      <p class="empty-state__body">${escapeHtml(opts.detail ?? body)}</p>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
