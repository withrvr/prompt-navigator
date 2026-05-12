// Shared hover tooltip for prompt text.
// Uses position:fixed so it escapes the popup body's overflow:hidden and sits
// above all other content. A single div is reused across all items.

const TOOLTIP_ID = 'pn-tooltip';
const SHOW_DELAY_MS = 400;

let tooltipEl: HTMLElement | null = null;
let showTimer: ReturnType<typeof setTimeout> | null = null;

function getTooltip(): HTMLElement {
  if (!tooltipEl) {
    const el = document.createElement('div');
    el.id = TOOLTIP_ID;
    el.setAttribute('role', 'tooltip');
    document.body.appendChild(el);
    tooltipEl = el;
  }
  return tooltipEl;
}

/** Wire a tooltip showing `text` onto `trigger` (mouseenter/mouseleave). */
export function attachTooltip(trigger: HTMLElement, text: string): void {
  trigger.addEventListener('mouseenter', () => {
    showTimer = setTimeout(() => {
      const tip = getTooltip();
      tip.textContent = text;

      const rect = trigger.getBoundingClientRect();
      // Prefer above; fall back to below when near the top edge.
      const spaceAbove = rect.top;
      const tipHeight = 0; // unknown before render; CSS max-height handles overflow

      if (spaceAbove > 80) {
        tip.style.top = '';
        tip.style.bottom = `${window.innerHeight - rect.top + 6}px`;
      } else {
        tip.style.bottom = '';
        tip.style.top = `${rect.bottom + 6}px`;
      }
      // Horizontally: align with the trigger's left edge, clamp to viewport.
      const left = Math.min(rect.left, window.innerWidth - 340);
      tip.style.left = `${Math.max(8, left)}px`;
      tip.classList.add('pn-tooltip--visible');
      void tipHeight; // suppress unused warning
    }, SHOW_DELAY_MS);
  });

  trigger.addEventListener('mouseleave', () => {
    if (showTimer !== null) {
      clearTimeout(showTimer);
      showTimer = null;
    }
    tooltipEl?.classList.remove('pn-tooltip--visible');
  });
}
