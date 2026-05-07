// Debounced MutationObserver helper.
//
// AI chat apps batch a lot of DOM updates per turn (token streaming,
// re-renders, syntax highlighting). We debounce so the popup only resyncs
// once the burst settles, keeping the content script cheap and the popup
// listing stable.

const DEFAULT_DEBOUNCE_MS = 250;

/**
 * Watch the document for any subtree changes and call `onChange` once the
 * burst quiets down. Returns a disposer.
 */
export function observeDom(
  onChange: () => void,
  options: { debounceMs?: number; root?: Node } = {},
): () => void {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const root = options.root ?? document.body;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onChange();
    }, debounceMs);
  };

  const observer = new MutationObserver(trigger);
  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  return () => {
    if (timer) clearTimeout(timer);
    observer.disconnect();
  };
}
