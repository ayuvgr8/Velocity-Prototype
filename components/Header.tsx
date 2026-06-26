"use client";

import type { Mode } from "@/lib/engine/client";

export function Header({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 py-4 flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-accent" />
            <span className="font-semibold tracking-tight text-ink">
              Velocity · Customer Context Layer
            </span>
          </div>
          <p className="mt-1.5 text-sm text-muted max-w-2xl leading-snug">
            A CDP answers <em>“who is my customer.”</em> This layer answers{" "}
            <span className="text-ink font-medium">
              “what does THIS agent need to know about THIS customer to do THIS
              job, right now”
            </span>{" "}
            — across many brands.
          </p>
        </div>

        <ModeToggle mode={mode} setMode={setMode} />
      </div>
    </header>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  return (
    <div className="shrink-0">
      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
        {(["mock", "live"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              mode === m
                ? "bg-white text-ink shadow-sm border border-slate-200"
                : "text-muted hover:text-ink"
            }`}
          >
            {m === "mock" ? "Mock (deterministic)" : "Live (Claude)"}
          </button>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted text-right">
        {mode === "live"
          ? "Calls Claude — needs ANTHROPIC_API_KEY"
          : "No API key needed"}
      </p>
    </div>
  );
}
