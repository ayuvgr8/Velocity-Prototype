import type { AgentTask } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// 6 agents, each with a Context Contract (PRD §8).
// The contract is the small, explicit list of fields the agent declares it needs.
// New agent = new contract over existing traits → no re-architecture.
// ─────────────────────────────────────────────────────────────────────────────

export const AGENTS: AgentTask[] = [
  {
    id: "cod_prepaid",
    name: "COD → Prepaid",
    role: "COD-to-prepaid conversion agent",
    trigger: "New COD order, convertible customer",
    contract: [
      "cod_prepaid_ratio",
      "rto_risk_score",
      "aov",
      "ltv",
      "preferred_payment",
      "orders",
    ],
    decision_logic: "COD + (high value OR moderate RTO risk) → incentive to prepay",
    action_label: "Prepay nudge",
    instruction:
      "Persuade a loyal COD customer to prepay their pending order with a small incentive (discount + priority dispatch).",
    persona_id: "cust_001",
  },
  {
    id: "winback",
    name: "Winback",
    role: "winback agent",
    trigger: "Dormant > 60 days",
    contract: [
      "days_since_last_order",
      "churn_score",
      "favorite_category",
      "ltv",
      "past_nudge_response",
      "orders",
    ],
    decision_logic: "High churn + high LTV → category-relevant offer sized to LTV",
    action_label: "Winback offer",
    instruction:
      "Re-engage a lapsed high-value customer with a category-relevant offer sized to their lifetime value and a sense of urgency.",
    persona_id: "cust_002",
  },
  {
    id: "cart_recovery",
    name: "Cart Recovery",
    role: "cart recovery agent",
    trigger: "Cart abandoned, high intent",
    contract: ["cart", "sentiment", "preferred_payment", "favorite_category"],
    decision_logic: "High views + good sentiment → nudge the exact item; scarcity if apt",
    action_label: "Cart nudge",
    instruction:
      "Recover an abandoned cart by nudging the exact item left behind, with gentle scarcity and a one-tap path to checkout.",
    persona_id: "cust_003",
  },
  {
    id: "rto_shield",
    name: "RTO Shield",
    role: "RTO (return-to-origin) risk shield agent",
    trigger: "New COD order, pre-dispatch",
    contract: [
      "rto_risk_score",
      "rto_count",
      "cross_brand_return_signal",
      "cod_prepaid_ratio",
      "orders",
    ],
    decision_logic: "Network RTO risk high → pause COD, require prepay",
    action_label: "Convert to prepay + msg",
    instruction:
      "A high network-RTO-risk COD order is about to ship. Pause COD for this order and require secure prepayment, framed positively (lock the delivery slot).",
    persona_id: "cust_004",
    badge: "COD paused — network signal from 3 brands",
  },
  {
    id: "wimo",
    name: "Proactive WIMO",
    role: "proactive 'where is my order' agent",
    trigger: "In transit + anxiety / pre-delivery",
    contract: [
      "orders",
      "anxiety_signals",
      "is_first_order",
      "messages",
    ],
    decision_logic: "Anxiety or first order → reassure proactively with live status",
    action_label: "Proactive status",
    instruction:
      "Proactively reassure an anxious first-time buyer whose order is in transit, with a clear live status and expected delivery window.",
    persona_id: "cust_005",
  },
  {
    id: "upsell_review",
    name: "Upsell + Review",
    role: "post-delivery upsell and review agent",
    trigger: "Delivered + positive sentiment",
    contract: [
      "orders",
      "sentiment",
      "complementary_products",
      "ltv",
      "order_count",
    ],
    decision_logic: "Positive + repeat → review request + complementary product",
    action_label: "Review + cross-sell",
    instruction:
      "Thank a happy repeat customer who just received their order, ask for a quick review, and offer a complementary product.",
    persona_id: "cust_006",
  },
  {
    id: "returns_refunds",
    name: "Returns & Refunds",
    role: "returns, refunds and complaints agent",
    trigger: "Return raised / refund pending / complaint",
    contract: [
      "orders",
      "return_reason",
      "refund_status",
      "sentiment",
      "rto_count",
      "ltv",
      "messages",
    ],
    decision_logic:
      "Open return + negative sentiment + good LTV → de-escalate, give a clear refund ETA, offer a save",
    action_label: "Resolve return",
    instruction:
      "Reassure a customer with an open return or pending refund. Acknowledge the issue, give a clear refund status/ETA, and—if their value warrants it—offer a goodwill gesture or easy exchange to retain them.",
    persona_id: "cust_007",
  },
];

export function getAgent(id: string): AgentTask | undefined {
  return AGENTS.find((a) => a.id === id);
}
