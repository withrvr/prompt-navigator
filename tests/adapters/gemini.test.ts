import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GeminiAdapter } from '@/content/adapters/gemini';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/gemini.html'), 'utf-8');

describe('GeminiAdapter', () => {
  const adapter = new GeminiAdapter();

  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches gemini.google.com', () => {
    expect(adapter.matches(new URL('https://gemini.google.com/app'))).toBe(true);
  });

  it('does not match other sites', () => {
    expect(adapter.matches(new URL('https://claude.ai/'))).toBe(false);
  });

  it('extracts text from .query-text child', () => {
    const [first] = adapter.getPrompts();
    expect(first.text).toBe('Write a haiku about TypeScript');
  });

  it('falls back to <p> child when .query-text absent', () => {
    const [, second] = adapter.getPrompts();
    expect(second.text).toBe('Explain async/await');
  });

  it('skips whitespace-only entries', () => {
    expect(adapter.getPrompts()).toHaveLength(2);
  });
});
