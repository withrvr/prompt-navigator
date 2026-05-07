import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GrokAdapter } from '@/content/adapters/grok';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/grok.html'), 'utf-8');

describe('GrokAdapter', () => {
  const adapter = new GrokAdapter();

  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches grok.com', () => {
    expect(adapter.matches(new URL('https://grok.com/'))).toBe(true);
    expect(adapter.matches(new URL('https://www.grok.com/chat/abc'))).toBe(true);
  });

  it('matches x.com/i/grok', () => {
    expect(adapter.matches(new URL('https://x.com/i/grok'))).toBe(true);
    expect(adapter.matches(new URL('https://twitter.com/i/grok'))).toBe(true);
  });

  it('does not match x.com root', () => {
    expect(adapter.matches(new URL('https://x.com/home'))).toBe(false);
  });

  it('extracts only user (right-aligned) bubbles', () => {
    const prompts = adapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('Why is the sky blue?');
    expect(prompts[1].text).toBe("Explain like I'm five");
  });

  it('skips empty bubbles', () => {
    expect(adapter.getPrompts().every((p) => p.text.trim().length > 0)).toBe(true);
  });

  it('uses grok- ID prefix', () => {
    const [first] = adapter.getPrompts();
    expect(first.id).toMatch(/^grok-/);
  });
});
