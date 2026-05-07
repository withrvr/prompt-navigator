# State

> Lightweight log of what's done and what's next. Updated at the end of every phase.

## Now

**v1 complete.** All 16 phases shipped.

## What's done

| Phase | Deliverable |
|---|---|
| 1 | Scaffold: Vite + TS + @crxjs, manifest, popup skeleton, theme tokens, docs, CI |
| 2 | ChatGPT adapter + content script messaging + popup list |
| 3 | Click-to-navigate + purple flash highlight (safe scroll, no scrollIntoView) |
| 4 | Claude adapter (`[data-testid="user-message"]`, avoids scrollIntoView) |
| 5 | Gemini adapter (`<user-query>` custom element, child selector fallback) |
| 6 | Search / filter (live, case-insensitive, match highlight), count, refresh 🔄 |
| 7 | Theme system: auto/dark/light, purple accent (#9146FF), persisted |
| 8 | Favorites ⭐ (browser.storage.local) + copy 📋 (clipboard API) |
| 9 | Export: JSON · CSV · PDF (iframe print dialog) |
| 10 | Settings view + Info view + in-process view router |
| 11 | Non-happy path states: loading, no-prompts, no-match, unsupported, error |
| 12 | Dev/prod logger (silent in production builds) — shipped with phase 1 |
| 13 | Firefox build target (`scripts/build-firefox.ts` → `dist-firefox/`) |
| 14 | 25 Vitest unit tests (adapters + exporters, jsdom env, path aliases) |
| 15 | README: install steps, usage guide, feature table, store badge placeholders |
| 16 | `scripts/package-zip.ts` → `dist/chrome.zip` + `dist-firefox/firefox.zip` |

## Next (v1.1)

Add secondary adapters — one commit each:

- Perplexity (`perplexity.ai`)
- Grok (`grok.com`, `x.com/i/grok`)
- DeepSeek (`chat.deepseek.com`)
- Mistral / Le Chat (`chat.mistral.ai`)
- Kimi (`kimi.com`)
- Meta AI (`meta.ai`)

Then: submit to Chrome Web Store + Mozilla AMO.

## How to run locally

```bash
npm install && npm run build
# Load dist/ as unpacked extension in Chrome dev mode
```
