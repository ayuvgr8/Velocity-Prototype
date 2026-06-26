"use client";

import { useState } from "react";
import type { Mode } from "@/lib/engine/client";
import { parseSegment } from "@/lib/engine/client";
import { applySegment } from "@/lib/engine/segment";
import { CUSTOMERS } from "@/lib/data/customers";
import type { SegmentFilter } from "@/lib/types";

const CHIPS = [
  "risky COD orders I shouldn't ship",
  "high-value customers who've gone quiet",
  "customers about to abandon a purchase",
  "anxious first-time buyers",
  "loyal COD buyers worth converting to prepaid",
  "everyone who prefers COD",
];

export function SegmentationBar({
  mode,
  onResult,
}: {
  mode: Mode;
  onResult: (matchedIds: string[], filter: SegmentFilter | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SegmentFilter | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [source, setSource] = useState<Mode | null>(null);
  const [loading, setLoading] = useState(false);

  async function run(q: string) {
    const text = q.trim();
    if (!text) return;
    setQuery(text);
    setLoading(true);
    const { filter: f, source: s } = await parseSegment(text, mode);
    const ids = applySegment(f, CUSTOMERS);
    setFilter(f);
    setMatched(ids);
    setSource(s);
    setLoading(false);
    onResult(ids, f);
  }

  function clear() {
    setQuery("");
    setFilter(null);
    setMatched([]);
    setSource(null);
    onResult([], null);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
          Ask in plain English
        </span>
        <span className="text-[11px] text-muted">
          — no SQL, no rules. AI turns language into a live segment.
        </span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        className="flex gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. risky COD orders I shouldn't ship"
          className="flex-1 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {loading ? "Parsing…" : "Segment →"}
        </button>
        {filter && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-muted hover:text-ink transition"
          >
            Clear
          </button>
        )}
      </form>

      {filter && (
        <div className="mt-3 rounded-lg bg-accent-soft/60 border border-accent/20 px-3.5 py-2.5 text-sm">
          <span className="font-medium text-accent">AI understood:</span>{" "}
          <span className="text-ink">{filter.human_readable}</span>
          <span className="text-muted">
            {" "}
            → {matched.length} {matched.length === 1 ? "match" : "matches"}
          </span>
          <span className="ml-2 inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-muted border border-slate-200">
            {source === "live" ? "parsed live · Claude" : "mock parse"}
          </span>
          {filter.conditions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {filter.conditions.map((c, i) => (
                <code
                  key={i}
                  className="rounded bg-white px-1.5 py-0.5 text-[11px] text-slate-600 border border-slate-200 font-mono"
                >
                  {c.field} {c.op} {String(c.value ?? "")}
                </code>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:border-accent hover:text-accent transition"
          >
            {c}
          </button>
        ))}
      </div>
    </section>
  );
}
