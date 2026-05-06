// Background service worker.
//
// Phase 1: minimal lifecycle hooks for the install/update events so we can
// later run migrations and seed default settings. Most logic lives in the
// content script and the popup; the worker is a small coordinator.

import browser from 'webextension-polyfill';
import { logger } from '@/shared/logger';

browser.runtime.onInstalled.addListener((details) => {
  logger.info('background: onInstalled', details.reason);
});

browser.runtime.onStartup.addListener(() => {
  logger.info('background: onStartup');
});
