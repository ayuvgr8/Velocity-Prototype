"use client";

import { CUSTOMERS } from "@/lib/data/customers";
import { getAgent } from "@/lib/data/agents";
import { initials } from "@/lib/format";

export function CustomerRail({
  selectedId,
  matchedIds,
  onSelect,
}: {
  selectedId: string | null;
  matchedIds: string[];
  onSelect: (id: string) => void;
}) {
  const hasSegment = matchedIds.length > 0;

  return (
    <div>
      <div className="mb-[11px] ml-0.5 mt-0.5 font-mono text-[10.5px] tracking-[0.14em] text-muted-2">
        CUSTOMERS · 6 PERSONAS
      </div>
      <div className="flex flex-col gap-[9px]">
        {CUSTOMERS.map((c) => {
          const isSelected = selectedId === c.customer_id;
          const isMatch = matchedIds.includes(c.customer_id);
          const dimmed = hasSegment && !isMatch;
          const agent = getAgent(c.expected_agent);
          const isMoat = !!c.traits.cross_brand_return_signal;

          return (
            <button
              key={c.customer_id}
              onClick={() => onSelect(c.customer_id)}
              style={{ opacity: dimmed ? 0.4 : 1 }}
              className={`relative flex items-start gap-3 rounded-[13px] border px-3.5 py-3 text-left transition ${
                isSelected
                  ? "border-purple bg-purple-soft/50"
                  : "border-border bg-panel hover:border-border-2"
              }`}
            >
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] font-display text-[13px] font-semibold ${
                  isSelected ? "bg-purple text-panel" : "bg-chip text-ink"
                }`}
              >
                {initials(c.display_name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-[7px]">
                  <span className="font-display text-[14.5px] font-semibold text-ink">
                    {c.display_name}
                  </span>
                  {isMoat && (
                    <span className="rounded-[5px] bg-purple px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em] text-panel">
                      ★ MOAT
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[12px] text-muted">
                  {c.traits.segment}
                </div>
                <div className="mt-[5px] font-mono text-[10px] tracking-[0.04em] text-muted-2">
                  rec · {agent?.name}
                </div>
              </div>
              {isMatch && (
                <span className="absolute right-3 top-[11px] flex items-center gap-1 font-mono text-[9px] tracking-[0.06em] text-orange-deep">
                  <span className="h-[6px] w-[6px] animate-[vPulse_1.4s_ease_infinite] rounded-full bg-orange" />
                  MATCH
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
