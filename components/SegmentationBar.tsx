"use client";

import { useEffect, useState } from "react";
import type { Mode } from "@/lib/engine/client";
import { parseSegment } from "@/lib/engine/client";
import { applySegment } from "@/lib/engine/segment";
import { CUSTOMERS } from "@/lib/data/customers";
import type { SegmentFilter } from "@/lib/types";

const CHIPS: { label: string; query: string }[] = [
  { label: "loyal COD → prepaid", query: "loyal COD buyers worth converting to prepaid" },
  { label: "gone quiet", query: "high-value customers who've gone quiet" },
  { label: "about to abandon", query: "customers about to abandon a purchase" },
  { label: "risky COD", query: "risky COD orders I shouldn't ship" },
  { label: "anxious 1st-timers", query: "anxious first-time buyers" },
  { label: "ready to buy more", query: "happy customers ready to buy more" },
  { label: "prefers COD", query: "everyone who prefers COD" },
  { label: "churn risk", query: "who's at risk of churning?" },
];

export function SegmentationBar({
  mode,
  onResult,
  trigger,
}: {
  mode: Mode;
  onResult: (matchedIds: string[], filter: SegmentFilter | null) => void;
  trigger?: { query: string; n: number } | null;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SegmentFilter | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Programmatic trigger (used by the guided demo) — run the given query.
  useEffect(() => {
    if (trigger?.query) run(trigger.query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger?.n]);

  async function run(q: string) {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setLoading(true);
    const { filter: f } = await parseSegment(text, mode);
    const ids = applySegment(f, CUSTOMERS);
    setFilter(f);
    setMatched(ids);
    setLoading(false);
    onResult(ids, f);
  }

  return (
    <section className="rounded-2xl border border-border bg-panel px-5 py-[17px]">
      <div className="mb-[11px] flex items-center justify-between">
        <div className="flex items-center gap-[9px]">
          <span className="h-[7px] w-[7px] rounded-full bg-purple-2" />
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted">
            ASK IN PLAIN ENGLISH
          </span>
          <span className="border-l border-border pl-[9px] font-mono text-[10px] tracking-[0.1em] text-muted-2">
            NL → SEGMENT · NO SQL
          </span>
        </div>
        <span
          className={`rounded-full border px-2.5 py-[3px] font-mono text-[10px] tracking-[0.08em] ${
            mode === "live"
              ? "border-purple/30 bg-purple-soft text-purple"
              : "border-border bg-chip text-muted-2"
          }`}
        >
          {mode === "live" ? "● LIVE PARSE" : "MOCK PARSE"}
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        className="flex items-stretch gap-[9px]"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. risky COD orders I shouldn’t ship"
          className="flex-1 rounded-[11px] border border-border-2 bg-white px-4 py-[13px] font-sans text-[15px] text-ink outline-none focus:border-purple"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-[11px] border-none bg-purple px-5 font-display text-[14px] font-semibold text-panel transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-block h-[13px] w-[13px] animate-[vSpin_0.6s_linear_infinite] rounded-full border-2 border-panel/40 border-t-panel" />
          ) : (
            "Parse"
          )}
        </button>
      </form>

      {filter && (
        <div className="mt-[13px] flex flex-wrap items-center gap-2.5 rounded-[11px] border border-border bg-white px-[13px] py-[11px]">
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-purple">
            AI UNDERSTOOD
          </span>
          <span className="text-[13.5px] font-medium text-ink">
            {filter.human_readable}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filter.conditions.map((c, i) => (
              <span
                key={i}
                className="rounded-md border border-border bg-chip px-2 py-[3px] font-mono text-[10.5px] text-muted"
              >
                {c.field} {c.op} {String(c.value ?? "")}
              </span>
            ))}
          </div>
          <span className="ml-auto font-display text-[13px] font-semibold text-orange">
            → {matched.length} highlighted
          </span>
        </div>
      )}

      <div className="mt-[13px] flex flex-wrap gap-[7px]">
        {CHIPS.map((c) => (
          <button
            key={c.label}
            onClick={() => run(c.query)}
            className="rounded-full border border-border bg-chip px-[13px] py-1.5 font-sans text-[12.5px] text-ink-2 transition hover:border-purple hover:text-purple"
          >
            {c.label}
          </button>
        ))}
      </div>
    </section>
  );
}
