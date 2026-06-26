// ─────────────────────────────────────────────────────────────────────────────
// /api/generate — drafts ONE WhatsApp message from task-scoped context (PRD §11).
// Uses ANTHROPIC_API_KEY. Returns 503 if missing so the client falls back to mock.
// ─────────────────────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "no_api_key", message: null },
      { status: 503 }
    );
  }

  let body: {
    role?: string;
    instruction?: string;
    context?: unknown;
    freshness?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json", message: null }, { status: 400 });
  }

  const role = body.role ?? "customer engagement agent";
  const instruction = body.instruction ?? "Write a helpful WhatsApp message.";

  const system = `You are the ${role} for an Indian e-commerce brand on the Velocity platform. Job: ${instruction}. Write ONE WhatsApp message. Constraints: India-appropriate (₹, UPI/COD), warm but concise (≤320 chars), one clear CTA, ≤2 emoji. Use ONLY the provided context; invent nothing.`;

  const user = `Customer context (task-scoped):\n${JSON.stringify(
    { context: body.context, freshness: body.freshness },
    null,
    2
  )}\n\nWrite the message.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return Response.json(
        { error: "anthropic_error", detail, message: null },
        { status: 502 }
      );
    }

    const data = await r.json();
    const out: string = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("")
      .trim();

    return Response.json({ message: out });
  } catch (e) {
    return Response.json(
      { error: "fetch_failed", detail: String(e), message: null },
      { status: 502 }
    );
  }
}
