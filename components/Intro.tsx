"use client";

export function Intro({ onEnter, onArch }: { onEnter: () => void; onArch: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-5 py-10 sm:px-[7vw]">
      {/* faint dotted-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,18,12,0.045) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 80%)",
        }}
      />
      {/* floating gradient blobs */}
      <div
        className="pointer-events-none absolute -right-24 -top-[140px] h-[560px] w-[560px] rounded-full"
        style={{
          background: "radial-gradient(circle,#EAE5FF 0%,rgba(234,229,255,0) 68%)",
          animation: "vDrift 14s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-[440px] w-[440px] rounded-full"
        style={{
          background: "radial-gradient(circle,#FBE7D6 0%,rgba(251,231,214,0) 70%)",
          animation: "vDrift2 18s ease-in-out infinite",
        }}
      />

      <div className="relative z-[2] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-[9px] w-[9px] rounded-full bg-purple-2 shadow-[0_0_0_4px_rgba(91,61,245,0.14)]" />
          <span className="font-mono text-[11.5px] tracking-[0.18em] text-muted">
            VELOCITY · CUSTOMER CONTEXT LAYER
          </span>
        </div>
        <span className="hidden font-mono text-[11.5px] tracking-[0.18em] text-muted-2 sm:inline">
          TAKE-HOME PROTOTYPE
        </span>
      </div>

      <div className="relative z-[2] flex max-w-[1180px] flex-1 flex-col justify-center">
        <div className="v-rise mb-[22px] font-mono text-[12px] tracking-[0.16em] text-purple" style={{ animationDelay: "0ms" }}>
          THE THESIS, MADE CLICKABLE
        </div>
        <h1
          className="v-rise m-0 max-w-[16ch] font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.04] tracking-[-0.02em] text-balance"
          style={{ animationDelay: "80ms" }}
        >
          What does <span className="v-grad-text">this</span> agent need to know
          about <span className="v-grad-text">this</span> customer to do{" "}
          <span className="v-grad-text">this</span> job — right now?
        </h1>
        <p
          className="v-rise mt-[26px] max-w-[62ch] text-[clamp(15px,1.5vw,19px)] leading-[1.6] text-muted"
          style={{ animationDelay: "160ms" }}
        >
          A CDP answers{" "}
          <em className="font-semibold not-italic text-ink">who is my customer.</em>{" "}
          This is the layer that answers the harder question — and stays cheap to
          extend as we add agents and brands.
        </p>

        <div
          className="v-rise mt-10 grid max-w-[920px] grid-cols-1 gap-[18px] md:grid-cols-2"
          style={{ animationDelay: "240ms" }}
        >
          <div className="rounded-[14px] border border-border bg-panel/80 px-6 py-[22px] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-purple/40 hover:shadow-[0_18px_40px_-26px_rgba(67,38,214,0.5)]">
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
          <div className="rounded-[14px] border border-border bg-panel/80 px-6 py-[22px] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_18px_40px_-26px_rgba(248,125,12,0.4)]">
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

        <div
          className="v-rise mt-[42px] flex flex-wrap items-center gap-3"
          style={{ animationDelay: "320ms" }}
        >
          <button
            onClick={onEnter}
            className="group flex cursor-pointer items-center gap-2.5 rounded-[12px] border-none bg-gradient-to-r from-[#4326D6] to-[#7c3aed] px-[26px] py-[15px] font-display text-[15px] font-semibold text-panel shadow-[0_12px_30px_-10px_rgba(67,38,214,0.65)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_-10px_rgba(67,38,214,0.75)]"
          >
            Enter the workspace
            <span className="text-[17px] transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
          <button
            onClick={onArch}
            className="cursor-pointer rounded-[12px] border border-border-2 bg-panel/70 px-[22px] py-[15px] font-display text-[15px] font-medium text-ink backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-ink/30 hover:bg-panel"
          >
            See the architecture
          </button>
          <span className="ml-1 inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.04em] text-muted-2">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="absolute inline-flex h-full w-full animate-[vPulse_1.6s_ease_infinite] rounded-full bg-green" />
              <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-green" />
            </span>
            7 personas · 7 agents · live AI / mock demo
          </span>
        </div>
      </div>
    </div>
  );
}
