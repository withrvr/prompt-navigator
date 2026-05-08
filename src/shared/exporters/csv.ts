// CSV exporter. RFC 4180-compliant CSV with header row and full meta info.

import type { Prompt } from '../types';
import type { ExportContext } from './json';
import { buildFilename } from './json';

export function exportCsv(prompts: Prompt[], ctx: ExportContext = {}, filename?: string): void {
  const { platform, pageUrl, favorites } = ctx;
  const rows: string[][] = [
    ['#', 'Prompt', 'Favorited', 'Platform', 'Source URL'],
    ...prompts.map((p) => [
      String(p.index + 1),
      p.text,
      favorites ? (favorites.has(p.text) ? 'yes' : 'no') : 'no',
      platform ?? '',
      pageUrl ?? '',
    ]),
  ];
  // Add BOM so Excel opens UTF-8 correctly
  const bom = '﻿';
  const csv = bom + rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  download(blob, filename ?? buildFilename(platform, pageUrl, 'csv'));
}

/** Wrap in double-quotes and escape embedded double-quotes per RFC 4180.
 *  Newlines are converted to the literal string \n so Excel shows one row per prompt. */
function csvCell(value: string): string {
  const normalized = value.replace(/\r?\n|\r/g, '\\n');
  const escaped = normalized.replace(/"/g, '""');
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
