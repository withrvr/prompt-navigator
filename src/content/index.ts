// Content script entry. Phase 1 placeholder — Phase 2 will:
//   - select an adapter from the registry by URL
//   - extract user prompts from the page
//   - debounce DOM mutations so the popup stays in sync
//   - respond to GET_PROMPTS / SCROLL_TO messages from the popup

import { logger } from '@/shared/logger';

logger.debug('content: bootstrap', location.href);
