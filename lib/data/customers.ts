import type { Customer } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// The six personas (PRD §7) — values encoded verbatim.
// Each persona triggers exactly one agent (`expected_agent`).
// ─────────────────────────────────────────────────────────────────────────────

export const CUSTOMERS: Customer[] = [
  // ── cust_001 — Priya Sharma → COD→Prepaid Conversion ──────────────────────
  {
    customer_id: "cust_001",
    display_name: "Priya Sharma",
    scenario_tag: "Loyal COD · worth converting to prepaid",
    expected_agent: "cod_prepaid",
    fragments: [
      {
        id: "O-4521",
        source: "storefront",
        signals: {
          name: "Priya Sharma",
          phone: "+91 98450 12345",
          address: "12 4th Cross, Indiranagar, Bengaluru 560038",
        },
        note: "COD",
      },
      {
        id: "O-4892",
        source: "storefront",
        signals: {
          name: "P. Sharma",
          email: "priya.sharma91@gmail.com",
          address: "12 4th Cross, Indiranagar, Bengaluru 560038",
        },
        note: "the one prepaid order",
      },
      {
        id: "WA-9845",
        source: "whatsapp",
        signals: { name: "Priya", phone: "+91 98450 12345" },
      },
      {
        id: "sess_ax8f",
        source: "web_session",
        signals: { device_id: "dx-771", geo: "Bengaluru" },
        note: "anonymous → links via device+geo+behavior (browsed Footwear)",
      },
    ],
    resolution: {
      anchor: "phone +91 98450 12345",
      method: [
        "deterministic: phone (O-4521 = WA)",
        "fuzzy: name+address (O-4521 ≈ O-4892)",
        "behavioral: session → known buyer",
      ],
      confidence: "high",
    },
    orders: [
      { id: "O-4101", date: "2025-01-18", value: 2300, payment: "COD", status: "delivered", category: "Footwear", items: ["Running shoes"] },
      { id: "O-4301", date: "2025-02-22", value: 2600, payment: "COD", status: "delivered", category: "Footwear", items: ["Loafers"] },
      { id: "O-4521", date: "2025-03-30", value: 2400, payment: "COD", status: "delivered", category: "Footwear", items: ["Sandals"] },
      { id: "O-4699", date: "2025-04-21", value: 1900, payment: "COD", status: "returned", category: "Footwear", items: ["Heels"] },
      { id: "O-4892", date: "2025-05-19", value: 3100, payment: "prepaid", status: "delivered", category: "Footwear", items: ["Boots"] },
      { id: "O-4955", date: "2025-06-14", value: 2100, payment: "COD", status: "pending_dispatch", category: "Footwear", items: ["Sneakers"] },
    ],
    messages: [
      { ts: "2025-06-14 11:02", from: "customer", text: "Just ordered the sneakers!" },
      { ts: "2025-06-14 11:03", from: "agent", text: "Yay! Order #4955 confirmed 🙌" },
    ],
    traits: {
      order_count: 6,
      aov: 2400,
      ltv: 14400,
      rfm: { recency_days: 12, frequency: 6, monetary: 14400 },
      cod_prepaid_ratio: 0.83,
      rto_count: 1,
      rto_risk_score: 0.34,
      churn_score: 0.18,
      preferred_payment: "COD",
      favorite_category: "Footwear",
      sentiment: "positive",
      segment: "Loyal COD",
      days_since_last_order: 12,
      is_first_order: false,
    },
    mock_action:
      "Hi Priya! Your next pair ships faster when you prepay 🙌 Pay online for order #4955 and get ₹150 off + priority dispatch. Switch to UPI/card: [link]",
  },

  // ── cust_002 — Rahul Mehta → Winback ──────────────────────────────────────
  {
    customer_id: "cust_002",
    display_name: "Rahul Mehta",
    scenario_tag: "Lapsing high-value · silent 95 days",
    expected_agent: "winback",
    fragments: [
      {
        id: "O-3301",
        source: "storefront",
        signals: { name: "Rahul Mehta", phone: "+91 99001 22334", email: "rahul.m@outlook.com" },
        note: "prepaid",
      },
      {
        id: "WA-9900",
        source: "whatsapp",
        signals: { name: "Rahul", phone: "+91 99001 22334" },
      },
      {
        id: "MKT-rahul",
        source: "marketing",
        signals: { email: "rahul.m@outlook.com" },
        note: "opened last 2 campaigns, no conversion",
      },
    ],
    resolution: {
      anchor: "phone + email (exact across sources)",
      method: ["deterministic: phone", "deterministic: email"],
      confidence: "high",
    },
    orders: [
      { id: "O-2100", date: "2024-04-12", value: 1700, payment: "prepaid", status: "delivered", category: "Audio", items: ["Wired earphones"] },
      { id: "O-2350", date: "2024-06-02", value: 1900, payment: "prepaid", status: "delivered", category: "Audio", items: ["Bluetooth speaker"] },
      { id: "O-2588", date: "2024-08-19", value: 2100, payment: "prepaid", status: "delivered", category: "Audio", items: ["Wireless earbuds"] },
      { id: "O-2790", date: "2024-10-07", value: 1600, payment: "COD", status: "delivered", category: "Audio", items: ["Earphone case"] },
      { id: "O-2980", date: "2024-11-21", value: 1850, payment: "prepaid", status: "delivered", category: "Audio", items: ["Neckband"] },
      { id: "O-3120", date: "2025-01-09", value: 1800, payment: "prepaid", status: "delivered", category: "Audio", items: ["Soundbar (mini)"] },
      { id: "O-3220", date: "2025-02-18", value: 2000, payment: "prepaid", status: "delivered", category: "Audio", items: ["Headphones"] },
      { id: "O-3301", date: "2025-03-23", value: 1850, payment: "prepaid", status: "delivered", category: "Audio", items: ["Wireless earbuds (v2)"] },
    ],
    messages: [
      { ts: "2025-03-23 09:40", from: "customer", text: "Got the earbuds, thanks." },
      { ts: "2025-05-30 12:00", from: "agent", text: "We miss you Rahul — new Audio drops are here." },
    ],
    traits: {
      order_count: 8,
      aov: 1850,
      ltv: 14800,
      rfm: { recency_days: 95, frequency: 8, monetary: 14800 },
      cod_prepaid_ratio: 0.12,
      rto_count: 0,
      rto_risk_score: 0.08,
      churn_score: 0.76,
      preferred_payment: "prepaid",
      favorite_category: "Audio",
      sentiment: "neutral",
      segment: "Lapsing high-value",
      days_since_last_order: 95,
      is_first_order: false,
      past_nudge_response: "opened, did not convert",
    },
    mock_action:
      "Hey Rahul, it's been a while! New drops in Audio just landed — including the wireless line you love. ₹300 off to pick up where you left off: [link]. Valid 72h.",
  },

  // ── cust_003 — Anjali Reddy → Cart Recovery ───────────────────────────────
  {
    customer_id: "cust_003",
    display_name: "Anjali Reddy",
    scenario_tag: "Hot cart abandoned 2h ago · viewed 4×",
    expected_agent: "cart_recovery",
    fragments: [
      {
        id: "O-4710",
        source: "storefront",
        signals: { name: "Anjali Reddy", phone: "+91 98860 55667" },
        note: "UPI prepaid",
      },
      {
        id: "sess_kp22",
        source: "web_session",
        signals: {},
        note: "logged-in cart: 'Linen co-ord set (M) ₹3,200', abandoned 2h ago, viewed 4× — the live signal",
      },
      {
        id: "WA-9886",
        source: "whatsapp",
        signals: { phone: "+91 98860 55667" },
      },
    ],
    resolution: {
      anchor: "phone; logged-in session ties to account",
      method: ["deterministic: phone", "deterministic: account session"],
      confidence: "high",
    },
    orders: [
      { id: "O-4410", date: "2025-04-05", value: 2900, payment: "prepaid", status: "delivered", category: "Apparel", items: ["Cotton kurta set"] },
      { id: "O-4560", date: "2025-05-12", value: 2700, payment: "prepaid", status: "delivered", category: "Apparel", items: ["Palazzo set"] },
      { id: "O-4710", date: "2025-06-05", value: 3100, payment: "prepaid", status: "delivered", category: "Apparel", items: ["Anarkali dress"] },
    ],
    cart: {
      items: ["Linen co-ord set (M) ₹3,200"],
      value: 3200,
      abandoned_at: "2h ago",
      view_count: 4,
    },
    messages: [
      { ts: "2025-06-05 16:20", from: "customer", text: "Love the Anarkali, fits perfectly!" },
    ],
    traits: {
      order_count: 3,
      aov: 2900,
      ltv: 8700,
      rfm: { recency_days: 21, frequency: 3, monetary: 8700 },
      cod_prepaid_ratio: 0.0,
      rto_count: 0,
      rto_risk_score: 0.1,
      churn_score: 0.3,
      preferred_payment: "prepaid",
      favorite_category: "Apparel",
      sentiment: "positive",
      segment: "Engaged prepaid",
      days_since_last_order: 21,
      is_first_order: false,
    },
    mock_action:
      "Hi Anjali! The Linen co-ord set (M) is still in your bag — and only a few left in your size. Complete now and it ships today: [link] 💛",
  },

  // ── cust_004 — Vikram Singh → RTO Shield (cross-brand) ⭐ the moat ─────────
  {
    customer_id: "cust_004",
    display_name: "Vikram Singh",
    scenario_tag: "Network RTO risk — visible only across 3 brands ⭐",
    expected_agent: "rto_shield",
    fragments: [
      { id: "AU-301", source: "brand_order", brand: "Aurelia", signals: { phone: "+91 99770 11223" }, note: "COD · returned" },
      { id: "AU-355", source: "brand_order", brand: "Aurelia", signals: { phone: "+91 99770 11223" }, note: "COD · returned" },
      { id: "KT-110", source: "brand_order", brand: "Kettle", signals: { phone: "+91 99770 11223" }, note: "COD · returned" },
      { id: "VX-220", source: "brand_order", brand: "Voxa", signals: { phone: "+91 99770 11223" }, note: "COD · delivered (kept)" },
      { id: "AU-402", source: "brand_order", brand: "Aurelia", signals: { phone: "+91 99770 11223" }, note: "COD ₹4,500 · pending_dispatch (current)" },
    ],
    resolution: {
      anchor: "phone across 3 brands",
      method: ["deterministic: phone", "cross-brand graph join"],
      confidence: "high",
    },
    orders: [
      { id: "AU-301", brand: "Aurelia", date: "2025-02-10", value: 3800, payment: "COD", status: "returned", category: "Apparel", items: ["Jacket"] },
      { id: "AU-355", brand: "Aurelia", date: "2025-03-15", value: 4200, payment: "COD", status: "returned", category: "Apparel", items: ["Coat"] },
      { id: "KT-110", brand: "Kettle", date: "2025-04-02", value: 3500, payment: "COD", status: "returned", category: "Home", items: ["Cookware set"] },
      { id: "VX-220", brand: "Voxa", date: "2025-05-08", value: 4500, payment: "COD", status: "delivered", category: "Apparel", items: ["Sneakers"] },
      { id: "AU-402", brand: "Aurelia", date: "2025-06-20", value: 4500, payment: "COD", status: "pending_dispatch", category: "Apparel", items: ["Blazer"] },
    ],
    messages: [],
    traits: {
      order_count: 5,
      aov: 4100,
      ltv: 4500, // low — mostly returned
      rfm: { recency_days: 6, frequency: 5, monetary: 4500 },
      cod_prepaid_ratio: 1.0,
      rto_count: 4,
      rto_risk_score: 0.91,
      churn_score: 0.5,
      preferred_payment: "COD",
      favorite_category: "Apparel",
      sentiment: "neutral",
      segment: "Network RTO risk — flag",
      days_since_last_order: 6,
      is_first_order: false,
      cross_brand_return_signal: { brands: ["Aurelia", "Kettle", "Voxa"], returns: 4, total: 5 },
    },
    mock_action:
      "Hi Vikram, to confirm order #AU-402 we've enabled secure prepay for this one. Pay via UPI/card to lock your delivery slot: [link]. (COD is paused for this order.)",
  },

  // ── cust_005 — Sneha Iyer → Proactive WIMO ────────────────────────────────
  {
    customer_id: "cust_005",
    display_name: "Sneha Iyer",
    scenario_tag: "New, anxious · 2× WIMO in 24h",
    expected_agent: "wimo",
    fragments: [
      {
        id: "O-4990",
        source: "storefront",
        signals: { name: "Sneha Iyer", phone: "+91 73900 88776" },
        note: "prepaid ₹1,299 · in_transit · first order",
      },
      {
        id: "WA-7390",
        source: "whatsapp",
        signals: { phone: "+91 73900 88776" },
        note: "'where is my order?' (10:14), 'any update?' (18:40) — anxiety signal",
      },
    ],
    resolution: {
      anchor: "phone",
      method: ["deterministic: phone"],
      confidence: "high",
    },
    orders: [
      { id: "O-4990", date: "2025-06-24", value: 1299, payment: "prepaid", status: "in_transit", category: "Beauty", items: ["Skincare set"] },
    ],
    cart: undefined,
    messages: [
      { ts: "2025-06-25 10:14", from: "customer", text: "where is my order?" },
      { ts: "2025-06-25 18:40", from: "customer", text: "any update?" },
    ],
    traits: {
      order_count: 1,
      aov: 1299,
      ltv: 1299,
      rfm: { recency_days: 2, frequency: 1, monetary: 1299 },
      cod_prepaid_ratio: 0.0,
      rto_count: 0,
      rto_risk_score: 0.15,
      churn_score: 0.4,
      preferred_payment: "prepaid",
      favorite_category: "Beauty",
      sentiment: "anxious",
      segment: "New, anxious",
      days_since_last_order: 2,
      is_first_order: true,
      anxiety_signals: ["2× WIMO in 24h"],
    },
    mock_action:
      "Hi Sneha! Good news — order #4990 is out for delivery and arrives tomorrow by 7 PM. Courier: BlueDart, track live: [link]. We'll ping you the moment it's nearby 📦",
  },

  // ── cust_006 — Arjun Nair → Upsell + Review ───────────────────────────────
  {
    customer_id: "cust_006",
    display_name: "Arjun Nair",
    scenario_tag: "Happy repeat · received headphones today",
    expected_agent: "upsell_review",
    fragments: [
      {
        id: "O-4880",
        source: "storefront",
        signals: { name: "Arjun Nair", phone: "+91 90080 33445" },
        note: "prepaid ₹3,499 · delivered today · 'Wireless headphones'",
      },
      {
        id: "WA-9008",
        source: "whatsapp",
        signals: { phone: "+91 90080 33445" },
        note: "'received, loving it 🔥' — post-delivery sentiment",
      },
    ],
    resolution: {
      anchor: "phone",
      method: ["deterministic: phone"],
      confidence: "high",
    },
    orders: [
      { id: "O-4200", date: "2024-11-02", value: 2200, payment: "prepaid", status: "delivered", category: "Audio", items: ["Earbuds"] },
      { id: "O-4350", date: "2024-12-18", value: 2400, payment: "prepaid", status: "delivered", category: "Audio", items: ["Speaker"] },
      { id: "O-4480", date: "2025-01-26", value: 2600, payment: "prepaid", status: "delivered", category: "Audio", items: ["Neckband"] },
      { id: "O-4590", date: "2025-03-08", value: 2300, payment: "prepaid", status: "delivered", category: "Audio", items: ["Soundbar (mini)"] },
      { id: "O-4700", date: "2025-04-19", value: 2700, payment: "prepaid", status: "delivered", category: "Audio", items: ["Earbuds Pro"] },
      { id: "O-4790", date: "2025-05-24", value: 2500, payment: "prepaid", status: "delivered", category: "Audio", items: ["Bluetooth speaker"] },
      { id: "O-4880", date: "2025-06-26", value: 3499, payment: "prepaid", status: "delivered", category: "Audio", items: ["Wireless headphones"] },
    ],
    messages: [
      { ts: "2025-06-26 14:30", from: "customer", text: "received, loving it 🔥" },
    ],
    traits: {
      order_count: 7,
      aov: 2600,
      ltv: 18200,
      rfm: { recency_days: 0, frequency: 7, monetary: 18200 },
      cod_prepaid_ratio: 0.0,
      rto_count: 0,
      rto_risk_score: 0.06,
      churn_score: 0.12,
      preferred_payment: "prepaid",
      favorite_category: "Audio",
      sentiment: "very_positive",
      segment: "Happy repeat",
      days_since_last_order: 0,
      is_first_order: false,
      complementary_products: ["Carry case", "Wireless earbuds"],
    },
    mock_action:
      "So glad you're loving the headphones, Arjun! 🎧 Mind leaving a quick ⭐ review? [link] — and since you're set, the matching carry case is 20% off today: [link]",
  },
];

export function getCustomer(id: string): Customer | undefined {
  return CUSTOMERS.find((c) => c.customer_id === id);
}
