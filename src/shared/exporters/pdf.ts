// PDF exporter. Uses the browser's built-in print dialog by constructing a
// minimal HTML document in a hidden iframe and triggering window.print().
//
// This avoids bundling jsPDF (adds ~250 KB) while producing a clean, paginated
// document that respects the user's PDF settings. The iframe is removed after
// the print dialog closes.

import type { Prompt } from '../types';

export function exportPdf(prompts: Prompt[], title = 'Prompts'): void {
  const html = buildHtml(prompts, title);

  const iframe = document.createElement('iframe');
  iframe.style.cssText =
    'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:0;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    iframe.remove();
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Allow the iframe to render before printing.
  setTimeout(() => {
    iframe.contentWindow?.print();
    // Remove after a delay so the print dialog has time to grab the content.
    setTimeout(() => iframe.remove(), 1000);
  }, 200);
}

function buildHtml(prompts: Prompt[], title: string): string {
  const rows = prompts
    .map(
      (p) => `
      <tr>
        <td class="num">${p.index + 1}</td>
        <td>${escapeHtml(p.text)}</td>
      </tr>`,
    )
    .join('');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; font-size: 12pt; margin: 2cm; color: #111; }
  h1   { font-size: 16pt; margin-bottom: 1em; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  th   { background: #f5f5f5; font-weight: 600; }
  .num { width: 2em; color: #555; text-align: right; padding-right: 12px; }
  @media print { body { margin: 1.5cm; } }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
<table>
<thead><tr><th>#</th><th>Prompt</th></tr></thead>
<tbody>${rows}</tbody>
</table>
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
