# Velocity · Customer Context Layer (Interactive Prototype)

> **Thesis:** A CDP answers *"who is my customer."* This layer answers
> **"what does THIS agent need to know about THIS customer to do THIS job, right now"** — and stays cheap to extend as we add agents and brands.
>
> **Method:** The data layer wasn't designed in a vacuum. The **agents' needs are the forcing function** — each agent declares what it needs to act, and that defines what the layer must serve.

A *thinking prototype* (not production infra) for the Velocity PM-AI take-home. Every "backend" is simulated with **static sample data** — no DB — so the idea lands in two minutes.

---

## What it shows (single screen)

1. **Ask in plain English** — type an audience ("risky COD orders I shouldn't ship") and the AI parses it into a structured filter and highlights matching personas. No SQL, no rules. *(grading criterion #2)*
2. **Identity resolution** — scattered fragments (storefront, WhatsApp, web session, cross-brand orders) collapse into one unified profile with anchor · method · confidence. *(#1)*
3. **Context Contract** — pick an agent; see the tight, ranked bundle it declares it needs (green, with values + recency) vs everything excluded (greyed, struck). New agent = new contract over the same data → no re-architecture. *(#4)*
4. **Dump vs task-scoped** — toggle and watch the token payload shrink. *(#2/#4)*
5. **Agent acts** — a real (Claude) or mock WhatsApp message built from *only* that bundle. *(#2/#3)*
6. **Switch the task on the same customer** — contract and context change. The extensibility proof.

**Demo moments that land:** NL segmentation (any query), identity resolution (Priya, Vikram), the **cross-brand RTO moat** (Vikram — a pattern only Velocity can see across 3 brands), real AI acting on minimal context.

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

Works fully in **Mock mode** with no API key (deterministic — ideal for the demo).

### Live mode (real Claude)

Set an Anthropic key, then toggle **Live** in the top-right:

```bash
cp .env.example .env
# edit .env → ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

- `/api/segment` → parses plain English → structured filter JSON
- `/api/generate` → drafts the WhatsApp message from the task-scoped bundle

If the key is missing or a call fails, the UI **falls back to mock automatically**.

---

## Deploy to Vercel

1. Push this repo and import it in Vercel (framework auto-detected: Next.js).
2. (Optional) add `ANTHROPIC_API_KEY` in Project → Settings → Environment Variables to enable Live mode.
3. Deploy. Mock mode needs no env at all.

---

## Architecture

![Velocity Customer Context Layer architecture](assets/architecture.png)

*Sources → ① AI schema mapping → ② identity resolution → ③ event + trait store → ④ Context API → agents (one contract each) → closed learning loop. The prototype implements layer ④ and the visible parts of ②. Full walkthrough in [`DECK.md`](DECK.md).*

**Request flow:**

```
ask in plain English ─► /api/segment (or mock) ─► SegmentFilter ─► applySegment() ─► highlight personas   (#2)
pick(customer) ───────► identity fragments ─────► unified profile + traits                                 (#1)
pick(agent) ──────────► Context Contract ───────► getContext() ─► ranked bundle (included vs excluded)      (#4)
                                                          └─► /api/generate (or mock) ─► WhatsApp message    (#2/#3)
```

| Path | Role |
|---|---|
| `lib/types.ts` | Data model (PRD §6) |
| `lib/data/customers.ts` | 6 personas, encoded verbatim (PRD §7) |
| `lib/data/agents.ts` | 6 agents + their Context Contracts (PRD §8) |
| `lib/engine/getContext.ts` | Contract resolution, ranking, dump-vs-scoped + token estimate (PRD §10) |
| `lib/engine/segment.ts` | NL → filter (mock canned + keyword fallback) and `applySegment` (PRD §9) |
| `lib/engine/client.ts` | Client calls to both API routes with mock fallback |
| `app/api/{generate,segment}/route.ts` | Anthropic Messages API routes (PRD §11) |
| `app/page.tsx` + `components/*` | Single-screen UI (PRD §12) |

**Out of scope by design** (the restraint is the senior signal): no database, no auth, no real ingestion/connectors, no real WhatsApp/Razorpay/Shiprocket, no real ML — traits are pre-computed numbers in the sample data.

---

## Demo script (~2.5 min)

1. Open on the thesis. *"Every agent is only as good as what it knows the moment it acts."*
2. Type **"risky COD orders I shouldn't ship"** → Vikram lights up. *No SQL — AI turns English into a segment.*
3. Click **Priya** → fragments resolve. *Four records, one human. The keystone.*
4. Run **COD→Prepaid** on Priya → tight bundle; toggle to **dump**. *Same data, agent needs only this.* Generate live.
5. Switch Priya to **Winback** → *same customer, different job → different contract.* That's how product #11 ships without re-architecting.
6. Click **Vikram** → **RTO Shield** → *one brand sees one return; we see 4 across 3 brands. The network is the moat — COD paused before we ship at a loss.*
7. Close: *this makes today's WhatsApp agent smarter now; every new agent just declares a contract over the same data.*
