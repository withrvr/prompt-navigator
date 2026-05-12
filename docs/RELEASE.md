# Release Guide

## How releases work

Pushing a version tag to `main` triggers the **Release** GitHub Actions workflow
(`.github/workflows/release.yml`).  The workflow:

1. Runs lint + typecheck + tests
2. Builds Chrome (`dist/`) and Firefox (`dist-firefox/`) bundles
3. Packages both into versioned zips
4. Creates a GitHub Release with a changelog and the two zips as downloadable assets
5. Sets the release as a pre-release automatically if the tag contains `-` (e.g. `v1.0.0-beta.1`)

---

## Creating a release (developer steps)

```bash
# 1. Make sure you are on main and everything is merged
git checkout main && git pull

# 2. Bump the version in package.json
#    (edit manually or use npm version)
npm version patch   # 0.1.0 → 0.1.1
# or: npm version minor  (0.1.0 → 0.2.0)
# or: npm version major  (0.1.0 → 1.0.0)

# 3. Push the commit AND the new tag
git push origin main --follow-tags
```

That's it — the CI/CD pipeline takes over from here.  Within ~3 minutes the
GitHub Release will appear at:
`https://github.com/withrvr/prompt-navigator/releases`

### Manual re-release (without a new commit)

Use the **workflow_dispatch** trigger in the GitHub Actions UI:

1. Go to **Actions → Release → Run workflow**
2. Enter the existing tag (e.g. `v0.1.0`)
3. Click **Run workflow**

---

## Installing from a GitHub Release (for users)

No store listing yet?  Download the latest zip from the
[Releases page](https://github.com/withrvr/prompt-navigator/releases) and
sideload it yourself.

### Chrome / Edge / Brave (any Chromium-based browser)

1. Download `prompt-navigator-chrome-vX.Y.Z.zip` and **unzip** it to a folder.
2. Open `chrome://extensions` (or `edge://extensions`).
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the unzipped folder.
5. The 🧭 icon appears in your toolbar — pin it for quick access.

> **Updates:** when a new release is available, repeat steps 1–4 and point
> "Load unpacked" at the new folder.  Chrome will replace the old version.

### Firefox

1. Download `prompt-navigator-firefox-vX.Y.Z.zip` (keep it zipped).
2. Open `about:addons`.
3. Click the gear icon → **Install Add-on From File…**
4. Select the `.zip` file.
5. Confirm the permission prompt.

> Firefox accepts signed or temporarily-loaded unsigned add-ons.  For a
> permanent install without re-loading after each browser restart, the
> extension needs to be signed by Mozilla (AMO).  Until the extension is
> published on AMO, use **Firefox Developer Edition** or **Firefox Nightly**
> which allow unsigned add-ons via `about:config →
> xpinstall.signatures.required = false`.

### Safari (macOS only)

Safari extensions must go through Apple's converter tool and Xcode.

```bash
# Clone the repo
git clone https://github.com/withrvr/prompt-navigator.git
cd prompt-navigator
npm install && npm run build && npm run build:safari
# Opens/creates dist-safari/ Xcode project
open dist-safari/*.xcodeproj
```

In Xcode: **Product → Run** (⌘R).  This installs the host app which enables
the Safari extension.  Then in Safari → Settings → Extensions, enable
**Prompt Navigator**.

---

## Versioning convention

| Type | Example | When to use |
|------|---------|-------------|
| Patch | `v0.1.1` | Bug fixes, no new features |
| Minor | `v0.2.0` | New features, backwards-compatible |
| Major | `v1.0.0` | Breaking changes or first stable release |
| Pre-release | `v0.2.0-beta.1` | Testing builds — marked as pre-release on GitHub |
