// Shared text extraction helper for adapters.
//
// jsdom (used in tests) doesn't implement `innerText` because it doesn't do
// layout. We prefer innerText in a real browser (respects CSS visibility and
// br elements) and fall back to textContent so tests work without a DOM shim.

export function extractText(el: Element): string {
  const text =
    (el as HTMLElement).innerText?.trim() ??
    el.textContent?.trim() ??
    '';
  return text;
}
