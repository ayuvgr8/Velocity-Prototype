import type {
  Customer,
  Order,
  IdentityFragment,
  ChatMessage,
  CartEvent,
  Traits,
  Resolution,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Generated wider customer pool — several customers per persona so the rail
// scrolls and segments return multiple matches. DETERMINISTIC (seeded PRNG) so
// the server and client render the exact same data (no hydration mismatch) and
// the demo is stable across reloads. No Math.random / Date at runtime.
// ─────────────────────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(0x5eed1234);
const f = (lo: number, hi: number) => lo + (hi - lo) * rand();
const ri = (lo: number, hi: number) => Math.floor(f(lo, hi + 1));
const pick = <T>(arr: readonly T[]): T => arr[ri(0, arr.length - 1)];
const pickN = <T>(arr: readonly T[], n: number): T[] => {
  const c = [...arr];
  const out: T[] = [];
  for (let k = 0; k < n && c.length; k++) out.push(c.splice(ri(0, c.length - 1), 1)[0]);
  return out;
};

const FIRST = [
  "Aarav", "Diya", "Kabir", "Ananya", "Rohan", "Isha", "Aditya", "Tara",
  "Karan", "Nisha", "Vivek", "Pooja", "Dev", "Riya", "Manav", "Kavya",
  "Yash", "Neha", "Aman", "Divya", "Siddharth", "Ritika", "Nikhil", "Sana",
];
const LAST = [
  "Kapoor", "Nair", "Menon", "Joshi", "Patel", "Rao", "Gupta", "Bose",
  "Shah", "Verma", "Pillai", "Desai", "Khanna", "Bhat", "Sengupta", "Chopra",
];
const usedNames = new Set<string>();
function nextName(): string {
  for (let attempt = 0; attempt < 64; attempt++) {
    const n = `${pick(FIRST)} ${pick(LAST)}`;
    if (!usedNames.has(n)) {
      usedNames.add(n);
      return n;
    }
  }
  return `${pick(FIRST)} ${pick(LAST)} ${usedNames.size}`;
}
function phone(): string {
  return `+91 9${ri(1000, 9999)} ${ri(10000, 99999)}`;
}
const BRANDS = ["Aurelia", "Kettle", "Voxa", "Nori", "Maison", "Bloom"];

function rupeesAround(base: number): number {
  return Math.round((base + f(-300, 400)) / 10) * 10;
}

function basicFragments(name: string, ph: string, cat: string): IdentityFragment[] {
  const first = name.split(" ")[0];
  const email = `${first.toLowerCase()}.${ri(10, 99)}@gmail.com`;
  return [
    { id: `O-${ri(4000, 5999)}`, source: "storefront", signals: { name, phone: ph, email }, note: cat },
    { id: `WA-${ri(7000, 9999)}`, source: "whatsapp", signals: { phone: ph, name: first }, note: "chat thread" },
  ];
}
function detResolution(ph: string): Resolution {
  return { anchor: `phone ${ph}`, method: ["deterministic: phone", "deterministic: email"], confidence: "high" };
}

function orders(opts: {
  n: number;
  payment: "COD" | "prepaid";
  cat: string;
  item: () => string;
  aov: number;
  returned?: number;
  pending?: boolean;
  transit?: boolean;
  deliveredToday?: boolean;
}): Order[] {
  const out: Order[] = [];
  const n = Math.min(opts.n, 3);
  for (let k = 0; k < n; k++) {
    out.push({
      id: `O-${ri(4000, 5999)}`,
      date: `${ri(8, 120)}d ago`,
      value: rupeesAround(opts.aov),
      payment: opts.payment,
      status: "delivered",
      category: opts.cat,
      items: [opts.item()],
    });
  }
  for (let k = 0; k < (opts.returned ?? 0) && k < out.length; k++) out[k].status = "returned";
  if (opts.transit) out[0] = { ...out[0], date: "1d ago", status: "in_transit" };
  if (opts.deliveredToday) out[0] = { ...out[0], date: "today", status: "delivered" };
  if (opts.pending)
    out.unshift({
      id: `O-${ri(4000, 5999)}`,
      date: "today",
      value: rupeesAround(opts.aov),
      payment: opts.payment,
      status: "pending_dispatch",
      category: opts.cat,
      items: [opts.item()],
    });
  return out;
}

// catalogue helpers per category
const ITEMS: Record<string, string[]> = {
  Footwear: ["Running shoes", "Loafers", "Sandals", "Sneakers", "Boots"],
  Apparel: ["Linen co-ord set", "Kurta set", "Anarkali dress", "Palazzo set", "Saree"],
  Audio: ["Wireless earbuds", "Bluetooth speaker", "Headphones", "Neckband", "Soundbar"],
  Beauty: ["Skincare set", "Lip kit", "Serum", "Fragrance", "Face mask set"],
  Home: ["Cookware set", "Bedsheet set", "Table lamp", "Storage rack", "Dinner set"],
  Electronics: ["Smartwatch", "Power bank", "Trimmer", "Charger kit", "Earphones"],
};
const item = (cat: string) => () => pick(ITEMS[cat] ?? ITEMS.Apparel);
const COMPLEMENTS: Record<string, string> = {
  Audio: "carry case", Footwear: "shoe-care kit", Apparel: "matching stole",
  Beauty: "travel pouch", Home: "coaster set", Electronics: "screen guard",
};

let idc = 0;
const nid = () => `cust_g${String(++idc).padStart(2, "0")}`;

function make(base: {
  agent: string;
  cat: string;
  fragments: IdentityFragment[];
  resolution: Resolution;
  orders: Order[];
  messages?: ChatMessage[];
  cart?: CartEvent;
  traits: Traits;
  scenario: string;
  mock: string;
}, name: string): Customer {
  return {
    customer_id: nid(),
    display_name: name,
    scenario_tag: base.scenario,
    expected_agent: base.agent,
    fragments: base.fragments,
    resolution: base.resolution,
    orders: base.orders,
    cart: base.cart,
    messages: base.messages ?? [],
    traits: base.traits,
    mock_action: base.mock,
  };
}

// ── archetype builders ───────────────────────────────────────────────────────

function genCod(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Footwear", "Apparel", "Home"]);
  const oc = ri(4, 9), aov = ri(1800, 3200), cod = +f(0.6, 0.9).toFixed(2);
  return make({
    agent: "cod_prepaid", cat, scenario: "Loyal COD · convertible",
    fragments: basicFragments(name, ph, cat), resolution: detResolution(ph),
    orders: orders({ n: oc, payment: "COD", cat, item: item(cat), aov, returned: ri(0, 1) }),
    traits: traitsOf({ order_count: oc, aov, days: ri(5, 25), cod_prepaid_ratio: cod,
      rto_count: ri(0, 1), rto_risk_score: +f(0.2, 0.5).toFixed(2), churn_score: +f(0.12, 0.3).toFixed(2),
      preferred_payment: "COD", sentiment: "positive", segment: "Loyal COD", cat }),
    mock: `Hi ${first}! Prepay your next ${cat.toLowerCase()} order and get ₹150 off + priority dispatch. Switch to UPI/card: [link] 🙌`,
  }, name);
}

function genWinback(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Audio", "Electronics", "Apparel"]);
  const oc = ri(5, 10), aov = ri(1700, 2600), ltv = aov * oc;
  return make({
    agent: "winback", cat, scenario: "Lapsing high-value · gone quiet",
    fragments: [...basicFragments(name, ph, cat),
      { id: `MKT-${first.toLowerCase()}`, source: "marketing", signals: { email: `${first.toLowerCase()}@outlook.com` }, note: "opened last 2 campaigns, no conversion" }],
    resolution: detResolution(ph),
    orders: orders({ n: oc, payment: "prepaid", cat, item: item(cat), aov }),
    traits: traitsOf({ order_count: oc, aov, ltv, days: ri(70, 160), cod_prepaid_ratio: +f(0.05, 0.2).toFixed(2),
      rto_count: 0, rto_risk_score: +f(0.05, 0.15).toFixed(2), churn_score: +f(0.62, 0.85).toFixed(2),
      preferred_payment: "prepaid", sentiment: "neutral", segment: "Lapsing high-value", cat,
      extra: { past_nudge_response: "opened, did not convert" } }),
    mock: `Hey ${first}, it's been a while! Fresh ${cat} drops just landed. Here's ₹300 off to pick up where you left off: [link]. Valid 72h.`,
  }, name);
}

function genCart(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Apparel", "Beauty"]);
  const it = pick(ITEMS[cat]), val = ri(1800, 3600), views = ri(3, 6), oc = ri(2, 5);
  return make({
    agent: "cart_recovery", cat, scenario: `Hot cart · viewed ${views}×`,
    fragments: basicFragments(name, ph, cat), resolution: detResolution(ph),
    orders: orders({ n: oc, payment: "prepaid", cat, item: item(cat), aov: ri(2400, 3200) }),
    cart: { items: [`${it} ₹${val}`], value: val, abandoned_at: `${ri(1, 4)}h ago`, view_count: views },
    traits: traitsOf({ order_count: oc, aov: ri(2400, 3200), days: ri(12, 30), cod_prepaid_ratio: 0,
      rto_count: 0, rto_risk_score: +f(0.08, 0.2).toFixed(2), churn_score: +f(0.2, 0.4).toFixed(2),
      preferred_payment: "prepaid", sentiment: "positive", segment: "Engaged prepaid", cat }),
    mock: `Hi ${first}! The ${it} is still in your bag — only a few left in your size. Complete now and it ships today: [link] 💛`,
  }, name);
}

function genMoat(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Apparel", "Home", "Electronics"]);
  const brands = pickN(BRANDS, 3), returns = ri(3, 4), total = returns + 1, aov = ri(3200, 4800);
  const frags: IdentityFragment[] = brands.map((b, idx) => ({
    id: `${b.slice(0, 2).toUpperCase()}-${ri(100, 499)}`, source: "brand_order", brand: b,
    signals: { phone: ph }, note: idx < returns ? "COD · returned" : "COD · delivered (kept)",
  }));
  frags.push({ id: `${brands[0].slice(0, 2).toUpperCase()}-${ri(500, 899)}`, source: "brand_order", brand: brands[0],
    signals: { phone: ph }, note: `COD ₹${aov} · pending_dispatch (current)` });
  return make({
    agent: "rto_shield", cat, scenario: "Network RTO risk — flag ⭐",
    fragments: frags,
    resolution: { anchor: `phone across ${brands.length} brands`, method: ["deterministic: phone", "cross-brand graph join"], confidence: "high" },
    orders: orders({ n: total, payment: "COD", cat, item: item(cat), aov, returned: returns, pending: true }),
    traits: traitsOf({ order_count: total, aov, ltv: aov, days: ri(3, 12), cod_prepaid_ratio: 1.0,
      rto_count: returns, rto_risk_score: +f(0.78, 0.94).toFixed(2), churn_score: +f(0.45, 0.6).toFixed(2),
      preferred_payment: "COD", sentiment: "neutral", segment: "Network RTO risk — flag", cat,
      extra: { cross_brand_return_signal: { brands, returns, total } } }),
    mock: `Hi ${first}, to confirm this order we've enabled secure prepay for it. Pay via UPI/card to lock your delivery slot: [link]. (COD is paused for this one.)`,
  }, name);
}

function genWimo(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Beauty", "Apparel", "Electronics"]);
  const firstOrder = rand() < 0.6;
  const aov = ri(900, 2000);
  return make({
    agent: "wimo", cat, scenario: firstOrder ? "New, anxious · in transit" : "Anxious · in transit",
    fragments: basicFragments(name, ph, cat), resolution: detResolution(ph),
    orders: orders({ n: firstOrder ? 1 : ri(2, 4), payment: "prepaid", cat, item: item(cat), aov, transit: true }),
    messages: [
      { ts: "2025-06-25 10:14", from: "customer", text: "where is my order?" },
      { ts: "2025-06-25 18:40", from: "customer", text: "any update?" },
    ],
    traits: traitsOf({ order_count: firstOrder ? 1 : ri(2, 4), aov, days: ri(1, 4), cod_prepaid_ratio: 0,
      rto_count: 0, rto_risk_score: +f(0.1, 0.2).toFixed(2), churn_score: +f(0.35, 0.5).toFixed(2),
      preferred_payment: "prepaid", sentiment: "anxious", segment: firstOrder ? "New, anxious" : "Anxious in transit", cat,
      isFirst: firstOrder, extra: { anxiety_signals: ["2× WIMO in 24h"] } }),
    mock: `Hi ${first}! Good news — your order is out for delivery and arrives tomorrow by 7 PM. Courier: BlueDart, track live: [link]. We'll ping you when it's nearby 📦`,
  }, name);
}

function genUpsell(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Audio", "Electronics", "Home"]);
  const oc = ri(4, 9), aov = ri(2200, 3200), it = pick(ITEMS[cat]), comp = COMPLEMENTS[cat];
  return make({
    agent: "upsell_review", cat, scenario: "Happy repeat · delivered today",
    fragments: basicFragments(name, ph, cat), resolution: detResolution(ph),
    orders: orders({ n: oc, payment: "prepaid", cat, item: item(cat), aov, deliveredToday: true }),
    messages: [{ ts: "2025-06-26 14:30", from: "customer", text: "received, loving it 🔥" }],
    traits: traitsOf({ order_count: oc, aov, ltv: aov * oc, days: 0, cod_prepaid_ratio: 0,
      rto_count: 0, rto_risk_score: +f(0.05, 0.12).toFixed(2), churn_score: +f(0.1, 0.2).toFixed(2),
      preferred_payment: "prepaid", sentiment: "very_positive", segment: "Happy repeat", cat,
      extra: { complementary_products: [comp, "gift card"] } }),
    mock: `So glad you're loving the ${it.toLowerCase()}, ${first}! 🎧 Mind leaving a quick ⭐ review? [link] — and the matching ${comp} is 20% off today: [link]`,
  }, name);
}

function genReturns(): Customer {
  const name = nextName(), first = name.split(" ")[0], ph = phone();
  const cat = pick(["Apparel", "Footwear", "Electronics"]);
  const oc = ri(4, 10), aov = ri(2200, 3400), val = rupeesAround(aov);
  const reason = pick(["size issue", "damaged in transit", "wrong item shipped", "changed mind", "quality not as expected"]);
  const status = pick(["requested", "processing", "approved"] as const);
  const ord = orders({ n: oc, payment: "prepaid", cat, item: item(cat), aov, returned: 1 });
  ord[0] = { ...ord[0], date: `${ri(2, 8)}d ago`, value: val, status: "returned" };
  return make({
    agent: "returns_refunds", cat, scenario: `Open return · refund ${status}`,
    fragments: [...basicFragments(name, ph, cat),
      { id: `WA-${ri(5000, 6999)}`, source: "whatsapp", signals: { phone: ph }, note: "'I want to return this' · 'where's my refund?'" }],
    resolution: detResolution(ph),
    orders: ord,
    messages: [
      { ts: "2025-06-24 09:12", from: "customer", text: `I want to return this — ${reason}` },
      { ts: "2025-06-25 19:30", from: "customer", text: "how long does the refund take?" },
    ],
    traits: traitsOf({ order_count: oc, aov, ltv: aov * oc, days: ri(2, 8), cod_prepaid_ratio: +f(0, 0.3).toFixed(2),
      rto_count: ri(1, 2), rto_risk_score: +f(0.2, 0.4).toFixed(2), churn_score: +f(0.4, 0.6).toFixed(2),
      preferred_payment: "prepaid", sentiment: pick(["negative", "anxious"] as const), segment: "Open return", cat,
      extra: { return_reason: reason, refund_status: status } }),
    mock: `Hi ${first}, sorry about that! Your refund of ₹${val} is ${status} and lands in 3–4 working days. Prefer a free exchange instead? Just reply SWAP 💛`,
  }, name);
}

// Trait assembler — fills required fields, merges optional `extra`.
function traitsOf(o: {
  order_count: number; aov: number; ltv?: number; days: number;
  cod_prepaid_ratio: number; rto_count: number; rto_risk_score: number; churn_score: number;
  preferred_payment: "COD" | "prepaid"; sentiment: Traits["sentiment"]; segment: string; cat: string;
  isFirst?: boolean; extra?: Partial<Traits>;
}): Traits {
  const ltv = o.ltv ?? o.aov * o.order_count;
  return {
    order_count: o.order_count, aov: o.aov, ltv,
    rfm: { recency_days: o.days, frequency: o.order_count, monetary: ltv },
    cod_prepaid_ratio: o.cod_prepaid_ratio, rto_count: o.rto_count, rto_risk_score: o.rto_risk_score,
    churn_score: o.churn_score, preferred_payment: o.preferred_payment, favorite_category: o.cat,
    sentiment: o.sentiment, segment: o.segment, days_since_last_order: o.days,
    is_first_order: o.isFirst ?? false, ...o.extra,
  };
}

// ── assemble the pool (fixed order → deterministic) ──────────────────────────
const PLAN: [() => Customer, number][] = [
  [genCod, 4],
  [genWinback, 3],
  [genCart, 3],
  [genMoat, 4],
  [genWimo, 3],
  [genUpsell, 3],
  [genReturns, 3],
];

export const EXTRA_CUSTOMERS: Customer[] = PLAN.flatMap(([fn, n]) =>
  Array.from({ length: n }, () => fn())
);
