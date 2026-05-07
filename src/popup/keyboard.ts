// In-popup keyboard shortcuts.
//
// Always-on:
//   1-9          Jump to prompt #N directly
//   Arrow Down   Focus next prompt item
//   Arrow Up     Focus previous prompt item
//
// When a prompt item has focus:
//   Enter / Space  Activate (navigate to page)
//   [copy key]     Copy the prompt text (default: c)
//   [fav  key]     Toggle favorite (default: f)

import type { PnSettings } from '@/shared/storage';

export interface KeyboardContext {
  /** Returns the current list of prompt-item elements. */
  getItems: () => NodeListOf<HTMLElement> | HTMLElement[];
  /** Called when shortcut 1-9 is pressed — navigate to prompt index. */
  onJump: (index: number) => void;
  shortcuts: PnSettings['shortcuts'];
}

/** Registers popup keyboard shortcuts and returns a disposer. */
export function registerKeyboardShortcuts(ctx: KeyboardContext): () => void {
  const handler = (e: KeyboardEvent): void => {
    // Ignore when user is typing in an input / textarea / search
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
      return;
    }

    // ── Per-item shortcuts (require a focused prompt item) ─────────────────
    if (focusedIdx === -1) return;
    const item = items[focusedIdx];

    if (key === ctx.shortcuts.copy) {
      e.preventDefault();
      item.querySelector<HTMLButtonElement>('[aria-label="Copy prompt"]')?.click();
      return;
    }
    if (key === ctx.shortcuts.favorite) {
      e.preventDefault();
      item.querySelector<HTMLButtonElement>('[aria-label="Toggle favorite"]')?.click();
      return;
    }
  };

  document.addEventListener('keydown', handler);
  return () => document.removeEventListener('keydown', handler);
}
