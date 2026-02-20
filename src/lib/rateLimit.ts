/**
 * In-memory rate limit for API routes (per-instance; fine for MVP).
 * Key format: e.g. "signin:192.168.1.1"
 */
const store = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL_MS = 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function scheduleCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
}

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): { ok: boolean } {
  if (process.env.NODE_ENV === "development") return { ok: true };
  scheduleCleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > options.limit) {
    return { ok: false };
  }
  return { ok: true };
}
