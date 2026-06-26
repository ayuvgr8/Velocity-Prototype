"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { SegmentationBar } from "@/components/SegmentationBar";
import { CustomerRail } from "@/components/CustomerRail";
import { IdentityPanel } from "@/components/IdentityPanel";
import { ContextContractPanel } from "@/components/ContextContractPanel";
import { AgentActsPanel } from "@/components/AgentActsPanel";
import { getCustomer } from "@/lib/data/customers";
import type { Mode } from "@/lib/engine/client";
import type { SegmentFilter } from "@/lib/types";

export default function Page() {
  const [mode, setMode] = useState<Mode>("mock");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string>("");
  const [scope, setScope] = useState<"scoped" | "dump">("scoped");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);

  const customer = selectedId ? getCustomer(selectedId) : undefined;

  function selectCustomer(id: string) {
    setSelectedId(id);
    const c = getCustomer(id);
    // default the task to the customer's recommended agent
    setAgentId(c?.expected_agent ?? "");
    setScope("scoped");
  }

  function onSegment(ids: string[], _filter: SegmentFilter | null) {
    setMatchedIds(ids);
    // convenience: if exactly one match, auto-select it for a snappy demo
    if (ids.length === 1) selectCustomer(ids[0]);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} setMode={setMode} />

      <main className="mx-auto w-full max-w-[1400px] px-5 py-5 flex-1">
        <SegmentationBar mode={mode} onResult={onSegment} />

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          {/* left rail */}
          <CustomerRail
            selectedId={selectedId}
            matchedIds={matchedIds}
            onSelect={selectCustomer}
          />

          {/* right: the three stacked panels */}
          <div className="space-y-4">
            {!customer ? (
              <EmptyState />
            ) : (
              <>
                <IdentityPanel customer={customer} />
                <ContextContractPanel
                  customer={customer}
                  agentId={agentId || customer.expected_agent}
                  setAgentId={setAgentId}
                  scope={scope}
                  setScope={setScope}
                />
                <AgentActsPanel
                  customer={customer}
                  agentId={agentId || customer.expected_agent}
                  mode={mode}
                  scope={scope}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-5 py-3 text-[11px] text-muted">
          The method: I let the <span className="text-ink font-medium">agents’ needs be the forcing function</span> — each agent declares what it needs to act, and that defines what the layer must serve. · Thinking prototype · static sample data, no DB.
        </div>
      </footer>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="text-4xl mb-3">👈</div>
      <h3 className="text-sm font-semibold text-ink">
        Pick a customer — or ask in plain English above
      </h3>
      <p className="text-[12px] text-muted mt-1.5 max-w-md mx-auto leading-relaxed">
        Try a chip like <em>“risky COD orders I shouldn’t ship”</em> to watch the
        AI segment the personas, then select one to see identity resolution, its
        task-scoped context contract, and the agent act on it.
      </p>
    </div>
  );
}
