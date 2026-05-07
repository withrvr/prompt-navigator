import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MetaAdapter } from '@/content/adapters/meta';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/meta.html'), 'utf-8');

describe('MetaAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches meta.ai', () => {
    expect(MetaAdapter.matches(new URL('https://meta.ai/'))).toBe(true);
    expect(MetaAdapter.matches(new URL('https://www.meta.ai/'))).toBe(true);
  });

  it('extracts user messages by data-testid', () => {
    const prompts = MetaAdapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('Generate an image of a cat');
    expect(prompts[1].text).toBe('Make it black and white');
  });

  it('uses meta- ID prefix', () => {
    expect(MetaAdapter.getPrompts()[0].id).toMatch(/^meta-/);
  });
});
