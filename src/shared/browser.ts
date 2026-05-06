// Cross-browser API shim. webextension-polyfill exposes a promise-based
// `browser.*` namespace on Chromium too, so the rest of the codebase
// imports from here and stays browser-agnostic.

import browser from 'webextension-polyfill';

export { browser };
export default browser;
