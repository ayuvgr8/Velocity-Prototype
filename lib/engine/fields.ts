// Trait field catalog passed to Claude for live NL → filter parsing (PRD §11).
// Kept in one place so the live prompt and the data model never drift apart.

export const TRAIT_FIELDS: { field: string; type: string; note?: string }[] = [
  { field: "order_count", type: "number" },
  { field: "aov", type: "number", note: "average order value, INR" },
  { field: "ltv", type: "number", note: "lifetime value, INR" },
  { field: "cod_prepaid_ratio", type: "number", note: "0..1 share of COD orders" },
  { field: "rto_count", type: "number" },
  { field: "rto_risk_score", type: "number", note: "0..1" },
  { field: "churn_score", type: "number", note: "0..1" },
  { field: "preferred_payment", type: '"COD" | "prepaid"' },
  { field: "favorite_category", type: "string" },
  {
    field: "sentiment",
    type: '"very_positive" | "positive" | "neutral" | "anxious" | "negative"',
  },
  { field: "days_since_last_order", type: "number" },
  { field: "is_first_order", type: "boolean" },
  { field: "refund_status", type: '"requested"|"approved"|"processing"|"completed"|undefined', note: 'open return; use op "exists" or =="processing"' },
  { field: "cart", type: "object | undefined", note: 'use op "exists"' },
  {
    field: "order.status",
    type: '"delivered"|"returned"|"in_transit"|"pending_dispatch"',
    note: "matches if ANY order has this status",
  },
];

export function fieldsForPrompt(): string {
  return TRAIT_FIELDS.map(
    (f) => `- ${f.field}: ${f.type}${f.note ? ` (${f.note})` : ""}`
  ).join("\n");
}
