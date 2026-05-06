// Tiny dev/prod-aware logger.
//
// In production builds (`vite build`) `import.meta.env.DEV` is false and
// the log methods become no-ops, which keeps the user's console clean.
// During development everything is forwarded to the real `console` with
// a "[PN]" prefix so messages from the extension are easy to filter.

type LogFn = (...args: unknown[]) => void;

const PREFIX = '[PN]';

const noop: LogFn = () => undefined;

const isDev = (() => {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return false;
  }
})();

function bind(method: 'debug' | 'info' | 'warn' | 'error'): LogFn {
  if (!isDev && (method === 'debug' || method === 'info')) return noop;
  // Bind to keep correct file:line in devtools.
  return console[method].bind(console, PREFIX);
}

export const logger = {
  debug: bind('debug'),
  info: bind('info'),
  warn: bind('warn'),
  error: bind('error'),
};
