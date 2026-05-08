// Optional in-page floating navigator button.
// Injects a fixed-position button that toggles a panel (iframe) showing the
// popup UI. Isolated in a shadow root so host-page styles never leak in.

import browser from '@/shared/browser';

const PANEL_W = 484;
const PANEL_H = 684;
const BTN_SIZE = 44;

let hostEl: HTMLElement | null = null;

/** Inject the floating button into the host page. Returns a disposer. */
export function injectFloatingButton(): () => void {
  if (hostEl) return () => undefined; // already injected

  const host = document.createElement('div');
  host.id = 'pn-float-host';
  // Minimal host styles — the shadow root handles the rest.
  host.style.cssText = [
    'position:fixed',
    'bottom:20px',
    'right:20px',
    `z-index:2147483646`,
    'display:flex',
    'flex-direction:column',
    'align-items:flex-end',
    'gap:8px',
  ].join(';');

  const shadow = host.attachShadow({ mode: 'closed' });

  // ── Styles inside shadow root ───────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }
    .pn-btn {
      width: ${BTN_SIZE}px;
      height: ${BTN_SIZE}px;
      border-radius: 50%;
      background: #9146ff;
      border: none;
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0,0,0,.35);
      transition: transform .15s, box-shadow .15s;
      padding: 0;
      color: #fff;
    }
    .pn-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,.4); }
    .pn-btn:active { transform: scale(.96); }
    .pn-panel {
      width: ${PANEL_W}px;
      height: ${PANEL_H}px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,.35);
      display: none;
      overflow: hidden;
    }
    .pn-panel--open { display: block; }
  `;

  // ── Panel iframe ────────────────────────────────────────────────────────
  const popupUrl = browser.runtime.getURL('src/popup/index.html');
  const iframe = document.createElement('iframe');
  iframe.className = 'pn-panel';
  iframe.src = popupUrl;
  iframe.title = 'Prompt Navigator';

  // ── Toggle button ───────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.className = 'pn-btn';
  btn.textContent = '🧭';
  btn.title = 'Prompt Navigator';
  btn.setAttribute('aria-label', 'Open Prompt Navigator');

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    iframe.classList.toggle('pn-panel--open', open);
    btn.title = open ? 'Close Prompt Navigator' : 'Open Prompt Navigator';
  });

  // Close panel when clicking outside the shadow host
  document.addEventListener('click', (e) => {
    if (open && !host.contains(e.target as Node)) {
      open = false;
      iframe.classList.remove('pn-panel--open');
      btn.title = 'Open Prompt Navigator';
    }
  });

  shadow.appendChild(style);
  shadow.appendChild(iframe);
  shadow.appendChild(btn);
  document.body.appendChild(host);
  hostEl = host;

  return () => {
    host.remove();
    hostEl = null;
  };
}

/** Remove the floating button if it exists. */
export function removeFloatingButton(): void {
  if (hostEl) {
    hostEl.remove();
    hostEl = null;
  }
}
