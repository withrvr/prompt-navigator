// Favorites management view.
// Shows all favorited prompts with drag handles for reordering.
// Changes are persisted immediately via saveFavoritesOrdered().

import { getFavoritesOrdered, saveFavoritesOrdered, toggleFavorite } from '@/shared/storage';

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
  `;
  header.querySelector('#back-btn')!.addEventListener('click', onBack);

  const body = document.createElement('section');
  body.className = 'app__body';

  root.appendChild(header);
  root.appendChild(body);

  const ordered = await getFavoritesOrdered();

  if (ordered.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <span class="empty-state__icon" aria-hidden="true">⭐</span>
        <h2 class="empty-state__heading">No favorites yet</h2>
        <p class="empty-state__body">Star a prompt in the main list to add it here.</p>
      </div>
    `;
    return;
  }

  const hint = document.createElement('p');
  hint.className = 'fav-hint';
  hint.textContent = 'Drag ⠿ to reorder. Changes save instantly.';
  body.appendChild(hint);

  const ul = document.createElement('ul');
  ul.className = 'fav-list';
  ul.setAttribute('aria-label', 'Reorder favorites');
  body.appendChild(ul);

  // ── Drag state ──────────────────────────────────────────────────────────
  let dragSrcIdx: number | null = null;

  const rebuildList = (): void => {
    ul.innerHTML = '';
    for (let i = 0; i < ordered.length; i++) {
      ul.appendChild(buildItem(i));
    }
  };

  const buildItem = (idx: number): HTMLLIElement => {
    const text = ordered[idx];
    const li = document.createElement('li');
    li.className = 'fav-item';
    li.draggable = true;
    li.dataset['idx'] = String(idx);

    const handle = document.createElement('span');
    handle.className = 'fav-item__handle';
    handle.setAttribute('aria-hidden', 'true');
    handle.textContent = '⠿';
    handle.title = 'Drag to reorder';

    const textSpan = document.createElement('span');
    textSpan.className = 'fav-item__text';
    textSpan.textContent = text.length > 100 ? text.slice(0, 100).trimEnd() + '…' : text;
    textSpan.title = text;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'fav-item__actions';

    // Copy
    const copyBtn = buildIconBtn('📋', 'Copy');
    copyBtn.addEventListener('click', () => {
      void navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✅';
        setTimeout(() => (copyBtn.textContent = '📋'), COPY_FEEDBACK_MS);
      });
    });

    // Remove from favorites
    const removeBtn = buildIconBtn('⭐', 'Remove from favorites');
    removeBtn.addEventListener('click', async () => {
      await toggleFavorite(text);
      ordered.splice(idx, 1);
      rebuildList();
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(removeBtn);

    li.appendChild(handle);
    li.appendChild(textSpan);
    li.appendChild(actionsDiv);

    // ── Drag-and-drop events ──────────────────────────────────────────────
    li.addEventListener('dragstart', (e) => {
      dragSrcIdx = idx;
      li.classList.add('fav-item--dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(idx));
      }
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('fav-item--dragging');
      ul.querySelectorAll('.fav-item--over').forEach((el) => el.classList.remove('fav-item--over'));
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      ul.querySelectorAll('.fav-item--over').forEach((el) => el.classList.remove('fav-item--over'));
      li.classList.add('fav-item--over');
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('fav-item--over');
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      li.classList.remove('fav-item--over');
      if (dragSrcIdx === null || dragSrcIdx === idx) return;

      // Reorder in-place
      const [moved] = ordered.splice(dragSrcIdx, 1);
      ordered.splice(idx, 0, moved);
      dragSrcIdx = null;
      void saveFavoritesOrdered([...ordered]);
      rebuildList();
    });

    return li;
  };

  rebuildList();
}

function buildIconBtn(icon: string, label: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'prompt-item__btn';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('title', label);
  btn.textContent = icon;
  return btn;
}
