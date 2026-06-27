// Client-side helper for the live-AI usage counter.
export type Usage = {
  limit: number;
  used: number;
  remaining: number;
  date: string;
  store?: "kv" | "memory";
};

const listeners = new Set<() => void>();

// Subscribe to "usage changed" pings (fired after every live call).
export function onUsageChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function notifyUsageChange(): void {
  listeners.forEach((f) => f());
}

export async function fetchUsage(): Promise<Usage | null> {
  try {
    const r = await fetch("/api/usage", { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as Usage;
  } catch {
    return null;
  }
}
