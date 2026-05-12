# Contributing to Prompt Navigator

Thanks for being here. This file covers everything you need to go from zero to a running dev build, submit a fix or feature, and understand how the project is structured.

---

## Documentation index

| Doc | What it covers |
|---|---|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Codebase layout, component responsibilities, data flow |
| [docs/ROADMAP.md](./docs/ROADMAP.md) | What's done, what's next, what's in the backlog |
| [docs/STATE.md](./docs/STATE.md) | Current branch status and in-progress work |
| [CHANGELOG.md](./CHANGELOG.md) | Full version history and release notes |
| [docs/RELEASE.md](./docs/RELEASE.md) | How to cut a release (tagging, CI/CD, store submissions) |

---

## Dev setup

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone https://github.com/withrvr/prompt-navigator.git
cd prompt-navigator
npm install
```

### Running in development

```bash
npm run dev
```

This starts Vite with HMR. After each change, go to `chrome://extensions`, find Prompt Navigator, and click the reload icon. The popup picks up the new build immediately.

### All commands

```bash
npm run dev              # Vite dev server with HMR
npm run build            # Production Chrome build → dist/
npm run build:firefox    # Gecko/Firefox build → dist-firefox/
npm run build:safari     # Safari Web Extension (macOS + Xcode required) → dist-safari/
npm run typecheck        # TypeScript strict check (no emit)
npm run lint             # ESLint
npm run format           # Prettier
npm run test             # Unit tests (Vitest + jsdom)
npm run test:watch       # Tests in watch mode
npm run package          # Zip dist/ and dist-firefox/ for distribution
```

### Loading the extension in Chrome

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** → select the `dist/` folder.

For Firefox: `npm run build:firefox` → load `dist-firefox/manifest.json` via `about:debugging`.

---

## Project structure

```
src/
  manifest.ts              # Single source of truth for the MV3 manifest
  content/
    index.ts               # Content script entry point (init, SPA nav, messaging)
    adapters/              # Per-site prompt extractors
      base.ts              # PromptAdapter interface + DomPrompt type
      common.ts            # makeAdapter() helper (shared selector logic)
      registry.ts          # Maps URLs to adapters
      chatgpt.ts · claude.ts · gemini.ts · ...
    floating-button.ts     # Optional in-page floating panel (shadow DOM)
    scroll.ts              # safeScrollTo — cross-site scroll helper
    highlight.ts           # Purple flash ring on navigation
    observer.ts            # Debounced MutationObserver factory
  popup/
    popup.ts               # View router (main / settings / favorites / recent / info)
    views/
      main.ts              # Main prompt list view
      settings.ts          # Settings view
      favorites.ts         # Favorites view
      recent.ts            # Recent prompts view
      info.ts              # Info / about view
    components/            # Reusable UI components (Header, Footer, PromptItem, Tooltip, …)
    styles/
      tokens.css           # Design tokens (spacing, radius, shadows, transitions)
      theme.css            # Dark / light / auto palettes
      popup.css            # Component styles
  shared/
    messages.ts            # Message types between content ↔ popup
    types.ts               # Shared domain types (Prompt, PromptsResponse, …)
    storage.ts             # Settings + favorites persistence (browser.storage.local)
    exporters/             # json.ts · csv.ts · pdf.ts
    browser.ts             # webextension-polyfill import
    logger.ts              # Lightweight debug logger

tests/
  adapters/                # Per-adapter unit tests
  fixtures/                # HTML fixtures for adapter tests
```

---

## Adding support for a new AI platform

1. Copy `src/content/adapters/chatgpt.ts` → `src/content/adapters/<platform>.ts`.
2. Update `matches()` with the platform's hostname(s).
3. Write a CSS selector chain for user message elements (most specific first).
4. Test scroll behaviour — if the site uses a non-standard scroll container, override `scrollTo` in the adapter config.
5. Add a fixture under `tests/fixtures/<platform>.html` and a test under `tests/adapters/<platform>.test.ts`.
6. Register the adapter in `src/content/adapters/registry.ts`.
7. Add the host pattern to `src/manifest.ts` (under `host_permissions` and `content_scripts.matches`).
8. Add the platform to the unsupported-site list in `src/popup/components/EmptyState.ts`.
9. Update `docs/ROADMAP.md` and `CHANGELOG.md`.

---

## Code style

- **TypeScript strict** — no `any`, no implicit returns.
- **Prettier + ESLint** — run `npm run format && npm run lint` before committing. CI enforces both.
- **No frameworks** — pure DOM manipulation. No React, Vue, or similar.
- **One responsibility per file.** If a function exceeds ~40 lines, split it.
- **Comments only when the *why* is non-obvious** — a hidden constraint, a cross-browser quirk, a workaround for a specific bug. Don't explain what the code does.

---

## Branching

- `main` — stable, tagged releases only.
- `claude/plan-dev-workflow-a65rM` — current development base.
- Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) style:

```
feat: add Grok adapter
fix: avoid scrollIntoView on Claude
chore: bump @crxjs/vite-plugin
docs: clarify install steps
```

One logical change per commit when possible.

## Pull requests

- Keep PRs small and focused on one thing.
- Include a screenshot or screen recording for any UI change.
- CI must pass: `lint`, `typecheck`, `test`, `build`.
- Reference any related GitHub issue in the PR description.

---

## Reporting bugs or requesting features

Use the GitHub issue templates:
- **Bug report** — steps to reproduce, browser, extension version, the AI site URL.
- **Feature request** — the problem you're trying to solve and your proposed solution.
- **Other** — anything that doesn't fit the above.

Blank issues are disabled — please use a template so nothing important gets missed.
