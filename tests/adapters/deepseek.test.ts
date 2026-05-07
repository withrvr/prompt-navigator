import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DeepSeekAdapter } from '@/content/adapters/deepseek';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/deepseek.html'), 'utf-8');

describe('DeepSeekAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches chat.deepseek.com', () => {
    expect(DeepSeekAdapter.matches(new URL('https://chat.deepseek.com/'))).toBe(true);
  });

  it('does not match other sites', () => {
    expect(DeepSeekAdapter.matches(new URL('https://chatgpt.com/'))).toBe(false);
  });

  it('extracts user messages by class*="_user_" pattern', () => {
    const prompts = DeepSeekAdapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('Write a Python script to sort a list');
    expect(prompts[1].text).toBe('Make it descending');
  });

  it('skips whitespace-only entries', () => {
    expect(DeepSeekAdapter.getPrompts()).toHaveLength(2);
  });

  it('uses deepseek- ID prefix', () => {
    expect(DeepSeekAdapter.getPrompts()[0].id).toMatch(/^deepseek-/);
  });
});
