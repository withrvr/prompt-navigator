// In-popup keyboard shortcuts.
//
// Always-on:
//   1-9          Jump directly to prompt #N
//   Arrow Down   Focus next prompt item
//   Arrow Up     Focus previous prompt item
//
// Enter / Space on a focused item activates it (navigate to page).

export interface KeyboardContext {
  getItems: () => NodeListOf<HTMLElement> | HTMLElement[];
  onJump: (index: number) => void;
  shortcuts: Record<string, string>; // kept for API compat but unused
}

/** Registers popup keyboard shortcuts and returns a disposer. */
export function registerKeyboardShortcuts(ctx: KeyboardContext): () => void {
  const handler = (e: KeyboardEvent): void => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;
    const items = Array.from(ctx.getItems());
    const focused = document.activeElement as HTMLElement | null;
    const focusedIdx = items.findIndex((el) => el === focused);

    // ── Arrow navigation ───────────────────────────────────────────────────
    if (key === 'ArrowDown') {
      e.preventDefault();
      const next = focusedIdx < items.length - 1 ? focusedIdx + 1 : 0;
      items[next]?.focus();
      return;
    }
    if (key === 'ArrowUp') {
      e.preventDefault();
      const prev = focusedIdx > 0 ? focusedIdx - 1 : items.length - 1;
      items[prev]?.focus();
      return;
    }

    // ── Jump to prompt N (1-9) ─────────────────────────────────────────────
    const digit = parseInt(key, 10);
    if (digit >= 1 && digit <= 9) {
      const idx = digit - 1;
      if (idx < items.length) {
        e.preventDefault();
        ctx.onJump(idx);
      }
    }
  };

  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}
