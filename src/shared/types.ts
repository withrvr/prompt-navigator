// Shared types used across the popup, content script, and background.

/**
 * One user prompt extracted from the host page. Identified by `id` so the
 * popup can map clicks back to the live DOM element through the content
 * script even after re-renders.
 */
export interface Prompt {
  /** Stable identifier for this prompt within the conversation. */
  id: string;
  /** 0-based position in the conversation. */
  index: number;
  /** Trimmed text content. May be truncated for display by the popup. */
  text: string;
  /**
   * Original full text length (before any popup-side truncation). Useful
   * for showing previews vs full content.
   */
  length: number;
}

/** Identifies which AI platform the active tab is on. */
export type PlatformId =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'perplexity'
  | 'grok'
  | 'deepseek'
  | 'mistral'
  | 'kimi'
  | 'meta'
  | 'unknown';

/**
 * Result of a `GET_PROMPTS` request — either the platform was recognized
 * and prompts were extracted, or we explain why we have nothing to show.
 */
export interface PromptsResponse {
  platform: PlatformId;
  prompts: Prompt[];
  url: string;
}
