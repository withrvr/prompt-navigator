// Recent prompts view.
// Shows the last up-to-10 prompts the user navigated to, most-recent first.
// Supports copy, clear-all, and direct re-scroll to the prompt's origin page.

import { getRecentPrompts, clearRecentPrompts } from '@/shared/storage';
import type { RecentPrompt } from '@/shared/storage';

const COPY_FEEDBACK_MS = 1200;

export async function renderRecentView(root: HTMLElement, onBack: () => void): Promise<void> {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';
  header.innerHTML = `
    <div class="app__brand">
      <button class="app__btn app__btn--icon" id="back-btn" aria-label="Back" title="Back">←</button>
      <h1 class="app__title">Recent</h1>
    </div>
    <div class="app__actions">
      <span class="app__count" id="recent-count"></span>
      <button class="app__btn app__btn--icon" id="clear-btn" title="Clear history" aria-label="Clear recent history">🗑️</button>
    </div>
  `;
  header.querySelector('#back-btn')!.addEventListener('click', onBack);

  const body = document.createElement('section');
  body.className = 'app__body';

  root.appendChild(header);
  root.appendChild(body);

  const countEl = header.querySelector<HTMLElement>('#recent-count')!;
  const clearBtn = header.querySelector<HTMLButtonElement>('#clear-btn')!;

  const render = async (): Promise<void> => {
    body.innerHTML = '';
    const recents = await getRecentPrompts();
    countEl.textContent = recents.length > 0 ? `${recents.length}` : '';
    clearBtn.style.display = recents.length > 0 ? '' : 'none';

    if (recents.length === 0) {
      body.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon" aria-hidden="true">🕐</span>
          <h2 class="empty-state__heading">No recent prompts</h2>
          <p class="empty-state__body">Prompts you navigate to will appear here.</p>
        </div>
      `;
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'prompt-list';
    body.appendChild(ul);

    recents.forEach((entry, idx) => {
      ul.appendChild(buildItem(entry, idx));
    });
  };

  clearBtn.addEventListener('click', async () => {
    await clearRecentPrompts();
    await render();
  });

  await render();
}

function buildItem(entry: RecentPrompt, idx: number): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'prompt-item recent-item';
  li.setAttribute('data-recent-idx', String(idx));

  const indexBadge = document.createElement('span');
  indexBadge.className = 'prompt-item__index';
  indexBadge.textContent = String(idx + 1);
  indexBadge.setAttribute('aria-hidden', 'true');

  const textSpan = document.createElement('span');
  textSpan.className = 'prompt-item__text';
  const preview = entry.text.length > 120 ? entry.text.slice(0, 120).trimEnd() + '…' : entry.text;
  textSpan.textContent = preview;
  textSpan.title = entry.text;

  const metaSpan = document.createElement('span');
  metaSpan.className = 'recent-item__meta';
  metaSpan.textContent = [entry.platform, formatAge(entry.usedAt)].filter(Boolean).join(' · ');

  const textGroup = document.createElement('div');
  textGroup.className = 'recent-item__text-group';
  textGroup.appendChild(textSpan);
  textGroup.appendChild(metaSpan);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'prompt-item__actions';

  const copyBtn = buildIconBtn('📋', 'Copy');
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(entry.text).then(() => {
      copyBtn.textContent = '✅';
      setTimeout(() => (copyBtn.textContent = '📋'), COPY_FEEDBACK_MS);
    });
  });
  actionsDiv.appendChild(copyBtn);

  li.appendChild(indexBadge);
  li.appendChild(textGroup);
  li.appendChild(actionsDiv);

  return li;
}

function buildIconBtn(icon: string, label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'prompt-item__btn';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
  btn.textContent = icon;
  return btn;
}

function formatAge(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
