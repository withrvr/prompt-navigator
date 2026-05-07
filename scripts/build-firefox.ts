// Produces a Firefox (Gecko) compatible extension bundle in dist-firefox/.
//
// Steps:
//   1. Run the normal Vite build into `dist/`.
//   2. Copy dist/ → dist-firefox/.
//   3. Patch the manifest: replace service_worker with a scripts[] event page,
//      add browser_specific_settings, remove action.default_popup service type.

import { execSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const DIST_FF = resolve(ROOT, 'dist-firefox');

console.log('Building Chrome dist first…');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

console.log('Copying to dist-firefox…');
mkdirSync(DIST_FF, { recursive: true });
cpSync(DIST, DIST_FF, { recursive: true });

// Patch manifest
const manifestPath = resolve(DIST_FF, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Record<string, unknown>;

// Firefox doesn't support service_worker in MV3 yet (Jan 2026 rollout).
// We keep a module script array pointing at the same bundle entry.
const bg = manifest.background as Record<string, unknown> | undefined;
if (bg?.service_worker) {
  const swPath = bg.service_worker as string;
  delete bg.service_worker;
  delete bg.type;
  bg.scripts = [swPath];
}

// Required for Firefox AMO review
(manifest as Record<string, unknown>).browser_specific_settings = {
  gecko: {
    id: 'prompt-navigator@withrvr',
    strict_min_version: '109.0',
  },
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('dist-firefox/manifest.json patched for Gecko.');
console.log('Done. Load dist-firefox/ in about:debugging → This Firefox → Load Temporary Add-on.');
