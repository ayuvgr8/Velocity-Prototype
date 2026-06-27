"use client";

import type { Mode } from "@/lib/engine/client";

export type View = "intro" | "workspace" | "architecture";

export function Header({
  view,
  setView,
  mode,
  setMode,
  onStartDemo,
}: {
  view: View;
  setView: (v: View) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  onStartDemo: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3.5 bg-panel/[0.86] backdrop-blur-[10px] border-b border-border">
      <button
        onClick={() => setView("intro")}
        className="flex items-center gap-3 cursor-pointer"
      >
        <span className="w-[9px] h-[9px] rounded-full bg-purple-2 shadow-[0_0_0_4px_rgba(91,61,245,0.14)]" />
        <span className="font-display font-bold text-[16px] tracking-[-0.01em] text-ink">
          Velocity
        </span>
        <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted-2 border-l border-border pl-3.5">
          CONTEXT LAYER
        </span>
      </button>

      <div className="flex items-center gap-2">
        {/* Workspace / Architecture tabs */}
        <div className="flex bg-chip border border-border rounded-[9px] p-[3px] gap-[2px]">
          {(["workspace", "architecture"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`font-sans font-medium text-[13px] rounded-md px-3.5 py-[7px] transition ${
                view === v
                  ? "bg-ink text-panel"
                  : "text-ink hover:bg-panel/60"
              }`}
            >
              {v === "workspace" ? "Workspace" : "Architecture"}
            </button>
          ))}
        </div>

        {/* Guided demo */}
        <button
          onClick={onStartDemo}
          className="flex items-center gap-[7px] font-sans font-medium text-[13px] text-ink bg-panel border border-border-2 rounded-[9px] px-3.5 py-2 cursor-pointer hover:bg-cream transition"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-orange" />
          Guided demo
        </button>

        {/* LIVE AI / MOCK */}
        <div className="flex items-center bg-chip border border-border rounded-[9px] p-[3px] gap-[2px]">
          <button
            onClick={() => setMode("live")}
            className={`font-mono text-[11px] tracking-[0.06em] rounded-md px-[11px] py-[7px] transition ${
              mode === "live" ? "bg-purple text-panel" : "text-muted"
            }`}
          >
            ● LIVE AI
          </button>
          <button
            onClick={() => setMode("mock")}
            className={`font-mono text-[11px] tracking-[0.06em] rounded-md px-[11px] py-[7px] transition ${
              mode === "mock" ? "bg-ink text-panel" : "text-muted"
            }`}
          >
            MOCK
          </button>
        </div>
      </div>
    </header>
  );
}
