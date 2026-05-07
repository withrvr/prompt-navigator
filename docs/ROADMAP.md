# Roadmap

> Living document. Move items as they ship.

## ✅ Done (v1)

- Scaffold: Vite + TS + @crxjs, MV3 manifest, popup, icons, CI
- ChatGPT adapter (`[data-message-author-role="user"]`)
- Click-to-navigate + purple flash highlight
- Claude adapter (`[data-testid="user-message"]`)
- Gemini adapter (`<user-query>` custom element)
- Live search + match highlight + count + refresh
- Auto/Dark/Light theme (purple accent, eye-friendly)
- Favorites ⭐ (persisted) + copy 📋
- Export: JSON · CSV · PDF
- Settings view + Info view + view router
- Non-happy path states (loading / no-prompts / no-match / unsupported / error)
- Firefox build target
- 25 unit tests (Vitest + jsdom)
- Packaging scripts (`chrome.zip`, `firefox.zip`)

## 🔜 v1.1 — Secondary adapters

Each is one commit: copy `chatgpt.ts` template, fill selectors, add fixture + test, register.

| Platform | Host | Status |
|---|---|---|
| Perplexity | `perplexity.ai` | pending |
| Grok | `grok.com`, `x.com` | pending |
| DeepSeek | `chat.deepseek.com` | pending |
| Mistral | `chat.mistral.ai` | pending |
| Kimi | `kimi.com` | pending |
| Meta AI | `meta.ai` | pending |

## 🌌 Backlog

- Optional in-page floating navigator button (off by default)
- Keyboard shortcut (e.g. `Alt+P`) to open popup
- AI-generated summary/title per prompt cluster
- Conversation switcher across recent chats
- Internationalization (i18n)
- Safari packaging via Xcode wrapper
- Per-platform "report broken selector" quick-link
- Favorites filter toggle (show only starred)
