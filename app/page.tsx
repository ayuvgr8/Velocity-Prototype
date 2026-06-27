"use client";

import { useState } from "react";
import { Header, type View } from "@/components/Header";
import { Intro } from "@/components/Intro";
import { SegmentationBar } from "@/components/SegmentationBar";
import { CustomerRail } from "@/components/CustomerRail";
import { IdentityPanel } from "@/components/IdentityPanel";
import { ContextContractPanel } from "@/components/ContextContractPanel";
import { AgentActsPanel } from "@/components/AgentActsPanel";
import { ArchitectureView } from "@/components/ArchitectureView";
import { GuidedDemo, type DemoStep } from "@/components/GuidedDemo";
import { getCustomer } from "@/lib/data/customers";
import type { Mode } from "@/lib/engine/client";
import type { SegmentFilter } from "@/lib/types";

const DEMO: DemoStep[] = [
  { title: "The thesis", body: "Every agent is only as good as what it knows the moment it acts. Let’s prove it — no slides, just the workspace." },
  { title: "Segment in plain English", body: "Type an audience in English and the AI turns it into a live segment — no SQL, no rules. Watch Vikram light up." },
  { title: "Identity resolution", body: "Four scattered records — storefront, WhatsApp, a web session — resolve into one human. The keystone." },
  { title: "Task-scoped context", body: "The COD→Prepaid agent declares a contract. The engine returns only those fields — everything else is excluded." },
  { title: "Dump vs scoped", body: "Same customer. Flip to full dump: far more tokens, more noise. The contract keeps it tight and cheap." },
  { title: "Switch the task", body: "Same customer, different job → different contract, different context. That’s how product #11 ships without re-architecture." },
  { title: "The cross-brand moat", body: "One brand sees one return. We see 4 of 5 across three brands — and pause COD before shipping at a loss." },
  { title: "The agent acts", body: "Hit Generate — real AI drafts a WhatsApp message from only the task-scoped bundle. That’s the whole thesis, clickable." },
];

export default function Page() {
  const [view, setView] = useState<View>("intro");
  const [mode, setMode] = useState<Mode>("mock");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string>("");
  const [scope, setScope] = useState<"scoped" | "dump">("scoped");
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [segTrigger, setSegTrigger] = useState<{ query: string; n: number } | null>(null);
  const [demoStep, setDemoStep] = useState<number | null>(null);

  const customer = selectedId ? getCustomer(selectedId) : undefined;

  function selectCustomer(id: string) {
    setSelectedId(id);
    const c = getCustomer(id);
    setAgentId(c?.expected_agent ?? "");
    setScope("scoped");
  }

  function onSegment(ids: string[], _filter: SegmentFilter | null) {
    setMatchedIds(ids);
    if (ids.length === 1) selectCustomer(ids[0]);
  }

  // Guided demo drives the workspace state, step by step.
  function applyStep(i: number) {
    setView("workspace");
    switch (i) {
      case 0:
        setSelectedId(null);
        setMatchedIds([]);
        break;
      case 1:
        setSegTrigger((t) => ({ query: "risky COD orders I shouldn't ship", n: (t?.n ?? 0) + 1 }));
        break;
      case 2:
        selectCustomer("cust_001");
        break;
      case 3:
        selectCustomer("cust_001");
        setAgentId("cod_prepaid");
        setScope("scoped");
        break;
      case 4:
        setScope("dump");
        break;
      case 5:
        setSelectedId("cust_001");
        setAgentId("winback");
        setScope("scoped");
        break;
      case 6:
        setSelectedId("cust_004");
        setAgentId("rto_shield");
        setScope("scoped");
        break;
      case 7:
        setSelectedId("cust_004");
        setAgentId("rto_shield");
        break;
    }
  }

  function startDemo() {
    setDemoStep(0);
    applyStep(0);
  }
  function gotoStep(i: number) {
    setDemoStep(i);
    applyStep(i);
  }

  if (view === "intro") {
    return (
      <Intro
        onEnter={() => setView("workspace")}
        onArch={() => setView("architecture")}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        view={view}
        setView={setView}
        mode={mode}
        setMode={setMode}
        onStartDemo={startDemo}
      />

      {view === "architecture" ? (
        <ArchitectureView />
      ) : (
        <main className="min-h-[calc(100vh-58px)] bg-cream px-6 pb-14 pt-5">
          <SegmentationBar mode={mode} onResult={onSegment} trigger={segTrigger} />

          <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[296px_minmax(0,1.45fr)_minmax(0,1fr)]">
            <CustomerRail
              selectedId={selectedId}
              matchedIds={matchedIds}
              onSelect={selectCustomer}
            />

            {!customer ? (
              <>
                <EmptyPanel
                  n={1}
                  label="IDENTITY RESOLUTION · THE KEYSTONE"
                  title="Many IDs → one human"
                  body="Pick a customer from the rail — or run a segment above — to watch their scattered records resolve into one profile."
                />
                <EmptyPanel
                  n={3}
                  label="AGENT ACTS"
                  title="Real AI on minimal context"
                  body="The agent drafts a WhatsApp message from only the task-scoped bundle."
                  sticky
                />
              </>
            ) : (
              <>
                <div className="flex flex-col gap-[18px]">
                  <IdentityPanel customer={customer} />
                  <ContextContractPanel
                    customer={customer}
                    agentId={agentId || customer.expected_agent}
                    setAgentId={setAgentId}
                    scope={scope}
                    setScope={setScope}
                  />
                </div>
                <div className="lg:sticky lg:top-[74px]">
                  <AgentActsPanel
                    customer={customer}
                    agentId={agentId || customer.expected_agent}
                    mode={mode}
                    scope={scope}
                  />
                </div>
              </>
            )}
          </div>
        </main>
      )}

      {demoStep !== null && (
        <GuidedDemo
          step={demoStep}
          total={DEMO.length}
          content={DEMO[demoStep]}
          onPrev={() => gotoStep(Math.max(0, demoStep - 1))}
          onNext={() => gotoStep(Math.min(DEMO.length - 1, demoStep + 1))}
          onExit={() => setDemoStep(null)}
        />
      )}
    </div>
  );
}

function EmptyPanel({
  n,
  label,
  title,
  body,
  sticky,
}: {
  n: number;
  label: string;
  title: string;
  body: string;
  sticky?: boolean;
}) {
  return (
    <div className={sticky ? "lg:sticky lg:top-[74px]" : undefined}>
      <section className="overflow-hidden rounded-2xl border border-border bg-panel">
        <div className="flex items-center gap-3 border-b border-border-soft px-[18px] py-[15px]">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[7px] bg-ink font-display text-[13px] font-semibold text-panel">
            {n}
          </span>
          <div>
            <div className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
              {label}
            </div>
            <div className="mt-px font-display text-[15px] font-semibold text-ink">
              {title}
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-[40ch] px-[22px] py-10 text-center text-[14px] leading-[1.5] text-muted">
          {body}
        </div>
      </section>
    </div>
  );
}
