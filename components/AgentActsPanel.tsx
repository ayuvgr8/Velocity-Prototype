"use client";

import { useEffect, useState } from "react";
import type { Customer } from "@/lib/types";
import { AGENTS } from "@/lib/data/agents";
import { getContext } from "@/lib/engine/getContext";
import { generateAction, type Mode } from "@/lib/engine/client";
import { PanelHeader } from "./PanelHeader";

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
  const [message, setMessage] = useState<string | null>(null);
  const [source, setSource] = useState<Mode>("mock");
  const [loading, setLoading] = useState(false);

  // reset the draft when the target changes — the user presses Generate to act
  useEffect(() => {
    setMessage(null);
  }, [customer.customer_id, agentId]);

  async function run() {
    setLoading(true);
    setMessage(null);
    const bundle = getContext(customer, agent);
    const { message: m, source: s } = await generateAction(bundle, agent, mode, scope);
    setMessage(m);
    setSource(s);
    setLoading(false);
  }

  const genLabel = loading
    ? "Generating…"
    : mode === "live"
    ? "Generate live message"
    : "Generate message (mock)";
  const scopeWord = scope === "scoped" ? "task-scoped" : "full-dump";

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-panel">
      <PanelHeader n={3} label="AGENT ACTS" title="Real AI on minimal context" />

      <div className="px-4 py-3.5">
        <div className="overflow-hidden rounded-[15px] border border-border shadow-[0_14px_34px_-22px_rgba(20,18,12,0.5)]">
          {/* whatsapp header */}
          <div className="flex items-center gap-2.5 bg-green px-3.5 py-[11px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-panel font-display text-[15px] font-bold text-green">
              {customer.display_name[0]}
            </div>
            <div className="flex-1">
              <div className="font-sans text-[13.5px] font-semibold text-panel">
                {customer.display_name}
              </div>
              <div className="text-[10.5px] text-panel/80">
                via Velocity · {agent.name}
              </div>
            </div>
            <span className="rounded-full bg-panel/20 px-[9px] py-[3px] font-mono text-[9px] tracking-[0.06em] text-panel">
              WHATSAPP
            </span>
          </div>

          {/* chat area */}
          <div
            className="flex min-h-[208px] flex-col gap-[9px] px-3.5 py-[15px]"
            style={{
              background:
                "#E7E0D2 radial-gradient(rgba(20,18,12,.035) 1px,transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            {customer.messages.map((m, i) => (
              <div
                key={i}
                className="max-w-[82%] self-start rounded-[3px_12px_12px_12px] bg-white px-[11px] py-2 shadow-[0_1px_1px_rgba(20,18,12,0.08)]"
              >
                <div className="text-[13px] leading-[1.4] text-ink">{m.text}</div>
                <div className="mt-0.5 text-right text-[9.5px] text-[#9c958a]">
                  {m.ts}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-[5px] self-end rounded-[12px_3px_12px_12px] bg-[#DCF8C6] px-3.5 py-[11px]">
                <span className="h-[7px] w-[7px] animate-[vBlink_1s_ease_infinite] rounded-full bg-[#7fae5f]" />
                <span className="h-[7px] w-[7px] animate-[vBlink_1s_ease_0.2s_infinite] rounded-full bg-[#7fae5f]" />
                <span className="h-[7px] w-[7px] animate-[vBlink_1s_ease_0.4s_infinite] rounded-full bg-[#7fae5f]" />
              </div>
            )}

            {message && !loading && (
              <div className="v-fade-up max-w-[88%] self-end rounded-[12px_3px_12px_12px] bg-[#DCF8C6] px-3 py-[9px] shadow-[0_1px_1px_rgba(20,18,12,0.08)]">
                <div className="whitespace-pre-wrap text-[13.5px] leading-[1.46] text-ink">
                  {message}
                </div>
                <div className="mt-[3px] flex items-center justify-end gap-1">
                  <span className="text-[9.5px] text-[#7c8a6b]">now</span>
                  <span className="tracking-[-2px] text-[11px] text-[#34B7F1]">
                    ✓✓
                  </span>
                </div>
              </div>
            )}

            {!message && !loading && (
              <div className="m-auto max-w-[30ch] text-center text-[12.5px] leading-[1.4] text-[#8c8579]">
                Press <strong className="text-muted">{genLabel}</strong> — the
                agent acts on the {scopeWord} bundle only.
              </div>
            )}
          </div>
        </div>

        <button
          onClick={run}
          disabled={loading}
          className="mt-[13px] flex w-full items-center justify-center gap-[9px] rounded-[12px] border-none bg-purple py-[13px] font-display text-[14.5px] font-semibold text-panel shadow-[0_10px_24px_-12px_rgba(67,38,214,0.6)] transition hover:brightness-110 disabled:opacity-60"
        >
          {loading && (
            <span className="inline-block h-3.5 w-3.5 animate-[vSpin_0.6s_linear_infinite] rounded-full border-2 border-panel/40 border-t-panel" />
          )}
          <span>{genLabel}</span>
        </button>

        {message && !loading && (
          <div className="mt-[9px] flex items-center justify-between">
            <span
              className={`font-mono text-[10px] tracking-[0.04em] ${
                source === "live" ? "text-green" : "text-muted-2"
              }`}
            >
              {source === "live" ? "✓ generated live by Claude" : "mock draft"}
            </span>
            <span className="font-mono text-[10px] text-muted-2">
              {message.length} / 320 chars
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
