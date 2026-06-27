# Demo Guide — Velocity Customer Context Layer

Everything you need to drive the prototype in the interview: the click-by-click flow, the exact phrases to type, what each moment proves, the questions you'll be asked (with answers), and questions to pose back.

- **Live demo:** https://velocity-prototype-gefb.vercel.app/
- **Repo:** the prototype + `DECK.md` (the thinking) + `assets/architecture.png` (the diagram)
- **Default mode is Mock** — deterministic, works with no API key. Flip the top-right toggle to **Live** to prove the AI is real.

---

## 0. Before you present (2-min sanity check)

Run through this once on the live URL so nothing surprises you on the call:

1. Page loads; you see the **"Ask in plain English"** bar, 6 customers in the left rail, and an empty-state panel on the right.
2. Click the chip **"risky COD orders I shouldn't ship"** → **Vikram** highlights and auto-selects.
3. Click **Priya** → her 4 fragments resolve into one profile.
4. In the **Context Contract** panel, click **Full dump** then **Task-scoped** → the token bar visibly changes.
5. Scroll to **Agent Acts** → a WhatsApp message shows.
6. *(If you added `ANTHROPIC_API_KEY` in Vercel)* flip top-right to **Live**, pick **Rahul**, click **Generate live** → a fresh Claude message appears with a green "generated live by Claude" badge. *(If you didn't add the key, Live silently falls back to Mock — still fine, just stay in Mock.)*

If all six pass, you're ready. If Live doesn't generate, you simply haven't set the env var — Mock carries the whole demo.

---

## 1. The 2.5-minute demo flow (say + click)

Keep it to these six beats. The numbers in brackets are the grading criteria each beat lands.

| # | You say | You click |
|---|---------|-----------|
| 1 | "Every agent is only as good as what it knows the moment it acts. A CDP tells you *who* the customer is. We built the layer that tells the agent *what it needs to act, right now.*" | (nothing — just the screen) |
| 2 | "No SQL, no rules — I type the audience in English and the AI turns it into a live segment over the unified data." **[#2]** | Type / click chip **"risky COD orders I shouldn't ship"** → Vikram lights up |
| 3 | "Four scattered records — storefront, WhatsApp, a web session — resolve into one human, with a confidence on every link. Nothing downstream works without this." **[#1]** | Click **Priya** → watch fragments merge |
| 4 | "Same customer, but the COD→Prepaid agent only needs *these* fields. Watch the payload when I send everything vs. just the contract." **[#2/#4]** | In Context Contract, toggle **Full dump ⇄ Task-scoped** → point at the token delta |
| 5 | "Same customer, *different job*. Switch to Winback — the contract changes, the context changes. That's how we ship product #11 without re-architecting." **[#4]** | Click the **Winback** task chip on Priya → amber "exploring" tag + new fields |
| 6 | "One brand sees Vikram return one order. *We* see 4 of 5 returned across three brands. The agent pauses COD before we ship at a loss. No single brand can build this — the network is the moat." **[#3]** | Click **Vikram** → **RTO Shield** → point at the red "COD paused — network signal from 3 brands" badge |
| — | "Today's WhatsApp agent gets smarter the day this ships; every new agent just declares a contract over the same data. The deck covers how it scales and what I'd build first." | (close) |

**If you have an API key set:** do beat 4 or 6 in **Live** mode and hit **Generate live** so they watch Claude write the message in real time. That's the highest-impact 5 seconds of the demo.

---

## 2. Exact prompts to type in "Ask in plain English"

These are the canned queries — they're guaranteed to work in Mock mode (each is also a clickable chip). Type any of them, or improvise; in Live mode the AI parses free text too.

| Type this | The AI parses it to | Highlights | Use it to show |
|-----------|---------------------|-----------|----------------|
| `risky COD orders I shouldn't ship` | `rto_risk ≥ 0.7 AND order pending_dispatch` | **Vikram** | The headline moment — risk caught pre-dispatch |
| `loyal COD buyers worth converting to prepaid` | `cod_ratio ≥ 0.5 AND orders ≥ 4 AND rto_risk < 0.6` | **Priya** | Margin play — precise multi-condition parse |
| `high-value customers who've gone quiet` | `churn ≥ 0.6 AND ltv ≥ ₹10k` | **Rahul** | Winback targeting |
| `customers about to abandon a purchase` | `cart exists` | **Anjali** | Live-signal segment |
| `anxious first-time buyers` | `is_first_order = true AND sentiment = anxious` | **Sneha** | Sentiment + lifecycle combined |
| `happy customers ready to buy more` | `sentiment = very_positive AND orders ≥ 3` | **Arjun** | Upsell targeting |
| `everyone who prefers COD` | `preferred_payment = COD` | **Priya, Vikram** | Multi-match (2 people) |
| `who's at risk of churning?` | `churn ≥ 0.5` | **Rahul, Vikram** | Broad risk sweep |

**To show off Live mode**, type something *not* in the list, e.g.:
- `big spenders who haven't ordered in months`
- `first timers who seem nervous about delivery`
- `people who keep sending stuff back`

In Live mode the AI parses these into structured filters on the fly — proving it's genuinely the model, not a lookup table.

---

## 3. Prompts the *agent* uses (for when they ask "what's the actual AI call?")

Two real Claude calls power the prototype (see `app/api/`):

- **Segmentation** (`/api/segment`): *"Translate a marketer's plain-English audience into a structured filter over these trait fields… return ONLY valid JSON."* → English → `{conditions, human_readable}`.
- **Message generation** (`/api/generate`): *"You are the {agent role}… write ONE WhatsApp message… use ONLY the provided task-scoped context; invent nothing… output only the message body."* → context bundle → WhatsApp copy.

The point to make: **the agent only ever sees the task-scoped bundle**, never the full profile. That's the whole thesis, enforced at the prompt boundary.

---

## 4. Questions they'll ask you — and strong answers

**Q: Why not just use a CDP / Segment / a data warehouse?**
A CDP unifies the profile — that's necessary but not sufficient. It answers "who is the customer," then hands the agent everything and hopes. Our layer answers "what does *this* agent need for *this* job" and serves a tight bundle. The CDP is a *component inside* our store (layer 3b); the product is the contract + resolution + serving on top.

**Q: Isn't "just send fewer fields" a trivial optimization?**
It's not about token cost (though that's real — 70–90% smaller). It's about **extensibility**: because every agent reads the same trait store through a declarative contract, a new product is a new contract, not a new data pipeline. Platform cost stays ~O(1) in number of products. That's the difference between a roadmap that speeds up and one that bogs down.

**Q: How does identity resolution actually work? What about wrong merges?**
Three escalating signals — deterministic (phone/email), probabilistic (name+address+device, AI-scored), behavioral (session→buyer) — each link carrying a confidence. We tune for **precision over recall early**: low-confidence merges are held for review, not auto-joined, because a wrong merge (two people fused) is worse than a missed one. Cross-brand is the same graph, one level up.

**Q: The traits are hard-coded. Where's the real ML?**
Deliberately deferred. For a 1–2 day prototype, pre-computed traits let me prove the *architecture* — which is the question being asked. In production, traits are recomputed from the event log by models (churn, RTO-risk, sentiment). The split between event store (truth) and trait store (derived) is exactly what lets us swap heuristics for ML later without touching a single agent contract.

**Q: How does cross-brand sharing not violate privacy?**
Brands never see each other's raw data. We share **derived scores** — "elevated network RTO risk" — never another brand's orders or PII. It's a governed, privileged join, DPDP-aware, with per-brand consent flags travelling with the customer. The contract itself minimizes PII reaching the model.

**Q: What would you build first, and what would you cut?**
Foundation first (identity + stores + context API) — nothing works without it. Then low-regret, clean-data agents: Proactive WIMO, Cart Recovery, COD→Prepaid. Defer high-stakes ones (RTO Shield needs volume to trust; pausing COD on a good customer is a costly false positive) and anything money/policy-touching (returns adjudication, autonomous send). The restraint *is* the answer — same reason the prototype has no DB, no auth, no real integrations.

**Q: Why WhatsApp messages? Why not show dashboards?**
Because the agent's job is to *act*, and on this platform acting = sending the right message at the right moment. The message is the visible proof that minimal, correct context produces a correct action.

**Q: Does this scale to 1,000 brands / millions of customers?**
The serving path is a keyed lookup + field projection — cheap and horizontally scalable. Trait recomputation is batch/streaming off the event log. Multi-tenancy is brand-scoped by default; the only cross-tenant path is the governed score-sharing join. The thing that *doesn't* scale linearly — engineering effort per new product — is exactly what the contract mechanism flattens.

**Q: What's the weakest part / what would break first?**
Identity resolution at scale (false-merge rate) and cold-start for tiny brands (thin trait history). Both are called out on the Risks slide. Mitigations: confidence thresholds + human review; platform-wide priors + conservative actions until a brand has volume.

---

## 5. Questions YOU can pose in the deck (to frame the conversation)

Open or punctuate sections with these — they make *them* arrive at your thesis:

1. **"Your roadmap has 10 products. How many separate data integrations is that — and what happens to integration #11?"** *(sets up the contract mechanism)*
2. **"When the COD→Prepaid agent fires, does it need the customer's full history — or three numbers? What does sending the other 40 fields cost you in noise, latency, and wrong actions?"** *(sets up task-scoping)*
3. **"A customer returns one order at Brand A. Is that a problem? Now they've returned 4 of 5 across three of your brands. Which brand can see that today — and which should?"** *(sets up the cross-brand moat)*
4. **"If your data team writes the segment, how fast can marketing test a new audience? What if they could just type it?"** *(sets up NL segmentation)*
5. **"When an agent sends a nudge and it works — or doesn't — where does that learning go? Does the next agent get smarter, or start from zero?"** *(sets up the closed loop)*
6. **"What's the most expensive thing you ship today? An order you already know will be returned. What would it be worth to stop it before dispatch?"** *(frames ROI)*

---

## 6. One-line framing to repeat

> A CDP answers *who is my customer.*
> We built the layer that answers *what does THIS agent need to know about THIS customer to do THIS job, right now* —
> and because it's one platform across many brands, the data compounds into a moat no single brand can build.

---

## 7. Files in this submission

| File | What it is |
|------|-----------|
| Live URL / `app/` + `lib/` + `components/` | The interactive prototype |
| `DECK.md` | The full 16-slide thinking (architecture, AI-first, roadmap) |
| `DECK_SHORT.md` | Tight 10-slide version for a time-boxed presentation |
| `exports/…Deck.pdf` / `.pptx` | Full deck — PDF (share) + PPTX (**with per-slide speaker notes**) |
| `exports/…Deck-SHORT.pdf` / `.pptx` | Short deck — PDF + PPTX (**with speaker notes**) |
| `WHY_THIS_PRODUCT.md` | Plain-English brief: what it does + why it answers the assignment |
| `assets/architecture.png` / `.svg` | The architecture diagram |
| `DEMO_GUIDE.md` | This file |
