"use client";

import { CUSTOMERS } from "@/lib/data/customers";
import { getAgent } from "@/lib/data/agents";

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
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Customers
        </h2>
        <p className="text-[11px] text-muted mt-0.5">
          6 engineered personas · pick one
        </p>
      </div>

      <ul className="divide-y divide-slate-100">
        {CUSTOMERS.map((c) => {
          const isSelected = selectedId === c.customer_id;
          const isMatch = matchedIds.includes(c.customer_id);
          const dimmed = hasSegment && !isMatch;
          const agent = getAgent(c.expected_agent);
          const isMoat = c.customer_id === "cust_004";

          return (
            <li key={c.customer_id}>
              <button
                onClick={() => onSelect(c.customer_id)}
                className={`w-full text-left px-4 py-3 transition relative ${
                  isSelected ? "bg-accent-soft/70" : "hover:bg-slate-50"
                } ${dimmed ? "opacity-35" : ""}`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                )}
                {isMatch && (
                  <span className="absolute right-3 top-3 inline-flex h-2 w-2 rounded-full bg-accent ring-4 ring-accent/20" />
                )}
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-ink text-sm">
                    {c.display_name}
                  </span>
                  {isMoat && <span title="cross-brand moat">⭐</span>}
                </div>
                <div className="text-[11px] text-muted mt-0.5 leading-snug">
                  {c.scenario_tag}
                </div>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    ★ {agent?.name}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
