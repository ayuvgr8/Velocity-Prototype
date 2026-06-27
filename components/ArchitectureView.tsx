"use client";

const CRITERIA = [
  { tag: "CRITERION #1 · UNIFY", color: "#1F7A4D", body: "Identity resolution stitches scattered fragments into one AI-usable profile.", strong: "Proven in panel ①." },
  { tag: "CRITERION #2 · AI-FIRST", color: "#4326D6", body: "English → segment with no SQL, and real AI drafting each message.", strong: "The NL bar + agent acts." },
  { tag: "CRITERION #3 · NEW FEATURES", color: "#B5560A", body: "Cross-brand RTO signal no single brand can see — the moat.", strong: "Vikram, panel ①②." },
  { tag: "CRITERION #4 · SCALE", color: "#B5560A", body: "New agent = new contract over existing traits — no re-architecture.", strong: "Switch tasks in panel ②." },
];

export function ArchitectureView() {
  return (
    <div className="min-h-[calc(100vh-58px)] bg-cream px-4 pb-16 pt-6 sm:px-[30px] sm:pt-[30px]">
      <div className="mx-auto max-w-[1340px]">
        {/* animated architecture diagram (scrolls horizontally on small screens) */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-[#F4F0E6] p-2 sm:p-3">
          <img
            src="/architecture-animated.svg"
            alt="Velocity Customer Context Layer architecture — sources to identity resolution to unified event + trait store to Context API to agents, with a closed learning loop"
            className="block h-auto w-full min-w-[820px]"
          />
        </div>

        {/* criteria cards */}
        <div className="mt-[18px] grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {CRITERIA.map((c) => (
            <div
              key={c.tag}
              className="rounded-[12px] border border-border bg-panel p-4"
            >
              <div
                className="font-mono text-[10px] tracking-[0.08em]"
                style={{ color: c.color }}
              >
                {c.tag}
              </div>
              <div className="mt-[7px] text-[13px] leading-[1.5] text-ink-2">
                {c.body} <strong className="text-ink">{c.strong}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
