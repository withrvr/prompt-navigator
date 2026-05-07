// Safe scroll helper.
//
// Some host apps (notably Claude.ai) override or hijack `Element#scrollIntoView`
// in ways that break their own layout — virtualized lists, inertial scrollers,
// portal-style overlays. We instead walk up to the nearest scrollable parent,
// compute the target Y, and animate via `scrollTo({ behavior: 'smooth' })`.
//
// Falls back to plain assignment for browsers that don't support smooth
// scrolling on the scroller (very old engines).

const HEADER_OFFSET_PX = 96; // gives breathing room under sticky AI-app headers

/** Scroll the closest scrollable ancestor so `el` is visible near the top. */
export function safeScrollTo(el: HTMLElement): void {
  const scroller = findScrollableAncestor(el);
  const target = computeScrollTop(scroller, el);

  try {
    scroller.scrollTo({ top: target, behavior: 'smooth' });
  } catch {
    if (scroller === document.documentElement || scroller === document.body) {
      window.scrollTo(0, target);
    } else {
      scroller.scrollTop = target;
    }
  }
}

function computeScrollTop(scroller: HTMLElement, el: HTMLElement): number {
  if (scroller === document.documentElement || scroller === document.body) {
    const rect = el.getBoundingClientRect();
    return Math.max(0, window.scrollY + rect.top - HEADER_OFFSET_PX);
  }
  const scrollerRect = scroller.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return Math.max(0, scroller.scrollTop + (elRect.top - scrollerRect.top) - HEADER_OFFSET_PX);
}

function findScrollableAncestor(el: HTMLElement): HTMLElement {
  let node: HTMLElement | null = el.parentElement;
  while (node && node !== document.body) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }
  return document.scrollingElement instanceof HTMLElement
    ? document.scrollingElement
    : document.documentElement;
}

function isScrollable(el: HTMLElement): boolean {
  const style = getComputedStyle(el);
  const overflowY = style.overflowY;
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
  return el.scrollHeight > el.clientHeight + 1;
}
