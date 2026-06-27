"use client";

import type { Customer, ContextBundle } from "@/lib/types";
import { AGENTS } from "@/lib/data/agents";
import {
  getContext,
  scopedPayload,
  dumpPayload,
  estimateTokens,
} from "@/lib/engine/getContext";
import { formatValue, riskTone } from "@/lib/format";
import { PanelHeader } from "./PanelHeader";

export function ContextContractPanel({
  customer,
  agentId,
  setAgentId,
  scope,
  setScope,
}: {
  customer: Customer;
  agentId: string;
  setAgentId: (id: string) => void;
  scope: "scoped" | "dump";
  setScope: (s: "scoped" | "dump") => void;
}) {
  const agent = AGENTS.find((a) => a.id === agentId)!;
  const bundle: ContextBundle = getContext(customer, agent);

  const scopedTokens = estimateTokens(scopedPayload(bundle));
  const dumpTokens = estimateTokens(dumpPayload(customer));
  const scopedFields = bundle.included.length;
  const dumpFields = bundle.included.length + bundle.excluded.length;
  const scopedW = Math.max(6, Math.round((scopedTokens / dumpTokens) * 100));
  const tokenSave = Math.round((1 - scopedTokens / dumpTokens) * 100);

  const showMoat = !!agent.badge && !!customer.traits.cross_brand_return_signal;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-panel">
      <PanelHeader
        n={2}
        label="CONTEXT CONTRACT · 1 AGENT = 1 CONTRACT"
        title="Only what this job needs"
      />

      <div className="px-[18px] py-[15px]">
        <div className="mb-[9px] font-mono text-[9.5px] tracking-[0.12em] text-muted-2">
          TASK · ★ = RECOMMENDED FOR THIS CUSTOMER
        </div>
        <div className="flex flex-wrap gap-[7px]">
          {AGENTS.map((a) => {
            const active = a.id === agentId;
            const recommended = a.id === customer.expected_agent;
            return (
              <button
                key={a.id}
                onClick={() => setAgentId(a.id)}
                className={`flex items-center gap-1 rounded-[9px] border px-[11px] py-[7px] font-sans text-[12.5px] font-medium transition ${
                  active
                    ? "border-ink bg-ink text-panel"
                    : "border-border bg-white text-ink-2 hover:border-purple"
                }`}
              >
                {recommended && <span className="text-[11px] text-orange">★</span>}
                {a.name}
              </button>
            );
          })}
        </div>

        {/* trigger + logic */}
        <div className="mt-3.5 flex flex-wrap items-center gap-[9px] rounded-[11px] border border-border-soft bg-sunken px-[13px] py-[11px]">
          <span className="rounded-md bg-purple-soft px-2 py-[3px] font-mono text-[9.5px] tracking-[0.08em] text-purple">
            TRIGGER
          </span>
          <span className="text-[12.5px] text-ink-2">{agent.trigger}</span>
          <span className="h-3.5 w-px bg-border" />
          <span className="text-[12px] italic text-muted">
            {agent.decision_logic}
          </span>
        </div>

        {showMoat && (
          <div className="mt-3 flex items-center gap-[9px] rounded-[11px] bg-dark px-[13px] py-[11px]">
            <span className="h-2 w-2 flex-shrink-0 animate-[vPulse_1.3s_ease_infinite] rounded-full bg-orange" />
            <span className="font-mono text-[11px] tracking-[0.04em] text-cream">
              {agent.badge}
            </span>
          </div>
        )}

        {/* included / excluded */}
        <div className="mt-3.5 grid grid-cols-1 gap-[13px] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <div className="mb-2 flex items-center gap-[7px]">
              <span className="h-[6px] w-[6px] rounded-full bg-green" />
              <span className="font-mono text-[9.5px] tracking-[0.1em] text-green">
                INCLUDED · {scopedFields} FIELDS
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {bundle.included.map((f) => (
                <div
                  key={f.field}
                  className="flex items-baseline gap-[9px] rounded-[9px] border border-[#D6E8DC] border-l-[3px] border-l-green bg-white px-[11px] py-[9px]"
                >
                  <span className="min-w-[108px] flex-shrink-0 font-mono text-[10.5px] text-[#2F8157]">
                    {f.field}
                  </span>
                  <span
                    className={`flex-1 text-[12.5px] font-medium leading-[1.35] ${
                      riskTone(f.field, f.value) || "text-ink"
                    }`}
                  >
                    {formatValue(f.field, f.value)}
                  </span>
                  {f.freshness && (
                    <span className="flex-shrink-0 whitespace-nowrap font-mono text-[9px] text-muted-2">
                      {f.freshness}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-[7px]">
              <span className="h-[6px] w-[6px] rounded-full bg-[#c9c1b0]" />
              <span className="font-mono text-[9.5px] tracking-[0.1em] text-muted-2">
                EXCLUDED · not this job
              </span>
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {bundle.excluded.map((e) => (
                <span
                  key={e}
                  className="rounded-md border border-[#E6E0D2] bg-chip px-2 py-1 font-mono text-[10px] text-[#b3ac9c] line-through decoration-[#ccc4b2]"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* payload scoped vs dump */}
        <div className="mt-[15px] rounded-[12px] border border-border-soft bg-sunken px-3.5 py-[13px]">
          <div className="mb-[11px] flex items-center justify-between">
            <span className="font-mono text-[9.5px] tracking-[0.1em] text-muted">
              PAYLOAD SENT TO THE AGENT
            </span>
            <div className="flex gap-[2px] rounded-[8px] border border-border bg-chip p-[3px]">
              {(["scoped", "dump"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={`rounded-md px-[11px] py-[5px] font-sans text-[11.5px] font-medium transition ${
                    scope === s ? "bg-white text-ink shadow-sm" : "text-muted"
                  }`}
                >
                  {s === "scoped" ? "Task-scoped" : "Full dump"}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-[7px] flex items-center gap-2.5">
            <span className="min-w-[78px] font-mono text-[10px] text-green">
              scoped
            </span>
            <div className="h-[9px] flex-1 overflow-hidden rounded-[5px] bg-border-soft">
              <div
                className="h-full rounded-[5px] bg-green transition-[width] duration-500"
                style={{ width: `${scopedW}%` }}
              />
            </div>
            <span className="min-w-[96px] text-right font-mono text-[11px] text-ink">
              ~{scopedTokens} tok · {scopedFields}f
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="min-w-[78px] font-mono text-[10px] text-danger">
              full dump
            </span>
            <div className="h-[9px] flex-1 overflow-hidden rounded-[5px] bg-border-soft">
              <div className="h-full w-full rounded-[5px] bg-danger" />
            </div>
            <span className="min-w-[96px] text-right font-mono text-[11px] text-ink">
              ~{dumpTokens} tok · {dumpFields}f
            </span>
          </div>
          <div className="mt-2.5 text-[12px] leading-[1.4] text-ink-2">
            Same customer. The contract sends{" "}
            <strong className="text-green">{tokenSave}% fewer tokens</strong> —
            less noise, lower cost, sharper output.
          </div>
        </div>
      </div>
    </section>
  );
}
