import { fieldsForPrompt } from "@/lib/engine/fields";

// ─────────────────────────────────────────────────────────────────────────────
// /api/segment — parses NL → structured SegmentFilter JSON (PRD §9/§11).
// Uses ANTHROPIC_API_KEY. Returns 503 if missing so the client falls back to mock.
// ─────────────────────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "no_api_key" }, { status: 503 });
  }

  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }
  const query = (body.query ?? "").trim();
  if (!query) return Response.json({ error: "empty_query" }, { status: 400 });

  const system = `Translate a marketer's plain-English audience into a structured filter over these customer trait fields:\n${fieldsForPrompt()}\n\nReturn ONLY valid JSON: {"conditions":[{"field","op","value"}],"human_readable"}. op ∈ >=,<=,==,>,<,exists. Conditions are AND-combined. For boolean/string fields use op "==". For "cart" use op "exists". No prose, no markdown.`;

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
        messages: [{ role: "user", content: query }],
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return Response.json({ error: "anthropic_error", detail }, { status: 502 });
    }

    const data = await r.json();
    const raw: string = (data.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("")
      .trim();

    // Be forgiving: strip any code fences and extract the JSON object.
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(match ? match[0] : cleaned);

    return Response.json({
      conditions: parsed.conditions ?? [],
      human_readable: parsed.human_readable ?? "parsed filter",
    });
  } catch (e) {
    return Response.json(
      { error: "parse_failed", detail: String(e) },
      { status: 502 }
    );
  }
}
