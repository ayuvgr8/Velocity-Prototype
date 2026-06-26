"use client";

import type { Customer, ContextBundle } from "@/lib/types";
import { AGENTS } from "@/lib/data/agents";
import {
  getContext,
  scopedPayload,
  dumpPayload,
  estimateTokens,
} from "@/lib/engine/getContext";
import { fieldLabel, formatValue, riskTone } from "@/lib/format";
import { PanelTitle } from "./IdentityPanel";

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
  const reduction = Math.round((1 - scopedTokens / dumpTokens) * 100);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <PanelTitle index="2" title="Context Contract" tint="#0ea5e9" />
      <p className="text-[11px] text-muted mb-3">
        Each agent declares the fields it needs. New agent = new contract over
        the same data → no re-architecture.
      </p>

      {/* task selector */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {AGENTS.map((a) => {
          const recommended = a.id === customer.expected_agent;
          const active = a.id === agentId;
          return (
            <button
              key={a.id}
              onClick={() => setAgentId(a.id)}
              className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium border transition ${
                active
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-sky-400"
              }`}
            >
              {recommended && <span className="mr-0.5">★</span>}
              {a.name}
            </button>
          );
        })}
      </div>

      {/* trigger + logic */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 mb-3 text-[11px]">
        <span className="text-muted">Trigger:</span>{" "}
        <span className="text-ink">{agent.trigger}</span>
        <span className="text-slate-300 mx-1.5">|</span>
        <span className="text-muted">Logic:</span>{" "}
        <span className="text-ink">{agent.decision_logic}</span>
      </div>

      {/* included / excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 mb-1.5">
            Included ({bundle.included.length})
          </div>
          <div className="space-y-1.5">
            {bundle.included.map((f) => (
              <div
                key={f.field}
                className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-medium text-ink">
                    {fieldLabel(f.field)}
                  </span>
                  {f.freshness && (
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 whitespace-nowrap">
                      {f.freshness}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[12px] mt-0.5 ${
                    riskTone(f.field, f.value) || "text-slate-600"
                  }`}
                >
                  {formatValue(f.field, f.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Excluded ({bundle.excluded.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {bundle.excluded.map((f) => (
              <span
                key={f}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-400 line-through"
              >
                {fieldLabel(f)}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted mt-2 leading-snug">
            Available, but not relevant to this job — kept out to cut noise and
            cost.
          </p>
        </div>
      </div>

      {/* dump vs scoped */}
      <div className="mt-4 rounded-lg border border-slate-200 p-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {(["scoped", "dump"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition ${
                  scope === s
                    ? "bg-white text-ink shadow-sm border border-slate-200"
                    : "text-muted hover:text-ink"
                }`}
              >
                {s === "scoped" ? "Task-scoped" : "Full dump"}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-muted">
            sent to the model
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TokenBar
            label="Task-scoped"
            tokens={scopedTokens}
            max={dumpTokens}
            active={scope === "scoped"}
            tone="emerald"
          />
          <TokenBar
            label="Full dump"
            tokens={dumpTokens}
            max={dumpTokens}
            active={scope === "dump"}
            tone="slate"
          />
        </div>
        <p className="text-[11px] text-center mt-2">
          <span className="font-semibold text-emerald-600">
            {reduction}% smaller
          </span>{" "}
          <span className="text-muted">
            payload when the agent takes only what its contract declares
          </span>
        </p>
      </div>
    </section>
  );
}

function TokenBar({
  label,
  tokens,
  max,
  active,
  tone,
}: {
  label: string;
  tokens: number;
  max: number;
  active: boolean;
  tone: "emerald" | "slate";
}) {
  const pct = Math.max(6, Math.round((tokens / max) * 100));
  const bar = tone === "emerald" ? "bg-emerald-500" : "bg-slate-400";
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        active ? "border-slate-300 bg-white" : "border-slate-200 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono font-medium text-ink">~{tokens} tok</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
