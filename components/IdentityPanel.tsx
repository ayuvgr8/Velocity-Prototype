"use client";

import { useState } from "react";
import type { Customer, IdentityFragment } from "@/lib/types";
import { initials, traitChips } from "@/lib/format";
import { PanelHeader, SOURCE_STYLE } from "./PanelHeader";

function sigLine(f: IdentityFragment): string {
  const s = f.signals;
  return [s.name, s.phone, s.email, s.device_id && `device ${s.device_id}`]
    .filter(Boolean)
    .join(" · ");
}
function subLine(f: IdentityFragment): string {
  const s = f.signals;
  return [s.geo, s.address].filter(Boolean).join(" · ");
}

export function IdentityPanel({ customer }: { customer: Customer }) {
  // replay re-triggers the fade-in animation
  const [nonce, setNonce] = useState(0);
  const cb = customer.traits.cross_brand_return_signal;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-panel">
      <PanelHeader
        n={1}
        label="IDENTITY RESOLUTION · THE KEYSTONE"
        title="Many IDs → one human"
        right={
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-green-soft px-[11px] py-1 font-mono text-[10px] tracking-[0.08em] text-green">
              resolved
            </span>
            <button
              onClick={() => setNonce((n) => n + 1)}
              className="rounded-[7px] border border-border-2 px-[9px] py-[5px] font-mono text-[10px] text-muted transition hover:bg-cream"
            >
              ↻ replay
            </button>
          </div>
        }
      />

      <div
        key={nonce}
        className="grid grid-cols-1 gap-3.5 p-[18px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
      >
        {/* scattered records */}
        <div>
          <div className="mb-[9px] font-mono text-[9.5px] tracking-[0.12em] text-muted-2">
            {customer.fragments.length} SCATTERED RECORDS · KEYED DIFFERENTLY
          </div>
          <div className="flex flex-col gap-2">
            {customer.fragments.map((f, i) => {
              const src = SOURCE_STYLE[f.source] ?? SOURCE_STYLE.storefront;
              return (
                <div
                  key={f.id}
                  className="v-fade-up rounded-[10px] border border-border bg-white px-3 py-2.5"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="mb-1 flex items-center gap-[7px]">
                    <span
                      className="rounded-[5px] px-1.5 py-0.5 font-mono text-[8.5px] tracking-[0.08em]"
                      style={{ color: src.fg, background: src.bg }}
                    >
                      {src.label}
                    </span>
                    {f.brand && (
                      <span className="font-mono text-[8.5px] tracking-[0.06em] text-purple">
                        {f.brand}
                      </span>
                    )}
                    <span className="ml-auto font-mono text-[9.5px] text-muted-2">
                      {f.id}
                    </span>
                  </div>
                  <div className="text-[12.5px] font-medium leading-[1.35] text-ink">
                    {sigLine(f)}
                  </div>
                  {subLine(f) && (
                    <div className="mt-0.5 text-[11.5px] leading-[1.35] text-muted">
                      {subLine(f)}
                    </div>
                  )}
                  {f.note && (
                    <div className="mt-[5px] font-mono text-[9.5px] text-orange-deep">
                      ↳ {f.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* unified profile */}
        <div className="v-fade-up" style={{ animationDelay: "260ms" }}>
          <div className="rounded-[14px] border-[1.5px] border-purple bg-white px-4 py-[15px] shadow-[0_14px_34px_-22px_rgba(67,38,214,0.6)]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-purple font-display text-[15px] font-semibold text-panel">
                {initials(customer.display_name)}
              </div>
              <div>
                <div className="font-display text-[17px] font-semibold text-ink">
                  {customer.display_name}
                </div>
                <div className="text-[11.5px] text-muted">
                  {customer.traits.segment} · one record per human
                </div>
              </div>
              <span className="ml-auto rounded-full bg-green-soft px-[9px] py-1 font-mono text-[9.5px] tracking-[0.06em] text-green">
                ✓ {customer.resolution.confidence}
              </span>
            </div>

            <div className="mt-[13px] rounded-[10px] border border-border-soft bg-sunken px-3 py-2.5">
              <div className="font-mono text-[9px] tracking-[0.12em] text-muted-2">
                ANCHOR
              </div>
              <div className="mt-[3px] font-mono text-[12px] text-ink">
                {customer.resolution.anchor}
              </div>
              <div className="mt-[9px] flex flex-col gap-1">
                {customer.resolution.method.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1.5 text-[11px] leading-[1.4] text-ink-2"
                  >
                    <span className="text-[11px] text-green">●</span>
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {cb && (
              <div className="mt-2.5 rounded-[10px] border border-[#ECC9BF] bg-[#F6E4DE] px-3 py-2.5">
                <div className="font-mono text-[9px] tracking-[0.1em] text-danger">
                  ⚠ CROSS-BRAND SIGNAL
                </div>
                <div className="mt-[3px] text-[11.5px] leading-[1.4] text-[#7a2415]">
                  {cb.returns} of {cb.total} orders returned across{" "}
                  {cb.brands.length} brands — invisible to any single brand.
                </div>
              </div>
            )}

            <div className="mt-[11px] grid grid-cols-3 gap-1.5">
              {traitChips(customer).map((tc) => (
                <div
                  key={tc.k}
                  className="rounded-[8px] border border-border-soft bg-sunken px-[9px] py-[7px]"
                >
                  <div className="font-mono text-[8.5px] tracking-[0.06em] text-muted-2">
                    {tc.k}
                  </div>
                  <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap font-display text-[12.5px] font-semibold text-ink">
                    {tc.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
