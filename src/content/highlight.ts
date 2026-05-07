// Flash highlight injected onto the target element after a scroll.
//
// Injects a tiny <style> tag once, then adds/removes a CSS class on the
// element. Uses an outline-based ring rather than background color so it
// doesn't disturb the host app's own background on any platform.

const HIGHLIGHT_CLASS = 'pn-highlight';
const HIGHLIGHT_DURATION_MS = 1400;
const STYLE_ID = 'pn-highlight-style';

/** Inject the keyframe stylesheet into the host page (idempotent). */
function ensureStyle(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes pn-ring {
      0%   { outline: 3px solid rgba(145,70,255,0);   outline-offset: 4px; }
      20%  { outline: 3px solid rgba(145,70,255,0.85); outline-offset: 4px; }
      80%  { outline: 3px solid rgba(145,70,255,0.85); outline-offset: 4px; }
      100% { outline: 3px solid rgba(145,70,255,0);   outline-offset: 4px; }
    }
    .${HIGHLIGHT_CLASS} {
      animation: pn-ring ${HIGHLIGHT_DURATION_MS}ms ease forwards !important;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

let activeTimer: ReturnType<typeof setTimeout> | null = null;
let activeElement: HTMLElement | null = null;

/** Briefly flash a purple ring around `el`. Re-entrancy safe. */
export function flashHighlight(el: HTMLElement): void {
  ensureStyle();

  // Cancel any in-flight highlight first
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeElement?.classList.remove(HIGHLIGHT_CLASS);
  }

  activeElement = el;
  el.classList.add(HIGHLIGHT_CLASS);

  activeTimer = setTimeout(() => {
    el.classList.remove(HIGHLIGHT_CLASS);
    activeElement = null;
    activeTimer = null;
  }, HIGHLIGHT_DURATION_MS + 50);
}
