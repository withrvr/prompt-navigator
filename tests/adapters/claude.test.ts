import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ClaudeAdapter } from '@/content/adapters/claude';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/claude.html'), 'utf-8');

describe('ClaudeAdapter', () => {
  const adapter = new ClaudeAdapter();

  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches claude.ai', () => {
    expect(adapter.matches(new URL('https://claude.ai/chat/abc'))).toBe(true);
  });

  it('does not match other sites', () => {
    expect(adapter.matches(new URL('https://chatgpt.com/'))).toBe(false);
  });

  it('extracts only non-empty user messages', () => {
    const prompts = adapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('Explain recursion');
    expect(prompts[1].text).toBe('Give me an example in Python');
  });

  it('assigns sequential indices', () => {
    const [a, b] = adapter.getPrompts();
    expect(a.index).toBe(0);
    expect(b.index).toBe(1);
  });
});
