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

## 🌌 Backlog

- Optional in-page floating navigator button (off by default)
- AI-generated summary/title per prompt cluster
- Conversation switcher across recent chats
- Internationalization (i18n)
- Safari packaging via Xcode wrapper
- Per-platform "report broken selector" quick-link
- Custom keyboard shortcuts per action (copy, favorite, jump-to-N)
- Bulk export (selected prompts only)
- Drag-to-reorder favorites list
