# 90-second opening — Velocity PM-AI

*Say this first. It leads with the thinking, frames the prototype as a deliberate proof (not over-investment), and sets up the demo. ~210 words ≈ 90 seconds. Speak it, don't read it.*

---

## The script

> "Velocity's real problem isn't the agents — it's that **every agent only works if it truly knows the customer at the moment it acts**, and that data is scattered everywhere.
>
> So I didn't design a data schema and hope agents could use it. I **inverted it** — I let the **agents' needs be the forcing function**. Each agent declares the few fields it needs to act; that *declaration* defines what the data layer has to serve.
>
> That gives one idea: a **Context Layer**. A CDP answers *'who is my customer.'* This answers *'what does THIS agent need to know about THIS customer to do THIS job, right now'* — and serves only those fields, through a small **contract**.
>
> Three things fall out of that:
> one, a **new product is just a new contract** over existing traits — no re-architecture;
> two, because it's **one platform across many brands**, the data compounds into a moat a single brand can't build;
> three, it makes today's WhatsApp agent smarter the day it ships.
>
> I time-boxed the **thinking** to your five questions. The prototype is a deliberately **thin, clickable proof** — fake data, no real infra — built just to make the idea undeniable. Let me show you in two minutes, then walk the deck."

---

## Then go straight into the demo (the 6 beats)
*(full version in `DEMO_GUIDE.md` §1)*

1. **Segment in English** — type *"risky COD orders I shouldn't ship"* → a whole cohort lights up. *No SQL.*
2. **Identity** — click **Priya** → 4 records resolve into one human. *The keystone.*
3. **Task-scoped context** — run COD→Prepaid → tight bundle; toggle **Full dump** → token delta.
4. **Switch the task** — same customer, **Winback** → contract changes. *That's how product #11 ships.*
5. **The moat** — **Vikram** → RTO Shield → *"COD paused — network signal from 3 brands."*
6. **It acts** — hit **Generate** → real Claude message from only the bundle. *(Or show the 7th agent, Returns & Refunds, as "this didn't exist last week — just a new contract.")*

Close: *"Today's agent gets smarter now; every new agent is just a contract; across brands the data compounds. The deck covers how it scales and what I'd build first."*

---

## Three framing lines to keep in your pocket
- **If they ask "why so polished for a take-home?"** → *"The thinking was time-boxed to a day; the prototype is a thin proof I built fast — the restraint is deliberate: no DB, no auth, no real integrations, on purpose."*
- **If they push on novelty** → *"The novel bit isn't an LLM call — it's letting agent needs define the data layer, so it serves products we haven't built yet."*
- **If they ask the hardest one ("what would break first?")** → *"Identity false-merges at scale, and cold-start for tiny brands. I tune for precision over recall and fall back to platform-wide priors. It's on the Risks slide."*
