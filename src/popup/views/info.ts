// Info view. Version, supported platforms, support link.

const VERSION = '0.1.0';

const SUPPORTED = [
  { icon: '🤖', name: 'ChatGPT', url: 'chatgpt.com' },
  { icon: '🧠', name: 'Claude', url: 'claude.ai' },
  { icon: '💎', name: 'Gemini', url: 'gemini.google.com' },
  { icon: '🔍', name: 'Perplexity', url: 'perplexity.ai' },
  { icon: '🦾', name: 'Grok', url: 'grok.com' },
  { icon: '🐳', name: 'DeepSeek', url: 'chat.deepseek.com' },
  { icon: '🌬️', name: 'Mistral', url: 'chat.mistral.ai' },
  { icon: '🌙', name: 'Kimi', url: 'kimi.com' },
  { icon: '🪶', name: 'Meta AI', url: 'meta.ai' },
];

export function renderInfoView(root: HTMLElement, onBack: () => void): void {
  root.innerHTML = '';

  const header = document.createElement('header');
  header.className = 'app__header';
  header.innerHTML = `
    <div class="app__brand">
      <button class="app__btn app__btn--icon" id="back-btn" aria-label="Back" title="Back">←</button>
      <h1 class="app__title">About</h1>
    </div>
  `;
  header.querySelector('#back-btn')!.addEventListener('click', onBack);

  const body = document.createElement('section');
  body.className = 'app__body settings-body';

  // Version
  const vSection = document.createElement('div');
  vSection.className = 'settings-section info-brand';
  vSection.innerHTML = `
    <span class="info-brand__logo" aria-hidden="true">🧭</span>
    <div>
      <h2 class="info-brand__name">Prompt Navigator</h2>
      <p class="info-brand__version">v${VERSION}</p>
    </div>
  `;

  // Supported platforms
  const platformSection = document.createElement('div');
  platformSection.className = 'settings-section';
  platformSection.innerHTML = `<h2 class="settings-section__title">Supported platforms</h2>`;

  const platformList = document.createElement('ul');
  platformList.className = 'info-platforms';
  for (const p of SUPPORTED) {
    const li = document.createElement('li');
    li.className = 'info-platform';
    li.innerHTML = `<span aria-hidden="true">${p.icon}</span> ${p.name} <span class="info-platform__url">${p.url}</span>`;
    platformList.appendChild(li);
  }
  platformSection.appendChild(platformList);

  // Links
  const linksSection = document.createElement('div');
  linksSection.className = 'settings-section';
  linksSection.innerHTML = `
    <h2 class="settings-section__title">Links</h2>
    <ul class="info-links">
      <li><a class="settings-link" href="https://github.com/withrvr/prompt-navigator" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      <li><a class="settings-link" href="https://github.com/withrvr/prompt-navigator/issues" target="_blank" rel="noopener noreferrer">Report an issue</a></li>
    </ul>
  `;

  body.appendChild(vSection);
  body.appendChild(platformSection);
  body.appendChild(linksSection);
  root.appendChild(header);
  root.appendChild(body);
}
