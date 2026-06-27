"use client";

const SOURCES = [
  { name: "Storefront", sub: "orders · catalog" },
  { name: "WhatsApp", sub: "chats · intents" },
  { name: "Payments", sub: "COD · prepaid" },
  { name: "Logistics", sub: "tracking · RTO" },
  { name: "Web / App", sub: "carts · browsing" },
];

const AGENTS_LIST = [
  { name: "COD → Prepaid", active: true },
  { name: "Winback", active: false },
  { name: "Cart Recovery", active: false },
  { name: "RTO Shield", active: false },
  { name: "WIMO", active: false },
  { name: "Upsell + Review", active: false },
];

const CRITERIA = [
  { tag: "CRITERION #1 · UNIFY", color: "#1F7A4D", body: "Identity resolution stitches scattered fragments into one AI-usable profile.", strong: "Proven in panel ①." },
  { tag: "CRITERION #2 · AI-FIRST", color: "#4326D6", body: "English → segment with no SQL, and real AI drafting each message.", strong: "The NL bar + agent acts." },
  { tag: "CRITERION #3 · NEW FEATURES", color: "#B5560A", body: "Cross-brand RTO signal no single brand can see — the moat.", strong: "Vikram, panel ①②." },
  { tag: "CRITERION #4 · SCALE", color: "#B5560A", body: "New agent = new contract over existing traits — no re-architecture.", strong: "Switch tasks in panel ②." },
];

function Arrow({ accent }: { accent?: boolean }) {
  return (
    <div
      className="flex flex-shrink-0 items-center pt-[120px] text-[18px]"
      style={{ color: accent ? "#4326D6" : "#C3BBA8" }}
    >
      →
    </div>
  );
}

