# 🧭 Prompt Navigator

> Jump to any prompt in your AI chat. Lists, searches, favorites, and exports your messages on **ChatGPT**, **Claude**, and **Gemini**.

A clean, fast, eye-friendly browser extension. Click the toolbar icon → see every message you sent in this conversation → click any item to scroll to it instantly.

**No in-page clutter.** Nothing is rendered on the AI app page you're using. The panel appears only when you click the icon.

---

## Features

| Feature | Details |
|---|---|
| 🧭 Navigate | Click any prompt to scroll to it — with a purple ring flash to confirm |
| 🔍 Search | Live substring filter with match highlighting |
| 🔄 Refresh | Manual refresh button to re-scan after the page mutates |
| ⭐ Favorites | Star/unstar prompts; persisted across popup close |
| 📋 Copy | One-click copy to clipboard per prompt |
| 📤 Export | JSON · CSV · PDF (via browser print dialog) |
| 🌗 Theme | Auto (OS) / Dark / Light — purple accent, never pure black/white |
| ⚙️ Settings | Theme, support link, GitHub — accessible from the header |
| ⚠️ Error states | Friendly messages for unsupported sites, empty chats, load errors |

**Supported platforms (v1):** ChatGPT · Claude · Gemini  
**v1.1:** Perplexity · Grok · DeepSeek · Mistral · Kimi · Meta AI

---

## Install

### Option A — Chrome Web Store / Edge Add-ons *(coming soon)*

Click **Add to Chrome** / **Add to Edge** from the store listing.

### Option B — Unpack from GitHub (all Chromium browsers)

Supports Chrome, Edge, Brave, Opera, Vivaldi.

```bash
# 1. Download or clone this repo
git clone https://github.com/withrvr/prompt-navigator.git
cd prompt-navigator

# 2. Install dependencies and build
npm install
npm run build

# 3. Load in browser
#    Chrome/Edge: open chrome://extensions  (or edge://extensions)
#    Toggle "Developer mode" (top-right)
#    Click "Load unpacked" → select the dist/ folder
```

### Option C — Firefox

```bash
npm install
npm run build:firefox

# Load dist-firefox/ as a Temporary Add-on:
# Open about:debugging#/runtime/this-firefox
# Click "Load Temporary Add-on" → select dist-firefox/manifest.json
```

> **Note:** Temporary add-ons are removed when Firefox restarts. For permanent installation, the extension must be signed by Mozilla AMO.

---

## Usage

1. Open ChatGPT, Claude, or Gemini and start (or resume) a conversation.
2. Click the **🧭** icon in your browser toolbar.
3. Your prompts appear as a numbered list — click any to jump to it.
4. Use the **search bar** to filter by keyword.
5. Click **⭐** to favorite a prompt (remembered next time).
6. Click **📋** to copy a prompt to the clipboard.
7. Click **📤 Export** to download as JSON, CSV, or PDF.
8. Click **⚙️** (gear) to open Settings and change the theme.
9. Click **🔄** to refresh the list after the page has loaded new turns.

---

## Develop

```bash
npm install
npm run dev        # Vite HMR — reload the extension in Chrome to see changes
npm run typecheck
npm run lint
npm run test       # 25 unit tests (Vitest + jsdom)
npm run build      # production Chrome build → dist/
npm run build:firefox  # Gecko build → dist-firefox/
```

## Contribute

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Roadmap

See [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## License

MIT © [withrvr](https://github.com/withrvr)
