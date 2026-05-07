// Empty-state component. Renders when the popup has nothing useful to list.
// Covers: unsupported site, no prompts found, content script not injected.

export type EmptyReason = 'unsupported' | 'no-prompts' | 'loading' | 'error';

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
    icon: '🤔',
    heading: 'No prompts yet',
    body: 'Start a conversation and your messages will appear here.',
  },
  unsupported: {
    icon: '🌐',
    heading: 'Site not supported',
    body: 'Prompt Navigator works on ChatGPT, Claude, and Gemini. Open one of those to get started.',
  },
  error: {
    icon: '⚠️',
    heading: 'Something went wrong',
    body: 'Could not read the page. Try refreshing.',
  },
};

/** Renders an informative empty state into `container`, replacing its content. */
export function renderEmptyState(container: HTMLElement, opts: EmptyStateOptions): void {
  const { icon, heading, body } = COPY[opts.reason];
  container.innerHTML = `
    <div class="empty-state">
      <span class="empty-state__icon" aria-hidden="true">${icon}</span>
      <h2 class="empty-state__heading">${heading}</h2>
      <p class="empty-state__body">${opts.detail ?? body}</p>
    </div>
  `;
}
