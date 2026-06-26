# Why This Product — read this right before the interview

A plain-English brief: what the product does, how it answers every part of the assignment, and why it's the *right* answer (not just *an* answer).

---

## 1. What exactly does this product do?

**One sentence:** It's the **data layer that sits between Velocity's scattered customer data and its AI agents** — it takes the right few facts about a customer and hands them to whichever agent is about to act, at the moment it acts.

**Plain version:** Velocity's customer data is spread across storefront, payments, courier, WhatsApp, web sessions, marketing — and the same person shows up as several different records. Velocity wants ~10 AI agents (WISMO, COD→prepaid, RTO prevention, cart recovery, winback, upsell…). Every one of them only works if it truly knows the customer. This product does three jobs so they all work:

1. **Unifies** the data → resolves "4 records = 1 human" and computes traits (loyalty, risk, churn likelihood).
2. **Serves** each agent exactly the slice it needs — via a **Context Contract** (a short list of fields the agent declares). Not the whole profile; just what *this job* needs.
3. **Acts** — the agent uses that tight context to take the right action (send a prepay nudge, pause COD on a risky order).

**The one idea that makes it different:**

> A CDP answers *"who is my customer?"* (one big profile).
> This product answers *"what does THIS agent need to know about THIS customer to do THIS job, right now?"* (a tight, task-scoped bundle).

---

## 2. How it answers everything the assignment asks

This product isn't a side-answer to the assignment — it *is* the answer. The brief says *"the real question is how to bring all this customer data together so we can keep building AI features on top of it."* That's exactly this product.

| # | The assignment asks… | How the product answers it |
|---|---|---|
| **1** | Unify & organize data (clean, AI-usable) | Identity resolution (deterministic + probabilistic + behavioral, each with a confidence) → one profile. Event store (immutable facts) + trait store (derived, recomputed) keep it clean + auditable. *Live: Priya's 4 records → 1.* |
| **2** | AI does the work, not rules/humans | AI at 5 points: schema mapping, probabilistic identity, trait extraction, **NL segmentation** (English → segment, no SQL), **message generation**. *Live: type "risky COD orders" → AI builds the segment; Claude writes the message.* |
| **3** | New features, incl. what brands don't have | 6 agents today + anticipatory (act before they ask), self-tuning (outcomes sharpen the next decision), and the **cross-brand moat**. *Live: Vikram, 4/5 returns across 3 brands → COD paused pre-dispatch.* |
| **4** | Scale across brands/products/data | The **Context Contract**: new product = new contract over existing traits = no re-architecture. Multi-tenant; cross-brand sharing is governed (derived scores, never raw PII). *Live: same customer, switch task → contract changes.* |
| **5** | Build first vs defer, and why | Phased roadmap (deck): foundation first → low-regret clean-data agents → defer high-stakes (RTO needs volume; returns/autonomy touch money + policy). Prioritized by value × data-readiness × risk. |

The brief says "a write-up, a deck, OR a small prototype — any one is fine." We deliver **all three** (prototype + deck + diagram).

---

## 3. Why it's *good* at solving this case study

1. **It attacks the real bottleneck, not the shiny one.** A weaker answer builds one agent. This solves the *shared foundation* every agent needs — the assignment's actual insight: every agent fails the same way (partial context).

2. **The method is the differentiator.** Most people design a schema then hope agents can use it. This inverts it: **the agents' needs are the forcing function.** That's why it serves products you haven't built yet — the hardest requirement.

3. **Genuinely AI-first, and proves it live.** You watch English become a segment and Claude write a real message on minimal context. Told → shown.

4. **The cross-brand moat is a non-obvious, defensible insight.** Most treat multi-brand as a scaling headache. This reframes it as the moat: pooled RTO/churn signals no single brand can see. Product strategy, not just engineering.

5. **Restraint signals seniority.** The prototype deliberately has no DB, no auth, no real integrations — and the deck explains why that's correct for a 1–2 day brief. Knowing what *not* to build is the same judgment #5 tests.

---

## The 10-second pitch

> "I didn't build one agent — I built the layer that makes *all* the agents possible. It unifies the data, then gives each agent exactly the context its job needs through a declarative contract. New product? New contract — no re-architecture. And because it's one platform across many brands, the data compounds into a moat no single brand can build."
