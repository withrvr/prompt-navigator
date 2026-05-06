# State

> Lightweight log of what's done and what's next. Updated at the end of every phase.

## Now

**Phase 1 — Scaffold.** Project bootstrapped: Vite + TS + @crxjs, MV3 manifest as TS, popup skeleton with theme tokens (auto/dark/light, purple accent), background service worker stub, content script stub, dev/prod-aware logger, ESLint + Prettier, CI workflow, README/CONTRIBUTING/ARCHITECTURE/ROADMAP, generated icon set.

## Next

**Phase 2 — Adapter foundation + ChatGPT adapter.**

- Define `PromptAdapter` interface in `src/content/adapters/base.ts`.
- Build the adapter registry (`src/content/adapters/registry.ts`).
- Implement the ChatGPT adapter (`[data-message-author-role="user"]`).
- Wire the content script: adapter selection → MutationObserver → message handler.
- Wire the popup: on open, `runtime.sendMessage` → `GET_PROMPTS` → render list.

## How to run what we have so far

```bash
npm install
npm run build
# Load `dist/` as an unpacked extension in Chrome.
# Click the icon — should see the brand header + a hint, themed by your OS.
```

## Notes captured during phase 1

- `webextension-polyfill` + `@crxjs/vite-plugin` is the lowest-friction MV3 stack today.
- Avoiding `<all_urls>` in `host_permissions` keeps the store review easy; we add hosts as adapters land.
- Theme tokens live in `src/popup/styles/tokens.css` (sizes/spacing) + `theme.css` (colors).
