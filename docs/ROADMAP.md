# Roadmap

> Living document. Move items as they ship.

## ✅ Done — v1 (`claude/plan-dev-workflow-a65rM`)

- Scaffold: Vite + TS + @crxjs, MV3 manifest, popup, icons, CI
- ChatGPT, Claude, Gemini adapters
- Click-to-navigate + purple flash highlight (no scrollIntoView)
- Live search + match highlight + count + refresh
- Auto/Dark/Light theme (purple accent, eye-friendly)
- Favorites ⭐ + copy 📋
- Export: JSON · CSV · PDF
- Settings view + Info view + view router
- Non-happy path states (loading / no-prompts / no-match / unsupported / error)
- Firefox build target
- 25 unit tests
- Packaging scripts (`chrome.zip`, `firefox.zip`)

## ✅ Done — v1.1 (`claude/v1.1-features`)

- `PlatformId` expansion + `makeAdapter()` helper
- Perplexity adapter (`perplexity.ai`)
- Grok adapter (`grok.com`, `x.com/i/grok`)
- DeepSeek adapter (`chat.deepseek.com`)
- Mistral / Le Chat adapter (`chat.mistral.ai`)
- Kimi adapter (`kimi.com`, `kimi.moonshot.cn`)
- Meta AI adapter (`meta.ai`)
- Favorites-only filter toggle (⭐ in search bar)
- `Alt+P` keyboard shortcut to open popup
- 57 unit tests total (32 new tests in v1.1)

## ✅ Done — v1.2 (`claude/v1.2-backlog`)

- Per-platform "report broken selector" quick-link (pre-filled GitHub issue)
- Bulk export: select individual prompts then export only those
- Optional in-page floating navigator button (off by default, shadow-DOM isolated iframe panel)
- Drag-to-reorder favorites list (HTML5 drag-and-drop, persisted order)
- Custom keyboard shortcuts per action (1–9 jump, ↑↓ navigate, c/f configurable)
- Safari Web Extension build script (`npm run build:safari`, macOS + Xcode)
- i18n foundation: typed `Strings` interface + `t(key)` lookup, English locale table

## ✅ Done — kanban fixes (`kanban_todo_changes`)

- Fix floating navigator button: move flex layout into shadow root, correct PANEL_H 700→600
- Fix Gemini "you said" prefix: regex catches all variants (`/^you\s+said[:\s,]*/i`)
- Favorites footer consistency: All/None visibility-toggled (no layout shift), matches Footer.ts
- Favorites export menu: wrapped in `footer__right` (position:relative) so dropdown anchors correctly
- GitHub Actions release workflow: tag push → build Chrome+Firefox → publish GitHub Release with versioned zips
- Recent Prompts view: 🕐 button in header, last 10 navigated prompts, platform+age meta, copy, clear

## 🌌 Backlog

- AI-generated summary/title per prompt cluster (heuristic or LLM API)
- Conversation switcher across recent chats
- Full i18n migration: wire `t()` into all remaining UI components
- Additional locale tables (e.g. `fr`, `de`, `zh`, `ja`)
- Per-platform "report broken selector" — also shown from the Info view
- Safari App Store submission guide
