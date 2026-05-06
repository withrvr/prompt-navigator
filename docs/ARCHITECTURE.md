# Architecture

Distilled from the implementation plan. See `docs/ROADMAP.md` for the per-phase plan and `docs/STATE.md` for what's currently in flight.

## Surfaces

```
┌────────────────────────────────────────────────────────────┐
│ Host page (chatgpt.com / claude.ai / gemini.google.com)    │
│                                                            │
│   content script  ◀─── DOM, MutationObserver               │
│     │                                                      │
│     ├─ adapter (registry → chatgpt | claude | gemini)      │
│     ├─ observer (debounced)                                │
│     └─ message handler  (GET_PROMPTS / SCROLL_TO / PING)   │
│         ▲                                                  │
└─────────┼──────────────────────────────────────────────────┘
          │ browser.tabs.sendMessage
          │
   ┌──────┴───────┐
   │ Popup        │  views: main / settings / info
   │              │  state: prompts, filter, theme, favorites
   │              │  storage: browser.storage.local
   └──────────────┘
          ▲
          │ runtime messaging
          ▼
   ┌──────────────┐
   │ Background   │  service worker (lifecycle + future migration hooks)
   └──────────────┘
```

## Adapter contract

Every AI platform implements one interface so the content script doesn't need to know the platform's quirks.

```ts
interface PromptAdapter {
  id: string;                           // 'chatgpt'
  matches(url: URL): boolean;           // routing
  getPrompts(): Prompt[];               // text + element + index
  scrollTo(prompt: Prompt): void;       // safe scroll (NEVER scrollIntoView on Claude)
  observe(onChange: () => void): () => void; // returns disposer
}
```

Adding a platform = drop a new file in `src/content/adapters/`, register it, add the host to the manifest. No core changes.

## Why popup-only?

User-facing constraint: nothing renders on the host page. The popup is the only surface. This keeps:

- The host AI app uncluttered.
- Permissions narrow (no need to inject UI into the page).
- Failure modes simple — if the content script can't run, the popup shows a clear empty state.

## Why a build step (Vite + @crxjs)?

- Single TypeScript source for the manifest → easy to fork into a Firefox-flavored manifest.
- HMR for the popup during dev.
- Same toolchain produces both Chrome and Firefox bundles.

## Why no in-popup framework?

The popup is small (<400px wide, a list + search + a few buttons). React/Vue would dwarf the actual code. Vanilla TS keeps the bundle <50 KB and the rendering deterministic.

## Cross-browser

`webextension-polyfill` exposes a promise-based `browser.*` namespace on Chromium too, so the rest of the code is browser-agnostic. The Firefox build script (`scripts/build-firefox.ts`, phase 13) post-processes the manifest with `browser_specific_settings` and replaces `service_worker` with a `scripts: [...]` event page entry.

## Files of note

- `src/manifest.ts` — single source of truth for the manifest.
- `src/content/adapters/base.ts` — adapter interface + types.
- `src/content/adapters/registry.ts` — URL → adapter routing.
- `src/content/scroll.ts` — safe scroll helper (no `scrollIntoView`).
- `src/popup/popup.ts` — popup entry.
- `src/shared/messages.ts` — typed message protocol.
- `src/shared/storage.ts` — typed wrapper over `browser.storage.local`.
- `src/shared/exporters/{json,csv,pdf}.ts` — export formats.
