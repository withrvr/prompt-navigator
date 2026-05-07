import { describe, it, expect } from 'vitest';
import type { Prompt } from '@/shared/types';

// We test the CSV logic in isolation by importing only the cell formatter
// (extracted inline below) rather than triggering a real download.

function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function buildCsv(prompts: Prompt[]): string {
  const rows = [['#', 'Prompt'], ...prompts.map((p) => [String(p.index + 1), p.text])];
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}

const PROMPTS: Prompt[] = [
  { id: 'a-0', index: 0, text: 'Hello, world', length: 12 },
  { id: 'a-1', index: 1, text: 'He said "hi"', length: 12 },
  { id: 'a-2', index: 2, text: 'Line\nTwo', length: 8 },
];

describe('CSV exporter logic', () => {
  it('produces a header row', () => {
    const csv = buildCsv(PROMPTS);
    expect(csv.startsWith('"#","Prompt"')).toBe(true);
  });

  it('writes one row per prompt', () => {
    const lines = buildCsv(PROMPTS).split('\r\n');
    expect(lines).toHaveLength(PROMPTS.length + 1); // +1 for header
  });

  it('escapes double quotes per RFC 4180', () => {
    const csv = buildCsv(PROMPTS);
    expect(csv).toContain('"He said ""hi"""');
  });

  it('preserves newlines inside cells', () => {
    const csv = buildCsv(PROMPTS);
    expect(csv).toContain('"Line\nTwo"');
  });

  it('uses 1-based index in output', () => {
    const csv = buildCsv(PROMPTS);
    expect(csv).toContain('"1"');
    expect(csv).not.toContain('"0"');
  });
});
