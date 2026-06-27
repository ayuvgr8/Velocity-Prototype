import { Redis } from "@upstash/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Daily live-AI rate limit — protects the owner's Anthropic key.
// Counts EVERY live Anthropic call (both /api/generate and /api/segment) against
// one shared daily budget (default 15/day, UTC).
//
// Storage: persistent global counter via Upstash Redis (Vercel KV) when its env
// vars are present — a TRUE global daily cap on serverless. Otherwise falls back
// to an in-memory counter (works for local + a warm instance; may reset on cold
// starts). Set DAILY_LIVE_LIMIT to change the cap.
// ─────────────────────────────────────────────────────────────────────────────

export const LIMIT = Number(process.env.DAILY_LIVE_LIMIT ?? 15);

// Support both the Upstash-integration and legacy Vercel-KV variable names.
function makeRedis(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return new Redis({ url, token });
  return null;
}
const redis = makeRedis();
const useKV = !!redis;

export type Usage = {
  limit: number;
  used: number;
  remaining: number;
  date: string;
  store: "kv" | "memory";
};

function utcDate(): string {
  return new Date().toISOString().slice(0, 10);
}
function key(): string {
  return `velocity:live:${utcDate()}`;
}
function shape(used: number): Usage {
  return {
    limit: LIMIT,
    used,
    remaining: Math.max(0, LIMIT - used),
    date: utcDate(),
    store: useKV ? "kv" : "memory",
  };
}

// in-memory fallback (per server instance)
let mem = { date: utcDate(), used: 0 };
function memRollover() {
  const d = utcDate();
  if (mem.date !== d) mem = { date: d, used: 0 };
}

export async function getUsage(): Promise<Usage> {
  if (redis) {
    try {
      const v = await redis.get<number>(key());
      return shape(Number(v ?? 0));
    } catch {
      /* fall through to memory */
    }
  }
  memRollover();
  return shape(mem.used);
}

// Try to consume one unit of budget. Returns ok:false (without consuming) when
// the daily cap is already reached.
export async function consume(): Promise<Usage & { ok: boolean }> {
  if (redis) {
    try {
      const v = await redis.incr(key());
      if (v === 1) {
        // expire 2 days out so the daily key self-cleans
        try {
          await redis.expire(key(), 172800);
        } catch {
          /* best effort */
        }
      }
      if (v > LIMIT) {
        try {
          await redis.decr(key());
        } catch {
          /* best effort */
        }
        return { ok: false, ...shape(LIMIT) };
      }
      return { ok: true, ...shape(v) };
    } catch {
      /* fall through to memory */
    }
  }
  memRollover();
  if (mem.used >= LIMIT) return { ok: false, ...shape(mem.used) };
  mem.used += 1;
  return { ok: true, ...shape(mem.used) };
}
