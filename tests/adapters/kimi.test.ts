import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KimiAdapter } from '@/content/adapters/kimi';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/kimi.html'), 'utf-8');

describe('KimiAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches kimi.com', () => {
    expect(KimiAdapter.matches(new URL('https://kimi.com/'))).toBe(true);
    expect(KimiAdapter.matches(new URL('https://www.kimi.com/'))).toBe(true);
  });

  it('matches kimi.moonshot.cn', () => {
    expect(KimiAdapter.matches(new URL('https://kimi.moonshot.cn/'))).toBe(true);
  });

  it('extracts user messages by data-role', () => {
    const prompts = KimiAdapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('总结这篇文章的要点');
    expect(prompts[1].text).toBe('用英文再说一次');
  });

  it('uses kimi- ID prefix', () => {
    expect(KimiAdapter.getPrompts()[0].id).toMatch(/^kimi-/);
  });
});
