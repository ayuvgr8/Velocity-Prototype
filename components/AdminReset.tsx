"use client";

import { useEffect, useState } from "react";
import { notifyUsageChange } from "@/lib/engine/usage";

// Hidden reset affordance — only renders when the URL has ?admin=<RESET_TOKEN>.
// Posts that token to the protected reset route, then refreshes the counter.
export function AdminReset() {
  const [token, setToken] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("admin");
    if (t) setToken(t);
  }, []);

  if (!token) return null;

  async function reset() {
    setState("busy");
    try {
      const r = await fetch(`/api/usage/reset?token=${encodeURIComponent(token!)}`, {
        method: "POST",
      });
      notifyUsageChange();
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  const label =
    state === "busy" ? "…" : state === "ok" ? "reset ✓" : state === "err" ? "denied ✗" : "↺ reset";
  const tone =
    state === "ok"
      ? "border-green/40 bg-green-soft text-green"
      : state === "err"
      ? "border-danger/40 bg-[#F6E4DE] text-danger"
      : "border-border-2 bg-panel text-muted hover:text-ink";

  return (
    <button
      onClick={reset}
      disabled={state === "busy"}
      title="Reset today's live-AI budget (admin)"
      className={`rounded-[9px] border px-2.5 py-2 font-mono text-[11px] tracking-[0.04em] transition ${tone}`}
    >
      {label}
    </button>
  );
}
