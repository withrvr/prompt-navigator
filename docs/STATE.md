# State

> Lightweight log of what's done and what's next.

## Current branch

`kanban_todo_changes` — kanban backlog fixes, built on top of `feat_fix/github_issues_1_to_3`.

## Kanban backlog progress

| # | Task | Status |
|---|------|--------|
| 1 | Fix floating navigator button layout (shadow DOM flex + PANEL_H) | ✅ committed |
| 2 | Fix Gemini "you said" prefix stripping (regex, all variants) | ✅ committed |
| 3 | Favorites footer Select/Done consistency (visibility-toggle, no layout shift) | ✅ committed |
| 4 | Favorites export menu positioning (footer__right position:relative) | ✅ committed |
| 5 | GitHub Actions release workflow (auto-build Chrome+Firefox zips on tag push) | ✅ committed |
| 6 | Recent Prompts view (last 10 navigated prompts, platform+age meta, clear) | ✅ committed |

## v1.2 progress (prior branch — all done)

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

## Fix details

### Floating button layout fix
The host element's inline `display:flex` only affects light-DOM children — the
shadow root's `iframe` and `button` were completely outside that flex context.
Fixed by creating a `.pn-wrapper` div *inside* the shadow that owns the
`position:fixed` + `flex-direction:column` layout.  `PANEL_H` corrected from
700 → 600px to match `--pn-popup-height`, eliminating the 100px blank gap.

### Gemini "you said" fix
Replaced the hard-coded `['you said:', 'you said ']` array with a single
regex `/^you\s+said[:\s,]*/i` that covers all observed Gemini UI variants
(with/without colon, newline, comma, any capitalisation).

### Favorites footer consistency
The All/None buttons were conditionally inserted/removed on every Select toggle,
causing a layout shift.  Now uses the same `visibility:hidden /
footer__select-all-group--visible` pattern as the main `Footer.ts`.

### Favorites export menu fix
The `export-menu` (`position:absolute`) was appended directly to
`.app__footer` which has no `position:relative`, so the dropdown anchored to
the wrong ancestor.  Wrapped the export button and menu in a `footer__right`
div (`position:relative`), matching the main footer structure.

### GitHub release workflow
`.github/workflows/release.yml` — push a version tag (`v1.0.0`) and the
workflow automatically builds Chrome + Firefox, packages versioned zips,
generates a changelog from git log, and publishes a GitHub Release.
See `docs/RELEASE.md` for developer and user instructions.

### Recent Prompts view
New `🕐` button in the main header opens a "Recent" view showing the last 10
prompts the user navigated to.  Each entry stores `{ text, platform, url,
usedAt }`.  Deduplicates by text — revisiting the same prompt moves it to
the front.  Clear button wipes the history.

## Run locally

```bash
npm install && npm run build
# Load dist/ as unpacked extension in Chrome
# Press Alt+P to open the popup quickly
```

## Next

- Merge kanban_todo_changes → feat_fix/github_issues_1_to_3 → main
- Create first versioned release: `npm version patch && git push --follow-tags`
- Store submissions (Chrome Web Store, Mozilla AMO)
