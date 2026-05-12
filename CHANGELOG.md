# Changelog

All notable changes to Prompt Navigator are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-05-12

### New features
- **Hover tooltip** — hover over any prompt to read the full text; no more guessing from the truncated preview
- **Favorites & Refresh in header** — ⭐ and 🔄 buttons are permanently visible in the main header alongside Recent and Settings
- **Recent Prompts view** — 🕐 button opens a view of the last 10 navigated prompts with platform, age, and copy action
- **Floating navigator auto-refresh** — when the page URL changes (SPA navigation, new chat), the floating panel automatically re-fetches the prompt list without user interaction
- **Unsupported-site inline list** — when the extension is opened on a site it doesn't support, it now shows an inline list of all 9 supported platforms directly in the popup, at consistent popup size
- **GitHub Actions release workflow** — push a version tag and the CI pipeline automatically builds Chrome + Firefox zips and publishes a GitHub Release

### New site support
- **Perplexity** (`perplexity.ai`) — 7-selector chain covering all known DOM variants
- **Grok** (`grok.com`, `x.com/i/grok`) — 7-selector chain; handles both domains and conversation query-param URLs
- **DeepSeek** (`chat.deepseek.com`) — 9-selector chain; path exclusion to avoid non-chat pages
- **Mistral / Le Chat** (`chat.mistral.ai`) — 8-selector chain
- **Kimi** (`kimi.com`, `kimi.moonshot.cn`) — 8-selector chain
- **Meta AI** (`meta.ai`) — 9-selector chain including "outgoing" message class

### Bug fixes
- **Kimi scroll** — prompts are now highlighted and scrolled-to correctly; uses `scrollIntoView` to work around Kimi's `overflow:overlay` scroll container
- **Gemini "You said:" prefix** — stripped reliably via regex (`/^you\s+said[:\s,]*/i`), covering all capitalisation and punctuation variants
- **Floating navigator layout** — flex layout moved into shadow root so the iframe panel appears above the toggle button correctly
- **Favorites footer consistency** — All/None buttons use `visibility: hidden` toggle (no layout shift); matches main footer behaviour
- **Favorites export menu** — dropdown now anchors to the correct parent (`position: relative` wrapper in footer)

### Infrastructure
- GitHub issue templates: bug report, feature request, other (blank issues disabled)
- `scroll.ts`: recognises `overflow: overlay` (Chrome-only deprecated value) as a scrollable container

---

## [0.1.0] — initial release

### Features
- **ChatGPT, Claude, Gemini** adapters
- Click-to-navigate with purple flash highlight
- Live search with match highlight and count
- Favorites ⭐ — starred across popup close
- Copy 📋 per prompt
- Export: JSON · CSV · PDF
- Auto / Dark / Light theme (purple accent)
- Optional in-page floating navigator button (shadow-DOM isolated iframe)
- Bulk export — select individual prompts to export
- Drag-to-reorder favorites list
- Custom keyboard shortcuts per action
- `Alt+P` keyboard shortcut to open popup from anywhere
- Firefox build target
- Safari Web Extension build script
- i18n foundation (typed `Strings` interface + `t()` lookup)
- 57 unit tests
