"use client";

import { motion } from "framer-motion";
import type { Customer } from "@/lib/types";

const SOURCE_LABELS: Record<string, string> = {
  storefront: "Storefront",
  whatsapp: "WhatsApp",
  web_session: "Web session",
  marketing: "Marketing",
  brand_order: "Brand order",
};

function signalLine(f: Customer["fragments"][number]): string {
  const s = f.signals;
  const parts = [
    s.name,
    s.phone,
    s.email,
    s.device_id && `device ${s.device_id}`,
    s.geo,
    s.address,
  ].filter(Boolean);
  return parts.join(" · ") || "anonymous signals";
}

export function IdentityPanel({ customer }: { customer: Customer }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <PanelTitle index="1" title="Identity Resolution" tint="#6d28d9" />
      <p className="text-[11px] text-muted mb-3">
        Scattered fragments → one human. Nothing downstream works without this.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* fragments */}
        <div className="space-y-2">
          {customer.fragments.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {SOURCE_LABELS[f.source] ?? f.source}
                  {f.brand ? ` · ${f.brand}` : ""}
                </span>
                <code className="text-[10px] text-slate-400 font-mono">
                  {f.id}
                </code>
              </div>
              <div className="text-[12px] text-ink mt-0.5 leading-snug">
                {signalLine(f)}
              </div>
              {f.note && (
                <div className="text-[10px] text-muted mt-0.5 italic">
                  {f.note}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* arrow */}
        <div className="hidden lg:flex flex-col items-center text-accent">
          <span className="text-2xl">→</span>
        </div>

        {/* unified profile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: customer.fragments.length * 0.05 + 0.1 }}
          className="rounded-xl border-2 border-accent/40 bg-accent-soft/40 p-3.5"
        >
          <div className="text-sm font-semibold text-ink">
            {customer.display_name}
          </div>
          <code className="text-[10px] text-accent font-mono">
            {customer.customer_id}
          </code>
          <dl className="mt-2.5 space-y-1.5 text-[12px]">
            <Row label="Anchor" value={customer.resolution.anchor} />
            <div>
              <dt className="text-muted">Method</dt>
              <dd className="mt-1 space-y-1">
                {customer.resolution.method.map((m, i) => (
                  <div
                    key={i}
                    className="rounded bg-white px-2 py-1 text-[11px] text-slate-600 border border-slate-200"
                  >
                    {m}
                  </div>
                ))}
              </dd>
            </div>
            <Row
              label="Confidence"
              value={
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 capitalize">
                  {customer.resolution.confidence}
                </span>
              }
            />
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted shrink-0">{label}</dt>
      <dd className="text-ink text-right">{value}</dd>
    </div>
  );
}

export function PanelTitle({
  index,
  title,
  tint,
}: {
  index: string;
  title: string;
  tint: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-md text-[11px] font-bold text-white"
        style={{ backgroundColor: tint }}
      >
        {index}
      </span>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
    </div>
  );
}
