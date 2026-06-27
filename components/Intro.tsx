"use client";

export function Intro({ onEnter, onArch }: { onEnter: () => void; onArch: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-[7vw] py-10">
      {/* soft radial glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-[120px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,#EAE5FF 0%,rgba(234,229,255,0) 68%)",
        }}
      />

      <div className="relative z-[2] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-[9px] w-[9px] rounded-full bg-purple-2 shadow-[0_0_0_4px_rgba(91,61,245,0.14)]" />
          <span className="font-mono text-[11.5px] tracking-[0.18em] text-muted">
            VELOCITY · CUSTOMER CONTEXT LAYER
          </span>
        </div>
        <span className="font-mono text-[11.5px] tracking-[0.18em] text-muted-2">
          TAKE-HOME PROTOTYPE
        </span>
      </div>

      <div className="relative z-[2] flex max-w-[1180px] flex-1 flex-col justify-center">
        <div className="mb-[22px] font-mono text-[12px] tracking-[0.16em] text-purple">
          THE THESIS, MADE CLICKABLE
        </div>
        <h1 className="m-0 max-w-[16ch] font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.04] tracking-[-0.02em] text-balance">
          What does <span className="text-purple">this</span> agent need to know
          about <span className="text-purple">this</span> customer to do{" "}
          <span className="text-purple">this</span> job — right now?
        </h1>
        <p className="mt-[26px] max-w-[62ch] text-[clamp(15px,1.5vw,19px)] leading-[1.6] text-muted">
          A CDP answers{" "}
          <em className="font-semibold not-italic text-ink">who is my customer.</em>{" "}
          This is the layer that answers the harder question — and stays cheap to
          extend as we add agents and brands.
        </p>

        <div className="mt-10 grid max-w-[920px] grid-cols-1 gap-[18px] md:grid-cols-2">
          <div className="rounded-[14px] border border-border bg-panel px-6 py-[22px]">
            <div className="mb-2.5 font-mono text-[11px] tracking-[0.16em] text-purple">
              ▸ THE THESIS
            </div>
            <p className="m-0 text-[14.5px] leading-[1.55] text-ink-2">
              A CDP answers “who is my customer.” We built the layer that answers{" "}
              <strong className="text-ink">
                “what does THIS agent need to know about THIS customer to do THIS
                job, right now”
              </strong>{" "}
              — and stays cheap to extend.
            </p>
          </div>
          <div className="rounded-[14px] border border-border bg-panel px-6 py-[22px]">
            <div className="mb-2.5 font-mono text-[11px] tracking-[0.16em] text-orange">
              ▸ THE METHOD
            </div>
            <p className="m-0 text-[14.5px] leading-[1.55] text-ink-2">
              I didn’t design the data layer in a vacuum. I let the{" "}
              <strong className="text-ink">
                agents’ needs be the forcing function
              </strong>{" "}
              — each agent declares what it needs to act, and that defines what
              the layer must serve.
            </p>
          </div>
        </div>

        <div className="mt-[42px] flex flex-wrap items-center gap-4">
          <button
            onClick={onEnter}
            className="flex cursor-pointer items-center gap-2.5 rounded-[11px] border-none bg-purple px-[26px] py-[15px] font-display text-[15px] font-semibold text-panel shadow-[0_10px_26px_-10px_rgba(67,38,214,0.6)] transition hover:brightness-110"
          >
            Enter the workspace <span className="text-[17px]">→</span>
          </button>
          <button
            onClick={onArch}
            className="cursor-pointer rounded-[11px] border border-border-2 bg-transparent px-[22px] py-[15px] font-display text-[15px] font-medium text-ink transition hover:bg-panel"
          >
            See the architecture
          </button>
          <span className="ml-1.5 font-mono text-[11.5px] tracking-[0.04em] text-muted-2">
            6 personas · 6 agents · live AI
          </span>
        </div>
      </div>
    </div>
  );
}
