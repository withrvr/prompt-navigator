// JSON exporter. Produces a pretty-printed JSON array of prompt objects.

import type { Prompt } from '../types';

export function exportJson(prompts: Prompt[], filename = 'prompts.json'): void {
  const data = prompts.map((p) => ({ index: p.index + 1, text: p.text }));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  download(blob, filename);
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
