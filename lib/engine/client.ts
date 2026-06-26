import type { AgentTask, ContextBundle, SegmentFilter } from "../types";
import { scopedPayload, dumpPayload } from "./getContext";
import { parseSegmentMock } from "./segment";
import { getCustomer } from "../data/customers";

// ─────────────────────────────────────────────────────────────────────────────
// Client-side calls into the two API routes, each with a mock fallback.
// Default to MOCK for a deterministic demo; "live" proves it's real (PRD §11).
// ─────────────────────────────────────────────────────────────────────────────

export type Mode = "mock" | "live";

// generateAction (PRD §10/§11) — drafts the WhatsApp message.
export async function generateAction(
  bundle: ContextBundle,
  task: AgentTask,
  mode: Mode,
  scope: "scoped" | "dump"
): Promise<{ message: string; source: Mode }> {
  const customer = getCustomer(bundle.customer_id)!;

  if (mode === "mock") {
    return { message: customer.mock_action, source: "mock" };
  }

  const payload =
    scope === "dump" ? dumpPayload(customer) : scopedPayload(bundle);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        role: task.role,
        instruction: task.instruction,
        context: payload,
        freshness: bundle.included.map((f) => ({
          field: f.field,
          freshness: f.freshness,
        })),
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.message) {
      return { message: customer.mock_action, source: "mock" };
    }
    return { message: data.message, source: "live" };
  } catch {
    return { message: customer.mock_action, source: "mock" };
  }
}

// parseSegment (PRD §9/§11) — English → structured filter.
export async function parseSegment(
  query: string,
  mode: Mode
): Promise<{ filter: SegmentFilter; source: Mode }> {
  if (mode === "mock") {
    return { filter: parseSegmentMock(query), source: "mock" };
  }
  try {
    const res = await fetch("/api/segment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    if (!res.ok || !data.conditions) {
      return { filter: parseSegmentMock(query), source: "mock" };
    }
    return {
      filter: { conditions: data.conditions, human_readable: data.human_readable },
      source: "live",
    };
  } catch {
    return { filter: parseSegmentMock(query), source: "mock" };
  }
}
