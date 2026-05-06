# Roadmap

> Living document. Move items as they ship.

## ✅ Done

- _(none yet — scaffold in progress)_

## 🚧 In progress

- **Phase 1 — Scaffold**: Vite + TS + @crxjs, manifest, popup skeleton, theme tokens, docs, CI, icon set.

## ⏳ v1 (store-ready)

| # | Phase | Notes |
|---|---|---|
| 2 | Adapter foundation + ChatGPT | `PromptAdapter` interface, registry, content script wiring, popup list. |
| 3 | Click to navigate | Safe scroll util + flash highlight. |
| 4 | Claude adapter | `[data-testid="user-message"]`. Avoid `scrollIntoView`. |
| 5 | Gemini adapter | `user-query` element. |
| 6 | Search + count + refresh | Live filter, total/match counter, manual refresh. |
| 7 | Theme system | Auto / Light / Dark + toggle UI. |
| 8 | Favorites + copy | ⭐ + 📋 per item, persisted. |
| 9 | Export | JSON / CSV / PDF (jsPDF). |
| 10 | Settings + Info views | Theme, export prefs, version, support link. |
| 11 | Non-happy paths | Unsupported site, no prompts, error states. |
| 12 | Logging | Dev-verbose, prod-silent logger. |
| 13 | Firefox build | Gecko-flavored manifest + build script. |
| 14 | Tests | Vitest for ChatGPT/Claude/Gemini adapters + exporters. |
| 15 | Docs polish | README screenshots, CONTRIBUTING, store listing copy. |
| 16 | Store packaging | `dist/chrome.zip` + `dist/firefox.zip`. |

## 🔜 v1.1 — secondary adapters

Each is one commit: copy `chatgpt.ts`, fill selectors, add fixture, register, add host.

- Perplexity (`perplexity.ai`)
- Grok (`grok.com`, `x.com/i/grok`)
- DeepSeek (`chat.deepseek.com`)
- Mistral / Le Chat (`chat.mistral.ai`)
- Kimi (`kimi.com`)
- Meta AI (`meta.ai`)

## 🌌 Backlog (future)

- Optional in-page floating navigator button (off by default).
- Keyboard shortcut (e.g. `Alt+P`) to open popup.
- AI-generated summary/title per prompt cluster.
- Conversation switcher across recent chats.
- Internationalization (i18n).
- Safari packaging via Xcode wrapper.
- Per-platform "report broken selector" support form.
