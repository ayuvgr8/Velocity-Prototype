import type { AgentTask, ContextBundle, Customer, IncludedField } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// getContext() — the core of the thesis (PRD §10).
// Same customer + different task = different contract = different bundle.
// ─────────────────────────────────────────────────────────────────────────────

// The full profile = pre-computed traits + raw events. This is the universe of
// what *could* be known. The contract decides what the agent *actually* gets.
export function buildProfile(customer: Customer): Record<string, unknown> {
  const { rfm, ...flatTraits } = customer.traits;
  return {
    ...flatTraits,
    rfm,
    orders: customer.orders,
    cart: customer.cart,
    messages: customer.messages,
  };
}

// Human-friendly recency labels for the fields where freshness matters.
function freshnessFor(field: string, customer: Customer): string | undefined {
  switch (field) {
    case "orders": {
      const d = customer.traits.days_since_last_order;
      return d === 0 ? "last order: today" : `last order: ${d}d ago`;
    }
    case "cart":
      return customer.cart ? `abandoned ${customer.cart.abandoned_at}` : undefined;
    case "messages": {
      const last = customer.messages[customer.messages.length - 1];
      return last ? `last msg: ${last.ts}` : undefined;
    }
    case "anxiety_signals":
      return customer.traits.anxiety_signals?.length ? "live signal" : undefined;
    case "cross_brand_return_signal":
      return customer.traits.cross_brand_return_signal ? "network graph" : undefined;
    case "rto_risk_score":
    case "churn_score":
      return "model score";
    default:
      return undefined;
  }
}

function pickFields(
  profile: Record<string, unknown>,
  contract: string[],
  customer: Customer
): IncludedField[] {
  return contract
    .filter((f) => profile[f] !== undefined)
    .map((field) => ({
      field,
      value: profile[field],
      freshness: freshnessFor(field, customer),
    }));
}

// Contract order encodes the agent's own priority; we keep it and surface freshness.
function rankByRelevanceAndRecency(included: IncludedField[]): IncludedField[] {
  // Stable: contract order first (already the agent's ranking), but float
  // anything with a live/abandoned freshness signal to the top for visual punch.
  const liveFirst = (f: IncludedField) =>
    f.freshness && /live|abandoned|today/i.test(f.freshness) ? 0 : 1;
  return [...included].sort((a, b) => liveFirst(a) - liveFirst(b));
}

export function getContext(customer: Customer, task: AgentTask): ContextBundle {
  const profile = buildProfile(customer);
  const contract = task.contract;

  const included = rankByRelevanceAndRecency(
    pickFields(profile, contract, customer)
  );

  const excluded = Object.keys(profile).filter(
    (f) => !contract.includes(f) && profile[f] !== undefined
  );

  return {
    customer_id: customer.customer_id,
    task: task.id,
    included,
    excluded,
    rationale: task.decision_logic,
  };
}

// ── Dump-vs-scoped payloads + token estimate (PRD §10) ───────────────────────

// The payload an agent would actually send for generation, in each mode.
export function scopedPayload(bundle: ContextBundle): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const f of bundle.included) obj[f.field] = f.value;
  return obj;
}

export function dumpPayload(customer: Customer): Record<string, unknown> {
  return buildProfile(customer);
}

// Cheap, transparent token estimate (~4 chars / token).
export function estimateTokens(payload: unknown): number {
  return Math.ceil(JSON.stringify(payload).length / 4);
}