export function ArchitectureView() {
  return (
    <div className="min-h-[calc(100vh-58px)] bg-cream px-[30px] pb-16 pt-[30px]">
      <div className="mx-auto max-w-[1340px]">
        <div className="mb-[13px] flex items-center gap-[9px]">
          <span className="h-2 w-2 rounded-full bg-purple-2" />
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted">
            ARCHITECTURE · ONE PICTURE
          </span>
        </div>
        <h2 className="m-0 font-display text-[34px] font-semibold tracking-[-0.02em] text-ink">
          Customer Context Layer
        </h2>
        <p className="mt-2 max-w-[80ch] text-[15px] leading-[1.55] text-muted">
          How an AI agent gets exactly what it needs — the moment it acts, across
          every brand. Sources → identity resolution → unified event + trait store
          → Context API → every agent. One platform, many brands.
        </p>

        {/* horizontal flow */}
        <div className="mt-[26px] flex items-stretch gap-1.5 overflow-x-auto pb-1.5">
          {/* sources */}
          <div className="min-w-[150px] flex-1">
            <div className="mb-2.5 text-center font-mono text-[9.5px] tracking-[0.1em] text-muted-2">
              SOURCES · PER BRAND
            </div>
            <div className="flex flex-col gap-[7px]">
              {SOURCES.map((s) => (
                <div
                  key={s.name}
                  className="rounded-[10px] border border-border bg-panel px-3 py-2.5"
                >
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[#9388E0]" />
                    <span className="font-display text-[13px] font-semibold text-ink">
                      {s.name}
                    </span>
                  </div>
                  <div className="ml-[13px] mt-0.5 text-[10.5px] text-muted-2">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[9px] text-center font-mono text-[9.5px] italic text-[#b3ac9c]">
              scattered · keyed differently
            </div>
          </div>

          <Arrow />

          {/* identity */}
          <div className="min-w-[150px] flex-1">
            <div className="mb-2.5 text-center font-mono text-[9.5px] tracking-[0.1em] text-green">
              IDENTITY — KEYSTONE
            </div>
            <div className="rounded-[14px] border-2 border-green bg-panel px-3.5 py-4 shadow-[0_18px_40px_-26px_rgba(31,122,77,0.6)]">
              <div className="text-center font-mono text-[9.5px] tracking-[0.1em] text-green">
                ✦ KEYSTONE
              </div>
              <div className="mt-2 text-center font-display text-[17px] font-semibold leading-[1.15] text-ink">
                Identity
                <br />
                Resolution
              </div>
              <div className="mt-[11px] flex flex-col items-center gap-[5px]">
                <span className="rounded-full border border-[#CDE6D7] bg-[#EEF6F0] px-2.5 py-[3px] font-mono text-[10px] text-[#2F8157]">
                  phone = anchor
                </span>
                <span className="rounded-full border border-[#CDE6D7] bg-[#EEF6F0] px-2.5 py-[3px] font-mono text-[10px] text-[#2F8157]">
                  works across brands
                </span>
              </div>
              <div className="mt-3.5 flex items-center justify-center gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <span className="h-[9px] w-[9px] rounded-full border-[1.4px] border-green bg-white" />
                  <span className="h-[9px] w-[9px] rounded-full border-[1.4px] border-green bg-white" />
                  <span className="h-[9px] w-[9px] rounded-full border-[1.4px] border-green bg-white" />
                </div>
                <span className="text-[15px] text-green">→</span>
                <span className="h-[18px] w-[18px] rounded-full bg-green" />
              </div>
              <div className="mt-3 text-center text-[11px] text-muted">
                many IDs → one customer
              </div>
            </div>
          </div>

          <Arrow />

          {/* unified data */}
          <div className="min-w-[160px] flex-[1.05]">
            <div className="mb-2.5 text-center font-mono text-[9.5px] tracking-[0.1em] text-muted-2">
              UNIFIED DATA
            </div>
            <div className="rounded-[14px] border border-border bg-panel px-3.5 py-4">
              <div className="text-center font-display text-[15px] font-semibold leading-[1.2] text-ink">
                Unified Profile
                <br />+ Traits
              </div>
              <div className="mt-[11px] rounded-[7px] border border-[#E7E0D0] bg-sunken px-[9px] py-[7px] text-center text-[11px] text-muted">
                Event store · append-only
              </div>
              <div className="mt-1.5 rounded-[7px] border border-[#E7E0D0] bg-sunken px-[9px] py-[7px] text-center text-[11px] text-muted">
                Trait store · current state
              </div>
              <div className="mt-[11px] text-center font-mono text-[9.5px] text-[#928C7C]">
                AI-DERIVED TRAITS
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-[5px]">
                {["RFM", "RTO risk", "Churn", "LTV", "Segment"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#DBD4F0] bg-[#F1EEF9] px-2 py-[3px] font-mono text-[9.5px] text-[#5B4FB0]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-center text-[11px] text-muted">
                one record per human
              </div>
            </div>
          </div>

          <Arrow accent />

          {/* context API — the hero */}
          <div className="min-w-[180px] flex-[1.15]">
            <div className="mb-2.5 text-center font-mono text-[9.5px] tracking-[0.1em] text-muted-2">
              CONTEXT API · THE HERO
            </div>
            <div className="rounded-[14px] bg-dark px-3.5 py-[17px] shadow-[0_22px_48px_-24px_rgba(67,38,214,0.7)]">
              <div className="text-center">
                <span className="rounded-full border border-[#4A3F7A] bg-[#2C2740] px-2.5 py-[3px] font-mono text-[9.5px] tracking-[0.1em] text-[#B5ABF5]">
                  THE HERO
                </span>
              </div>
              <div className="mt-2.5 text-center font-display text-[16px] font-semibold text-[#F2EEE4]">
                Agent Context API
              </div>
              <div className="mt-[9px] text-center font-mono text-[11.5px] text-[#C8BFF2]">
                getContext(customer, task)
              </div>
              <div className="mt-1.5 text-center text-[10.5px] text-[#B7B1A3]">
                returns only what the agent needs
              </div>
              <div className="mt-3 rounded-[10px] border border-[#3C424F] bg-[#262B35] p-[11px]">
                <div className="mb-2 text-center font-mono text-[9.5px] text-[#B5ABF5]">
                  task-scoped bundle
                </div>
                <div className="flex flex-wrap justify-center gap-[5px]">
                  {["RTO risk", "COD %", "AOV", "pay history"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#46506A] bg-[#2F3542] px-2 py-[3px] font-mono text-[9.5px] text-[#C8BFF2]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2.5 text-center text-[10.5px] text-[#B7B1A3]">
                4 fields — not the whole profile
              </div>
              <div className="mt-2 text-center font-mono text-[10px] tracking-[0.06em] text-[#B5ABF5]">
                1 agent = 1 contract
              </div>
            </div>
          </div>

          <Arrow />

          {/* agents */}
          <div className="min-w-[150px] flex-1">
            <div className="mb-2.5 text-center font-mono text-[9.5px] tracking-[0.1em] text-muted-2">
              AGENTS · 1 = 1 CONTRACT
            </div>
            <div className="flex flex-col gap-[7px]">
              {AGENTS_LIST.map((a) => (
                <div
                  key={a.name}
                  className={`rounded-[10px] bg-panel px-3 py-[11px] text-center font-display text-[13px] font-semibold text-ink ${
                    a.active ? "border-2 border-purple" : "border border-border"
                  }`}
                >
                  {a.name}
                  {a.active && (
                    <div className="mt-0.5 text-[9.5px] font-normal text-purple">
                      ← receiving context
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-[9px] text-center font-mono text-[9.5px] text-green">
              → agent acts
            </div>
          </div>
        </div>

        {/* closed loop */}
        <div className="mt-[22px] rounded-[12px] border border-border bg-panel px-[18px] py-3.5 text-center text-[12.5px] leading-[1.5] text-muted">
          <span className="font-mono text-[10px] tracking-[0.1em] text-purple">
            CLOSED LOOP&nbsp;&nbsp;
          </span>
          Every action’s outcome writes back as a new event; traits sharpen; every
          new brand improves the priors for all. The data compounds into a moat.
        </div>

        {/* criteria cards */}
        <div className="mt-[18px] grid grid-cols-1 gap-3.5 md:grid-cols-2 lg:grid-cols-4">
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
