# 🧭 Prompt Navigator

> Jump to any prompt in your AI chat. Lists, searches, favorites, and exports your messages on **ChatGPT**, **Claude**, and **Gemini** — and degrades gracefully on any other site.

A clean, fast, eye-friendly browser extension. Click the toolbar icon → see every message you sent in this conversation → click any item to scroll to it. That's it. No in-page chrome cluttering the AI app you actually want to use.

## Status

Early development. See [`docs/STATE.md`](./docs/STATE.md) for what's done and what's next, and [`docs/ROADMAP.md`](./docs/ROADMAP.md) for the bigger picture.

## Features (v1 target)

- ✅ Lists every user prompt in the current chat
- ✅ Click to scroll to that prompt
- ✅ Live search across prompts
- ✅ Refresh + total/match counters
- ✅ Auto / Light / Dark theme (purple accent — easy on the eyes, never pure black/white)
- ✅ Favorite ⭐ + copy 📋 per prompt
- ✅ Export to JSON / CSV / PDF
- ✅ Settings + Info panels with support link
- ✅ Friendly empty states for unsupported sites and zero-prompt chats
- ✅ Cross-browser: Chrome, Edge, Brave, Opera, Firefox

Planned for v1.1: Perplexity, Grok, DeepSeek, Mistral, Kimi, Meta AI.

## Install (development)

> Requires Node 20+ and npm.

```bash
npm install
npm run build
```

### Chrome / Edge / Brave / Opera

1. Open `chrome://extensions`.
2. Toggle **Developer mode**.
3. **Load unpacked** → select the `dist/` folder.

### Firefox

```bash
npm run build:firefox
```

1. Open `about:debugging#/runtime/this-firefox`.
2. **Load Temporary Add-on** → select `dist-firefox/manifest.json`.

## Develop

```bash
npm run dev        # Vite + HMR
npm run typecheck
npm run lint
npm run test
```

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

MIT
