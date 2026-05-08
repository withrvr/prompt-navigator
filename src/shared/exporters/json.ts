// JSON exporter. Produces a pretty-printed JSON array with full meta info.

import type { Prompt } from '../types';

export interface ExportContext {
  platform?: string;
  pageUrl?: string;
  favorites?: Set<string>;
}

export function exportJson(prompts: Prompt[], ctx: ExportContext = {}, filename?: string): void {
  const { platform, pageUrl, favorites } = ctx;
  const data = {
    exported_at: new Date().toISOString(),
    platform: platform ?? 'unknown',
    source_url: pageUrl ?? '',
    total: prompts.length,
    prompts: prompts.map((p) => ({
      index: p.index + 1,
      text: p.text,
      favorited: favorites ? favorites.has(p.text) : false,
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  download(blob, filename ?? buildFilename(platform, pageUrl, 'json'));
}

export function buildFilename(platform: string | undefined, pageUrl: string | undefined, ext: string): string {
  const site = platform ?? 'chat';
  const uuid = pageUrl ? extractUuid(pageUrl) : '';
  return uuid ? `prompt_${site}_${uuid}.${ext}` : `prompt_${site}.${ext}`;
}

function extractUuid(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const segments = pathname.split('/').filter(Boolean);
    // Take last segment that looks like a UUID or a long ID
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      if (seg.length >= 8 && /^[\w-]+$/.test(seg)) return seg.slice(0, 36);
    }
  } catch {
    // ignore
  }
  return '';
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
