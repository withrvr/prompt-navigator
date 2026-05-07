# State

> Lightweight log of what's done and what's next.

## Current branch

`claude/v1.2-backlog` — all remaining backlog features, built on top of v1.1.

## v1.2 progress

| # | Feature | Status |
|---|---|---|
| 1 | Per-platform "report broken selector" quick-link | ✅ committed |
| 2 | Bulk export (selected prompts only) | ✅ committed |
| 3 | Optional in-page floating navigator button | ✅ committed |
| 4 | Drag-to-reorder favorites list | ✅ committed |
| 5 | Custom keyboard shortcuts per action | ✅ committed |
| 6 | Safari Web Extension build script | ✅ committed |
| 7 | i18n foundation (typed string catalogue + t() lookup) | ✅ committed |

**57 tests passing** (unchanged — new features are UI-only).

## v1.2 feature details

### Report broken selectors
When a known platform returns zero prompts, the empty state shows a pre-filled
GitHub issue link with the platform name and page URL filled in.

### Bulk export
A "Select" toggle in the footer enables checkbox mode. Export then applies only
to checked prompts. Export label updates to "Export (N)".

### Floating navigator button
Settings → In-page panel → toggle. Injects a 🧭 button into the host page
(shadow-DOM isolated). Clicking it opens an iframe panel showing the popup UI.
Real-time: toggling the setting while on an AI page updates without reload.

### Drag-to-reorder favorites
Settings → Manage favorites & reorder. Favorites are now stored as an ordered
array. The Favorites view uses HTML5 drag-and-drop; drops persist immediately.

### Custom keyboard shortcuts
Always-on in the popup: 1-9 jump, ↑↓ navigate. Configurable in Settings →
Keyboard shortcuts: click a key badge and press any key to reassign copy/favorite.

### Safari build
`npm run build:safari` (macOS only). Calls `xcrun safari-web-extension-converter`
on `dist/` and produces an Xcode project at `dist-safari/`. Instructions printed.

### i18n foundation
`src/shared/i18n.ts` — typed `Strings` interface for all user-visible copy,
`en` locale table, `t(key)` lookup with English fallback. EmptyState migrated
as the reference implementation.

## Run locally

```bash
npm install && npm run build
# Load dist/ as unpacked extension in Chrome
# Press Alt+P to open the popup quickly
```

## Next

- Merge v1.2 → v1.1 → v1 → submit to Chrome Web Store + Mozilla AMO
- User-side testing of v1.2 features
- Optionally: wire t() into remaining UI components for a given locale
- AI-generated summaries / conversation switcher (future)
