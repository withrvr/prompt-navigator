// Produces a Safari Web Extension Xcode project from the Chrome build.
//
// Prerequisites (macOS only):
//   - Xcode 12+ installed
//   - `xcrun safari-web-extension-converter` available
//
// Steps:
//   1. Run the normal Vite build into `dist/`.
//   2. Invoke `xcrun safari-web-extension-converter` to generate an Xcode project.
//   3. Print instructions for opening and building the project in Xcode.
//
// Usage:
//   npm run build:safari
//   # Then open the generated Xcode project and build it for macOS/iOS.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const OUTPUT_DIR = resolve(ROOT, 'dist-safari');

// ── Platform check ─────────────────────────────────────────────────────────

if (process.platform !== 'darwin') {
  console.error(
    'Error: Safari Web Extension conversion requires macOS with Xcode installed.\n' +
      'This script must be run on a Mac.',
  );
  process.exit(1);
}

// ── Check xcrun availability ───────────────────────────────────────────────

try {
  execSync('xcrun --find safari-web-extension-converter', { stdio: 'pipe' });
} catch {
  console.error(
    'Error: `xcrun safari-web-extension-converter` not found.\n' +
      'Install Xcode from the Mac App Store, then run:\n' +
      '  xcode-select --install',
  );
  process.exit(1);
}

// ── Build Chrome dist first ────────────────────────────────────────────────

console.log('Building Chrome dist…');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

if (!existsSync(DIST)) {
  console.error('Error: dist/ not found after build.');
  process.exit(1);
}

// ── Run the converter ──────────────────────────────────────────────────────

console.log('\nConverting to Safari Web Extension…');
console.log(`Output directory: ${OUTPUT_DIR}\n`);

execSync(
  [
    'xcrun safari-web-extension-converter',
    JSON.stringify(DIST),
    '--project-location', JSON.stringify(OUTPUT_DIR),
    '--app-name', '"Prompt Navigator"',
    '--bundle-identifier', 'com.withrvr.prompt-navigator',
    '--swift',
    '--no-open', // Don't auto-open Xcode so CI can run this headlessly
    '--force',   // Overwrite existing project
  ].join(' '),
  { cwd: ROOT, stdio: 'inherit' },
);

// ── Post-conversion instructions ──────────────────────────────────────────

console.log(`
✅ Safari Xcode project created at:
   ${OUTPUT_DIR}/

Next steps:
  1. Open the project in Xcode:
       open "${OUTPUT_DIR}/Prompt Navigator/Prompt Navigator.xcodeproj"

  2. Select your target device (macOS or iOS).

  3. Build and run — Safari will prompt you to enable the extension.

  4. Enable in Safari → Settings → Extensions → Prompt Navigator.

Notes:
  - You need a valid Apple Developer account to sign and distribute.
  - For App Store distribution, archive and upload via Xcode Organizer.
  - The iOS target adds it to Safari on iPhone/iPad (iOS 15+).
`);
