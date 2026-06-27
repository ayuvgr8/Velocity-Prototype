// ─────────────────────────────────────────────────────────────────────────────
// Velocity Customer Context Layer — core types (PRD §6)
// Everything is static sample data. No DB, no live models in the prototype.
// ─────────────────────────────────────────────────────────────────────────────

export type IdentityFragment = {
  id: string; // "O-4521", "sess_ax8f", "AU-301"...
  source: "storefront" | "whatsapp" | "web_session" | "marketing" | "brand_order";
  brand?: string; // for cross-brand cases
  signals: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    device_id?: string;
    geo?: string;
  };
  note?: string;
};

export type Order = {
  id: string;
  brand?: string;
  date: string;
  value: number; // INR
  payment: "COD" | "prepaid";
  status: "delivered" | "returned" | "in_transit" | "pending_dispatch";
  category: string;
  items: string[];
};

export type ChatMessage = { ts: string; from: "customer" | "agent"; text: string };

export type CartEvent = {
  items: string[];
  value: number;
  abandoned_at: string;
  view_count: number;
};

// AI-derived traits — PRE-COMPUTED in sample data (no live model in the prototype)
export type Traits = {
  order_count: number;
  aov: number;
  ltv: number;
  rfm: { recency_days: number; frequency: number; monetary: number };
  cod_prepaid_ratio: number; // 0..1 share of COD
  rto_count: number;
  rto_risk_score: number; // 0..1
  churn_score: number; // 0..1
  preferred_payment: "COD" | "prepaid";
  favorite_category: string;
  sentiment: "very_positive" | "positive" | "neutral" | "anxious" | "negative";
  segment: string;
  days_since_last_order: number;
  is_first_order: boolean;
  cross_brand_return_signal?: { brands: string[]; returns: number; total: number };
  anxiety_signals?: string[];
  past_nudge_response?: string;
  complementary_products?: string[];
  // Returns & Refunds agent
  return_reason?: string;
  refund_status?: "requested" | "approved" | "processing" | "completed";
};

export type Resolution = {
  anchor: string;
  method: string[];
  confidence: "high" | "medium" | "low";
};

export type Customer = {
  customer_id: string;
  display_name: string;
  fragments: IdentityFragment[];
  resolution: Resolution;
  orders: Order[];
  cart?: CartEvent;
  messages: ChatMessage[];
  traits: Traits;
  scenario_tag: string;
  expected_agent: string; // agent id
  mock_action: string;
};

// ── NL segmentation (PRD §6 / §9) ────────────────────────────────────────────
export type SegmentOp = ">=" | "<=" | "==" | ">" | "<" | "exists";

export type SegmentCondition = {
  field: string; // a Traits field path (supports dotted paths + order/cart paths)
  op: SegmentOp;
  value?: number | string | boolean;
};

export type SegmentFilter = {
  conditions: SegmentCondition[]; // AND-combined
  human_readable: string;
};

// ── Agents & Context Contracts (PRD §8) ──────────────────────────────────────
export type AgentTask = {
  id: string;
  name: string;
  role: string; // for the generation system prompt
  trigger: string;
  contract: string[]; // field paths the agent declares it needs
  decision_logic: string;
  action_label: string;
  instruction: string; // what the message should accomplish
  persona_id: string; // the recommended/expected customer
  badge?: string; // optional UI badge, e.g. Vikram's cross-brand note
};

// ── Engine output (PRD §10) ──────────────────────────────────────────────────
export type IncludedField = {
  field: string;
  value: unknown;
  freshness?: string;
};

export type ContextBundle = {
  customer_id: string;
  task: string;
  included: IncludedField[];
  excluded: string[];
  rationale: string;
};
