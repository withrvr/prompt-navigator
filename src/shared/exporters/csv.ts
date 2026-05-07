// CSV exporter. Produces RFC 4180-compliant CSV with header row.

import type { Prompt } from '../types';

export function exportCsv(prompts: Prompt[], filename = 'prompts.csv'): void {
  const rows = [
    ['#', 'Prompt'],
    ...prompts.map((p) => [String(p.index + 1), p.text]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  download(blob, filename);
}

/** Wrap in double quotes and escape internal double quotes per RFC 4180. */
function csvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
