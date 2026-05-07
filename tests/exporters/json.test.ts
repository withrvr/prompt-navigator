import { describe, it, expect } from 'vitest';
import type { Prompt } from '@/shared/types';

// Test the JSON serialization logic in isolation.
function buildJson(prompts: Prompt[]): string {
  const data = prompts.map((p) => ({ index: p.index + 1, text: p.text }));
  return JSON.stringify(data, null, 2);
}

const PROMPTS: Prompt[] = [
  { id: 'a-0', index: 0, text: 'First prompt', length: 12 },
  { id: 'a-1', index: 1, text: 'Second prompt', length: 13 },
];

describe('JSON exporter logic', () => {
  it('produces valid JSON', () => {
    expect(() => JSON.parse(buildJson(PROMPTS))).not.toThrow();
  });

  it('outputs an array of the correct length', () => {
    const data = JSON.parse(buildJson(PROMPTS)) as unknown[];
    expect(data).toHaveLength(PROMPTS.length);
  });

  it('uses 1-based index in output', () => {
    const [first] = JSON.parse(buildJson(PROMPTS)) as Array<{ index: number; text: string }>;
    expect(first.index).toBe(1);
  });

  it('preserves full prompt text', () => {
    const items = JSON.parse(buildJson(PROMPTS)) as Array<{ index: number; text: string }>;
    expect(items[1].text).toBe('Second prompt');
  });
});
