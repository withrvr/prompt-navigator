// PDF exporter. Opens a printable HTML page in a new tab (more reliable than
// the iframe approach in extension contexts). The page auto-triggers print.

import type { Prompt } from '../types';
import type { ExportContext } from './json';
import { buildFilename } from './json';

export function exportPdf(prompts: Prompt[], ctx: ExportContext = {}): void {
  const { platform, pageUrl, favorites } = ctx;
  const title = `${platform ?? 'Chat'} Prompts`;
  const html = buildHtml(prompts, title, pageUrl, favorites);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  // Clean up blob URL after tab has loaded
  if (win) {
    win.addEventListener('load', () => URL.revokeObjectURL(url), { once: true });
  } else {
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
  void buildFilename(platform, pageUrl, 'pdf'); // keep import used
}

function buildHtml(
  prompts: Prompt[],
  title: string,
  pageUrl?: string,
  favorites?: Set<string>,
): string {
  const rows = prompts
    .map((p) => {
      const fav = favorites?.has(p.text) ? ' ⭐' : '';
      return `
      <tr>
        <td class="num">${p.index + 1}</td>
        <td>${escapeHtml(p.text)}${fav}</td>
      </tr>`;
    })
    .join('');

  const meta = pageUrl
    ? `<p class="meta"><strong>Source:</strong> <a href="${escapeHtml(pageUrl)}">${escapeHtml(pageUrl)}</a></p>`
    : '';

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; font-size: 12pt; margin: 2cm; color: #111; }
  h1   { font-size: 16pt; margin-bottom: 0.3em; }
  .meta { font-size: 10pt; color: #555; margin-bottom: 1em; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  th   { background: #f5f5f5; font-weight: 600; }
  .num { width: 2em; color: #555; text-align: right; padding-right: 12px; }
  @media print { body { margin: 1.5cm; } }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${meta}
<table>
<thead><tr><th>#</th><th>Prompt</th></tr></thead>
<tbody>${rows}</tbody>
</table>
<script>window.addEventListener('load', () => window.print());<\/script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
