"use client";

import type { ReactNode } from "react";

// Numbered panel header used by the three workspace panels (design panels ①②③).
export function PanelHeader({
  n,
  label,
  title,
  right,
}: {
  n: number;
  label: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-soft px-[18px] py-[15px]">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[7px] bg-ink font-display text-[13px] font-semibold text-panel">
        {n}
      </span>
      <div className="flex-1">
        <div className="font-mono text-[10px] tracking-[0.14em] text-muted-2">
          {label}
        </div>
        <div className="mt-px font-display text-[15px] font-semibold text-ink">
          {title}
        </div>
      </div>
      {right}
    </div>
  );
}

export const SOURCE_STYLE: Record<string, { fg: string; bg: string; label: string }> = {
  storefront: { fg: "#4326D6", bg: "#EAE5FF", label: "STOREFRONT" },
  whatsapp: { fg: "#1F7A4D", bg: "#E1F0E8", label: "WHATSAPP" },
  web_session: { fg: "#5C574C", bg: "#F1ECE1", label: "WEB SESSION" },
  marketing: { fg: "#B5560A", bg: "#F6E9DD", label: "MARKETING" },
  brand_order: { fg: "#4326D6", bg: "#EAE5FF", label: "BRAND ORDER" },
};
