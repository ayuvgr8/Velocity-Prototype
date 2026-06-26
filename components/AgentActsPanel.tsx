"use client";

import { useEffect, useState } from "react";
import type { Customer } from "@/lib/types";
import { AGENTS } from "@/lib/data/agents";
import { getContext } from "@/lib/engine/getContext";
import { generateAction, type Mode } from "@/lib/engine/client";
import { PanelTitle } from "./IdentityPanel";

export function AgentActsPanel({
  customer,
  agentId,
  mode,
  scope,
}: {
  customer: Customer;
  agentId: string;
  mode: Mode;
  scope: "scoped" | "dump";
}) {
  const agent = AGENTS.find((a) => a.id === agentId)!;
  const bundle = getContext(customer, agent);
  const fieldCount =
    scope === "scoped" ? bundle.included.length : bundle.included.length + bundle.excluded.length;
  const [message, setMessage] = useState<string>(customer.mock_action);
  const [source, setSource] = useState<Mode>("mock");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const { message: m, source: s } = await generateAction(
      bundle,
      agent,
      mode,
      scope
    );
    setMessage(m);
    setSource(s);
    setLoading(false);
  }

  // Reset to the persona's mock action whenever the target changes; the user
  // explicitly hits Generate to call the model.
  useEffect(() => {
    setMessage(customer.mock_action);
    setSource("mock");
  }, [customer.customer_id, agentId]);

  const showMoatBadge = customer.customer_id === "cust_004" && agent.badge;
  const exploringInMock =
    mode === "mock" && source === "mock" && agent.id !== customer.expected_agent;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <PanelTitle index="3" title="Agent Acts" tint="#16a34a" />
        <button
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition"
        >
          {loading
            ? "Generating…"
            : mode === "live"
            ? "Generate live →"
            : "Generate (mock) →"}
        </button>
      </div>
      <p className="text-[11px] text-muted mb-3">
        {agent.role} · acting on{" "}
        <strong>{scope === "scoped" ? "task-scoped" : "full-dump"}</strong>{" "}
        context · built from{" "}
        <strong className={scope === "scoped" ? "text-emerald-600" : "text-slate-500"}>
          {fieldCount} field{fieldCount === 1 ? "" : "s"}
        </strong>
      </p>

      {showMoatBadge && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 text-[11px] font-medium text-red-700">
          <span>🛡️</span> {agent.badge}
        </div>
      )}

      {/* phone bubble */}
      <div className="rounded-2xl bg-[#e5ddd5] p-4">
        <div className="flex flex-col gap-1.5 max-w-[80%]">
          <div className="relative rounded-xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-sm">
            <div className="text-[10px] font-semibold text-emerald-600 mb-0.5">
              {customer.display_name.split(" ")[0]}’s brand · WhatsApp
            </div>
            <p className="text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap">
              {message}
            </p>
            <div className="mt-1 text-right text-[9px] text-slate-400">
              {source === "live" ? "✓ Claude" : "mock"} · now
            </div>
          </div>
        </div>
      </div>

      {exploringInMock && (
        <p className="mt-2 text-[10px] text-amber-600 leading-snug">
          Mock copy is the canned message for this customer’s recommended agent.
          Switch to <strong>Live</strong> to generate a real {agent.name} message
          from this task’s contract.
        </p>
      )}

      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="text-muted">
          {message.length} chars
          {source === "live" && (
            <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
              generated live by Claude
            </span>
          )}
        </span>
        <button
          onClick={run}
          disabled={loading}
          className="text-accent hover:underline disabled:opacity-50"
        >
          ↻ regenerate
        </button>
      </div>
    </section>
  );
}
