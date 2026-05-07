# State

> Lightweight log of what's done and what's next.

## Current branch

`claude/v1.1-features` — v1.1 work in progress (not yet merged to v1).

## v1.1 progress

| # | Feature | Status |
|---|---|---|
| 1 | PlatformId expansion + makeAdapter helper | ✅ committed |
| 2 | Perplexity adapter | ✅ committed |
| 3 | Grok adapter | ✅ committed |
| 4 | DeepSeek adapter | ✅ committed |
| 5 | Mistral / Le Chat adapter | ✅ committed |
| 6 | Kimi adapter | ✅ committed |
| 7 | Meta AI adapter | ✅ committed |
| 8 | Favorites-only filter toggle | ✅ committed |
| 9 | Alt+P keyboard shortcut | ✅ committed |

**57 tests passing** (was 25 in v1).

## Known caveats for v1.1 adapters

The 6 secondary platforms shipped with selector chains based on:
- Confirmed selectors: Grok (`div.message-bubble`)
- Educated guesses based on common React/Tailwind patterns: Perplexity, DeepSeek, Mistral, Kimi, Meta AI

Each adapter has 4–5 fallback selectors so it's resilient to single-marker changes. Real-world testing on each live site is the next QA step. If a selector misses, the popup shows the friendly "no prompts yet" empty state — never crashes.

## v1 summary (already merged-able)

All 16 phases shipped on `claude/plan-dev-workflow-a65rM`:
1–16: scaffold → adapters → click-navigate → search/refresh → theme → favorites/copy → export → settings/info → empty states → Firefox build → tests → docs → packaging.

## Run locally

```bash
npm install && npm run build
# Load dist/ as unpacked extension in Chrome
# Press Alt+P to open the popup quickly
```

## Next

- User-side testing of v1.1 adapters on live sites
- Refine selectors if any platform misses
- Merge v1.1 → v1 → submit to Chrome Web Store + Mozilla AMO
