import { describe, it, expect } from 'vitest';
import { filterPrompts, filterFavorites } from '@/popup/components/SearchBar';
import type { Prompt } from '@/shared/types';

const PROMPTS: Prompt[] = [
  { id: 'a-0', index: 0, text: 'Hello world', length: 11 },
  { id: 'a-1', index: 1, text: 'Goodbye world', length: 13 },
  { id: 'a-2', index: 2, text: 'TypeScript is cool', length: 18 },
];

describe('filterPrompts', () => {
  it('returns all prompts for empty query', () => {
    expect(filterPrompts(PROMPTS, '')).toHaveLength(3);
    expect(filterPrompts(PROMPTS, '   ')).toHaveLength(3);
  });

  it('matches case-insensitive substrings', () => {
    expect(filterPrompts(PROMPTS, 'WORLD')).toHaveLength(2);
  });

  it('returns empty when no match', () => {
    expect(filterPrompts(PROMPTS, 'rust')).toHaveLength(0);
  });
});

describe('filterFavorites', () => {
  it('keeps only prompts whose text is in the favorites set', () => {
    const favs = new Set<string>(['Hello world', 'TypeScript is cool']);
    const filtered = filterFavorites(PROMPTS, favs);
    expect(filtered).toHaveLength(2);
    expect(filtered[0].text).toBe('Hello world');
    expect(filtered[1].text).toBe('TypeScript is cool');
  });

  it('returns empty when favorites set is empty', () => {
    expect(filterFavorites(PROMPTS, new Set())).toHaveLength(0);
  });
});
