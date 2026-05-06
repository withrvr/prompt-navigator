// Main view of the popup. Phase 1 renders a header + a "ready" placeholder
// so we can verify the build pipeline end-to-end. Phase 2 replaces the body
// with the live prompt list driven by messages from the content script.

const TITLE = 'Prompt Navigator';
const TAGLINE = 'Jump to any prompt in your AI chat.';

export function renderMainView(root: HTMLElement): void {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';
  header.innerHTML = `
    <div class="app__brand">
      <span class="app__logo" aria-hidden="true">🧭</span>
      <h1 class="app__title">${TITLE}</h1>
    </div>
  `;

  const body = document.createElement('section');
  body.className = 'app__body';
  body.innerHTML = `
    <p class="app__tagline">${TAGLINE}</p>
    <p class="app__hint">
      Open ChatGPT, Claude, or Gemini and click the icon again to see your prompts.
    </p>
  `;

  root.append(header, body);
}
