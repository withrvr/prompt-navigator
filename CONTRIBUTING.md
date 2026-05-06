# Contributing

Thanks for being here.

## Branching

- `main` — stable.
- `claude/plan-dev-workflow-a65rM` — current development branch (will be merged to `main` when v1 is store-ready).
- Feature branches: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.

## Commits

Conventional Commits (no scope required):

- `feat: add Gemini adapter`
- `fix: avoid scrollIntoView on Claude`
- `chore: bump @crxjs/vite-plugin`
- `docs: clarify install steps`

One feature = one commit when possible. The phased plan in `docs/ROADMAP.md` is built that way.

## Setup

```bash
npm install
npm run dev
```

In another terminal:

```bash
npm run typecheck   # strict TS
npm run lint
npm run test
```

## Adding a new AI platform adapter

1. Copy `src/content/adapters/chatgpt.ts` → `src/content/adapters/<platform>.ts`.
2. Update `matches()`, the user-prompt selector, and the scroll behavior if needed.
3. Add a fixture under `tests/fixtures/<platform>.html` and a test under `tests/adapters/<platform>.test.ts`.
4. Register the adapter in `src/content/adapters/registry.ts`.
5. Add the host to `SUPPORTED_HOSTS` in `src/manifest.ts`.
6. Update `docs/ROADMAP.md`.

## Code style

- Prettier + ESLint enforced in CI.
- TypeScript strict.
- One responsibility per file. If a function gets longer than ~40 lines, split it.
- Comments only when the **why** isn't obvious from the code — see existing files for tone.

## Pull requests

- Keep PRs small and focused.
- Include a screenshot for any UI change.
- CI must be green: `lint`, `typecheck`, `test`, `build`.
