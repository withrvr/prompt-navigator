import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MistralAdapter } from '@/content/adapters/mistral';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(resolve(__dirname, '../fixtures/mistral.html'), 'utf-8');

describe('MistralAdapter', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  it('matches chat.mistral.ai', () => {
    expect(MistralAdapter.matches(new URL('https://chat.mistral.ai/'))).toBe(true);
  });

  it('does not match unrelated sites', () => {
    expect(MistralAdapter.matches(new URL('https://chatgpt.com/'))).toBe(false);
  });

  it('extracts user messages by data-message-role', () => {
    const prompts = MistralAdapter.getPrompts();
    expect(prompts).toHaveLength(2);
    expect(prompts[0].text).toBe('What is Mistral 7B?');
    expect(prompts[1].text).toBe('Compare it with Llama 3');
  });

  it('uses mistral- ID prefix', () => {
    expect(MistralAdapter.getPrompts()[0].id).toMatch(/^mistral-/);
  });
});
