// Small presentation helpers shared across UI panels.

const FIELD_LABELS: Record<string, string> = {
  order_count: "Orders",
  aov: "Avg order value",
  ltv: "Lifetime value",
  cod_prepaid_ratio: "COD share",
  rto_count: "Returns (RTO)",
  rto_risk_score: "RTO risk",
  churn_score: "Churn risk",
  preferred_payment: "Preferred payment",
  favorite_category: "Favorite category",
  sentiment: "Sentiment",
  segment: "Segment",
  days_since_last_order: "Days since last order",
  is_first_order: "First order",
  cross_brand_return_signal: "Cross-brand returns",
  anxiety_signals: "Anxiety signals",
  past_nudge_response: "Past nudge response",
  complementary_products: "Complementary products",
  orders: "Order history",
  cart: "Live cart",
  messages: "Chat messages",
  rfm: "RFM",
};

export function fieldLabel(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

export function rupees(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

// Compact, human-readable rendering of any trait/field value.
export function formatValue(field: string, value: unknown): string {
  if (value === undefined || value === null) return "—";

  switch (field) {
    case "aov":
    case "ltv":
      return rupees(Number(value));
    case "cod_prepaid_ratio":
      return Math.round(Number(value) * 100) + "% COD";
    case "rto_risk_score":
    case "churn_score":
      return Number(value).toFixed(2);
    case "is_first_order":
      return value ? "yes" : "no";
    case "days_since_last_order":
      return Number(value) === 0 ? "today" : `${value} days`;
  }

  if (Array.isArray(value)) {
    if (field === "orders") return `${value.length} orders`;
    if (field === "messages") return `${value.length} messages`;
    return value.join(", ");
  }

  if (typeof value === "object") {
    if (field === "cross_brand_return_signal") {
      const v = value as { brands: string[]; returns: number; total: number };
      return `${v.returns}/${v.total} returned across ${v.brands.join(", ")}`;
    }
    if (field === "cart") {
      const v = value as { items: string[]; value: number; abandoned_at: string };
      return `${v.items.join(", ")} · ${rupees(v.value)}`;
    }
    return JSON.stringify(value);
  }

  return String(value);
}

// Color hint for risk-like scores (higher = hotter).
export function riskTone(field: string, value: unknown): string {
  if (field !== "rto_risk_score" && field !== "churn_score") return "";
  const n = Number(value);
  if (n >= 0.7) return "text-red-600";
  if (n >= 0.4) return "text-amber-600";
  return "text-emerald-600";
}
