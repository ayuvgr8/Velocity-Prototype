"use client";

import { useEffect, useState } from "react";
import { fetchUsage, onUsageChange, type Usage } from "@/lib/engine/usage";

// Header pill showing how many live-AI calls remain in today's budget.
export function LiveUsageBadge() {
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    let active = true;
    const load = () => fetchUsage().then((u) => active && u && setUsage(u));
    load();
    const off = onUsageChange(load);
    return () => {
      active = false;
      off();
    };
  }, []);

  if (!usage) return null;

  const { remaining, limit } = usage;
  const tone =
    remaining === 0
      ? "border-danger/30 bg-[#F6E4DE] text-danger"
      : remaining <= 3
      ? "border-orange/30 bg-[#F6E9DD] text-orange-deep"
      : "border-border bg-chip text-muted";

  const persistent = usage.store === "kv";

  return (
    <span
      title={
        `Daily live-AI budget — ${remaining} of ${limit} calls left today (resets 00:00 UTC). Mock mode is unlimited.\n` +
        (persistent
          ? "Counter: Upstash Redis (persistent global cap)."
          : "Counter: in-memory (best-effort; may reset on cold starts). Add the Upstash integration for a true global cap.")
      }
      className={`hidden items-center gap-1.5 rounded-[9px] border px-[10px] py-2 font-mono text-[11px] tracking-[0.04em] sm:inline-flex ${tone}`}
    >
      <span
        className={`h-[6px] w-[6px] rounded-full ${
          remaining === 0
            ? "bg-danger"
            : remaining <= 3
            ? "bg-orange"
            : "bg-green"
        }`}
      />
      {remaining}/{limit} live
      <span
        className={`rounded-[4px] px-1 py-px text-[8.5px] tracking-[0.08em] ${
          persistent
            ? "bg-green-soft text-green"
            : "bg-chip text-muted-2"
        }`}
      >
        {persistent ? "KV" : "MEM"}
      </span>
    </span>
  );
}
