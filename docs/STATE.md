# State

> Lightweight log of what's done and what's next.

## Current branch

`add_on_to_kanban_feature_also` — UI/UX additions and bug fixes on top of the kanban backlog branch.

## v0.2.0 progress (current branch — all done)

| # | Task | Status |
|---|------|--------|
| 1 | Kimi scroll fix (scrollIntoView + overflow:overlay recognition) | ✅ committed |
| 2 | Hover tooltip (Tooltip.ts, 400ms delay, position:fixed) | ✅ committed |
| 3 | Favorites & Refresh buttons permanently in header | ✅ committed |
| 4 | URL_CHANGED auto-refresh for popup + floating navigator | ✅ committed |
| 5 | Unsupported-site: inline list of all 9 supported platforms | ✅ committed |
| 6 | Settings cleanup (remove redundant favorites link, drop navigate param) | ✅ committed |

## Kanban backlog (prior work — all done)

| # | Task | Status |
|---|------|--------|
| 1 | Fix floating navigator button layout (shadow DOM flex + PANEL_H) | ✅ committed |
| 2 | Fix Gemini "you said" prefix stripping (regex, all variants) | ✅ committed |
| 3 | Favorites footer Select/Done consistency (visibility-toggle, no layout shift) | ✅ committed |
| 4 | Favorites export menu positioning (footer__right position:relative) | ✅ committed |
| 5 | GitHub Actions release workflow (auto-build Chrome+Firefox zips on tag push) | ✅ committed |
| 6 | Recent Prompts view (last 10 navigated prompts, platform+age meta, clear) | ✅ committed |

## v0.2.0 fix details

### Kimi scroll
Kimi's chat container uses `overflow: overlay` — a deprecated but Chrome-supported value.
`safeScrollTo` was not recognising it as scrollable, so the scroll call was a no-op.
Fixed by adding `'overlay'` to the `isScrollable` check in `scroll.ts`, and giving Kimi a
custom `scrollTo` override in `kimi.ts` that falls back to native `scrollIntoView`.

### Hover tooltip
`Tooltip.ts` creates a single `position: fixed` div (`#pn-tooltip`) appended to `document.body`.
It escapes the popup body's `overflow: hidden` clip and positions itself above or below the
trigger element. A 400 ms `setTimeout` prevents flicker on accidental hover.

### URL_CHANGED auto-refresh
The SPA navigation observer in `content/index.ts` now broadcasts a `{ type: 'URL_CHANGED', url }`
`RuntimeMessage` after re-initialising. `main.ts` registers a `browser.runtime.onMessage` listener
that calls `doFetch()` on receipt. The listener is cleaned up via `MutationObserver` when the
view is unmounted.

### Unsupported-site UI
`EmptyState.ts` previously rendered an animated arrow pointing to the Settings gear.
Replaced with a styled list of all 9 supported platforms (name + URL), shown at full popup
width. `pn-list-view` class is removed from `document.body` so the popup renders at
settings-view height rather than 600px.

## Run locally

```bash
npm install && npm run build
# Load dist/ as unpacked extension in Chrome
# Press Alt+P to open the popup quickly
```

## Next

- Merge `add_on_to_kanban_feature_also` → `claude/plan-dev-workflow-a65rM` → main
- Tag `v0.2.0` to trigger the release workflow
- Store submissions (Chrome Web Store, Mozilla AMO)
