// Optional in-page floating navigator button.
// Injects a fixed-position button that toggles a panel (iframe) showing the
// popup UI. Isolated in a shadow root so host-page styles never leak in.
//
// Layout lives entirely inside the shadow root (flex column in .pn-wrapper).
// The host element is just an unstyled mount point — inline styles on the host
// don't apply to shadow children, so all positioning must be shadow-internal.

import browser from '@/shared/browser';

const POPUP_H = 600;   // matches --pn-popup-height in tokens.css
const PANEL_W = 436;   // 1.2× original popup width
const BTN_SIZE = 44;
const PANEL_GAP = 8;
const EDGE_OFFSET = 20;

let hostEl: HTMLElement | null = null;

/** Inject the floating button into the host page. Returns a disposer. */
export function injectFloatingButton(): () => void {
  if (hostEl) return () => undefined; // already injected

  const host = document.createElement('div');
  host.id = 'pn-float-host';

  const shadow = host.attachShadow({ mode: 'closed' });

  // ── Styles inside shadow root ───────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    :host { all: initial; }

    /* Flex wrapper — positioned fixed inside the shadow so flex applies to
       shadow children (not light-DOM children of the host element). */
    .pn-wrapper {
      position: fixed;
      bottom: ${EDGE_OFFSET}px;
      right: ${EDGE_OFFSET}px;
      z-index: 2147483646;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: ${PANEL_GAP}px;
      max-height: calc(100vh - ${EDGE_OFFSET * 2}px);
    }

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
      flex-shrink: 0;
    }
    .pn-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,.4); }
    .pn-btn:active { transform: scale(.96); }

    .pn-panel {
      width: ${PANEL_W}px;
      height: ${POPUP_H}px;
      max-height: calc(100vh - ${EDGE_OFFSET * 2 + PANEL_GAP + BTN_SIZE}px);
      border: none;
      border-radius: 12px;
      box-shadow: 0 8px 40px rgba(0,0,0,.35);
      display: none;
      overflow: hidden;
      flex-shrink: 1;
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

  // ── Wrapper (flex container in shadow) ─────────────────────────────────
  // Panel is first child → appears above the button (column flows top→bottom,
  // container is pinned at the bottom, so content grows upward).
  const wrapper = document.createElement('div');
  wrapper.className = 'pn-wrapper';
  wrapper.appendChild(iframe);
  wrapper.appendChild(btn);

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    iframe.classList.toggle('pn-panel--open', open);
    btn.title = open ? 'Close Prompt Navigator' : 'Open Prompt Navigator';
    btn.setAttribute('aria-label', open ? 'Close Prompt Navigator' : 'Open Prompt Navigator');
  });

  // Close panel when clicking outside the shadow host
  document.addEventListener('click', (e) => {
    if (open && !host.contains(e.target as Node)) {
      open = false;
      iframe.classList.remove('pn-panel--open');
      btn.title = 'Open Prompt Navigator';
      btn.setAttribute('aria-label', 'Open Prompt Navigator');
    }
  });

  shadow.appendChild(style);
  shadow.appendChild(wrapper);
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
