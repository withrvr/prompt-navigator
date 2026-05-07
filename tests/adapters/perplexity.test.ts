import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PerplexityAdapter } from '@/content/adapters/perplexity';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/perplexity.html'), 'utf-8');

describe('PerplexityAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches perplexity.ai', () => {
    expect(PerplexityAdapter.matches(new URL('https://www.perplexity.ai/'))).toBe(true);
    expect(PerplexityAdapter.matches(new URL('https://perplexity.ai/search/abc'))).toBe(true);
  });

  it('does not match other sites', () => {
    expect(PerplexityAdapter.matches(new URL('https://chatgpt.com/'))).toBe(false);
  });

  it('extracts user queries from .group/query-h1 headings', () => {
    const prompts = PerplexityAdapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('What is the capital of France?');
    expect(prompts[1].text).toBe('Tell me about the Eiffel Tower');
  });

  it('skips whitespace-only entries', () => {
    expect(PerplexityAdapter.getPrompts()).toHaveLength(2);
  });

  it('uses perplexity- prefix for IDs', () => {
    const [a] = PerplexityAdapter.getPrompts();
    expect(a.id).toMatch(/^perplexity-/);
  });
});
