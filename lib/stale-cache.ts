type CacheEnvelope<T> = {
  data: T;
  expiresAt: number;
  version: 1;
};

const prefix = "market-snap-cache:";

export function readStaleCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`${prefix}${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEnvelope<T>;
    if (parsed.version !== 1 || !parsed.data) return null;
    return parsed.data;
  } catch {
    window.sessionStorage.removeItem(`${prefix}${key}`);
    return null;
  }
}

export function writeStaleCache<T>(key: string, data: T, ttlMs: number): void {
  if (typeof window === "undefined") return;
  try {
    const payload: CacheEnvelope<T> = { data, expiresAt: Date.now() + ttlMs, version: 1 };
    window.sessionStorage.setItem(`${prefix}${key}`, JSON.stringify(payload));
  } catch {
    // Cache failure must never break the shopping flow.
  }
}

export function clearStaleCache(): void {
  if (typeof window === "undefined") return;
  Object.keys(window.sessionStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => window.sessionStorage.removeItem(key));
}
