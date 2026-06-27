import type { Customer, SegmentCondition, SegmentFilter } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Natural-language segmentation (PRD §9).
// English → SegmentFilter (mock canned lookup OR live Claude) → applied here.
// This is the AI-first proof: the same unified traits that power agents also
// power instant, language-driven segmentation — no SQL, no hand-written rules.
// ─────────────────────────────────────────────────────────────────────────────

// Canned NL → filter lookups so the demo never fails live (PRD §9 table).
// Keyed by a normalized form of the example query.
export const CANNED_SEGMENTS: { query: string; filter: SegmentFilter }[] = [
  {
    query: "loyal COD buyers worth converting to prepaid",
    filter: {
      conditions: [
        { field: "cod_prepaid_ratio", op: ">=", value: 0.5 },
        { field: "order_count", op: ">=", value: 4 },
        { field: "rto_risk_score", op: "<", value: 0.6 },
      ],
      human_readable: "prefers COD · ≥4 orders · not high-risk",
    },
  },
  {
    query: "high-value customers who've gone quiet",
    filter: {
      conditions: [
        { field: "churn_score", op: ">=", value: 0.6 },
        { field: "ltv", op: ">=", value: 10000 },
      ],
      human_readable: "high churn risk · LTV ≥ ₹10,000",
    },
  },
  {
    query: "customers about to abandon a purchase",
    filter: {
      conditions: [{ field: "cart", op: "exists" }],
      human_readable: "has a live abandoned cart",
    },
  },
  {
    query: "risky COD orders I shouldn't ship",
    filter: {
      conditions: [
        { field: "rto_risk_score", op: ">=", value: 0.7 },
        { field: "order.status", op: "==", value: "pending_dispatch" },
      ],
      human_readable: "RTO risk ≥ 0.7 · order pending dispatch",
    },
  },
  {
    query: "anxious first-time buyers",
    filter: {
      conditions: [
        { field: "is_first_order", op: "==", value: true },
        { field: "sentiment", op: "==", value: "anxious" },
      ],
      human_readable: "first order · anxious sentiment",
    },
  },
  {
    query: "happy customers ready to buy more",
    filter: {
      conditions: [
        { field: "sentiment", op: "==", value: "very_positive" },
        { field: "order_count", op: ">=", value: 3 },
      ],
      human_readable: "very positive · ≥3 orders",
    },
  },
  {
    query: "everyone who prefers COD",
    filter: {
      conditions: [{ field: "preferred_payment", op: "==", value: "COD" }],
      human_readable: "prefers COD",
    },
  },
  {
    query: "who's at risk of churning?",
    filter: {
      conditions: [{ field: "churn_score", op: ">=", value: 0.5 }],
      human_readable: "churn risk ≥ 0.5",
    },
  },
  {
    query: "customers with an open return or refund",
    filter: {
      conditions: [{ field: "refund_status", op: "exists" }],
      human_readable: "has an open return / pending refund",
    },
  },
];

function normalize(q: string): string {
  return q.trim().toLowerCase().replace(/[?.!]+$/g, "").replace(/\s+/g, " ");
}

// Mock parser: exact match first, then a light keyword fallback so free-typed
// queries in mock mode still land on a sensible canned filter.
export function parseSegmentMock(query: string): SegmentFilter {
  const n = normalize(query);

  const exact = CANNED_SEGMENTS.find((c) => normalize(c.query) === n);
  if (exact) return exact.filter;

  const has = (...words: string[]) => words.some((w) => n.includes(w));
  if (has("refund", "complaint") || has("open return") || has("want to return"))
    return findFilter("customers with an open return or refund");
  if (has("abandon", "cart")) return findFilter("customers about to abandon a purchase");
  if (has("churn", "quiet", "lapsed", "dormant", "gone")) {
    if (has("high-value", "high value", "valuable", "ltv"))
      return findFilter("high-value customers who've gone quiet");
    return findFilter("who's at risk of churning?");
  }
  if (has("risky", "rto", "shouldn't ship", "should not ship", "dispatch"))
    return findFilter("risky COD orders I shouldn't ship");
  if (has("anxious", "first-time", "first time", "nervous"))
    return findFilter("anxious first-time buyers");
  if (has("happy", "buy more", "upsell", "ready to buy"))
    return findFilter("happy customers ready to buy more");
  if (has("cod") && has("convert", "prepaid", "loyal"))
    return findFilter("loyal COD buyers worth converting to prepaid");
  if (has("cod")) return findFilter("everyone who prefers COD");

  // Default: prefers COD — at least highlights something meaningful.
  return {
    conditions: [],
    human_readable: "couldn't parse — try a chip below",
  };
}

function findFilter(query: string): SegmentFilter {
  return CANNED_SEGMENTS.find((c) => c.query === query)!.filter;
}

// ── Apply a filter to the personas (PRD §10 applySegment) ────────────────────

function traitValue(c: Customer, field: string): unknown {
  if (field.startsWith("rfm.")) {
    return (c.traits.rfm as unknown as Record<string, unknown>)[field.slice(4)];
  }
  return (c.traits as unknown as Record<string, unknown>)[field];
}

function compare(a: unknown, op: SegmentCondition["op"], b: unknown): boolean {
  switch (op) {
    case ">=":
      return Number(a) >= Number(b);
    case "<=":
      return Number(a) <= Number(b);
    case ">":
      return Number(a) > Number(b);
    case "<":
      return Number(a) < Number(b);
    case "==":
      return a === b;
    case "exists":
      return a !== undefined && a !== null;
    default:
      return false;
  }
}

export function matches(c: Customer, cond: SegmentCondition): boolean {
  // Special, non-trait fields the NL parser may emit.
  if (cond.field === "cart") return compare(c.cart, cond.op, cond.value);
  if (cond.field === "order.status") {
    return c.orders.some((o) => compare(o.status, cond.op, cond.value));
  }
  if (cond.field.startsWith("cart.")) {
    return compare(c.cart, "exists", undefined);
  }
  return compare(traitValue(c, cond.field), cond.op, cond.value);
}

export function applySegment(filter: SegmentFilter, customers: Customer[]): string[] {
  if (!filter.conditions.length) return [];
  return customers
    .filter((c) => filter.conditions.every((cond) => matches(c, cond)))
    .map((c) => c.customer_id);
}
