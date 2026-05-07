// Typed message protocol between popup ⇄ content script.
//
// Every message has a discriminated `type` and a typed `response`. Use the
// helpers `send()` / `respond()` instead of raw `browser.tabs.sendMessage`
// to keep the contract enforced at compile time.

import type { Prompt, PromptsResponse } from './types';

export type Message =
  | { type: 'PING' }
  | { type: 'GET_PROMPTS' }
  | { type: 'SCROLL_TO'; promptId: string };

export type ResponseFor<M extends Message> = M extends { type: 'PING' }
  ? { ok: true }
  : M extends { type: 'GET_PROMPTS' }
    ? PromptsResponse
    : M extends { type: 'SCROLL_TO' }
      ? { ok: boolean }
      : never;

export type AnyResponse =
  | { ok: true }
  | PromptsResponse
  | { ok: boolean };

export type { Prompt };
