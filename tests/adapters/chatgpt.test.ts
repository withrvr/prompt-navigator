import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ChatGptAdapter } from '@/content/adapters/chatgpt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/chatgpt.html'), 'utf-8');

describe('ChatGptAdapter', () => {
  const adapter = new ChatGptAdapter();

  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches chatgpt.com', () => {
    expect(adapter.matches(new URL('https://chatgpt.com/c/abc'))).toBe(true);
  });

  it('matches chat.openai.com', () => {
    expect(adapter.matches(new URL('https://chat.openai.com/c/abc'))).toBe(true);
  });

  it('does not match other sites', () => {
    expect(adapter.matches(new URL('https://claude.ai/'))).toBe(false);
  });

  it('extracts only non-empty user prompts', () => {
    const prompts = adapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('Hello, world');
    expect(prompts[1].text).toBe('What is TypeScript?');
  });

  it('assigns 0-based sequential indices', () => {
    const prompts = adapter.getPrompts();
    expect(prompts[0].index).toBe(0);
    expect(prompts[1].index).toBe(1);
  });

  it('generates stable IDs', () => {
    const [a, b] = adapter.getPrompts();
    expect(a.id).toBe('chatgpt-0');
    expect(b.id).toBe('chatgpt-1');
  });

  it('reports correct text length', () => {
    const [p] = adapter.getPrompts();
    expect(p.length).toBe(p.text.length);
  });
});
