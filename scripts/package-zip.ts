// Produces store-ready zip archives from the built extension bundles.
//
// Outputs:
//   dist/chrome.zip  — for Chrome Web Store and Edge Add-ons
//   dist/firefox.zip — for Mozilla AMO
//
// Run after `npm run build` and `npm run build:firefox`.

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const DIST_FF = resolve(ROOT, 'dist-firefox');

function zip(sourceDir: string, outFile: string): void {
  if (!existsSync(sourceDir)) {
    console.error(`Source dir not found: ${sourceDir}. Build it first.`);
    process.exit(1);
  }
  // Use system zip; -r recursive, -j junk paths, -q quiet
  execSync(`cd "${sourceDir}" && zip -rq "${outFile}" .`, { stdio: 'inherit' });
  console.log(`  Created ${outFile}`);
}

zip(DIST, resolve(DIST, 'chrome.zip'));
zip(DIST_FF, resolve(DIST_FF, 'firefox.zip'));
console.log('Done. Store-ready zips produced.');
