import { resetUsage } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// POST /api/usage/reset?token=XXX  — resets today's live-AI budget to 0.
// Disabled unless RESET_TOKEN is set in env, and the request must supply a
// matching token (query ?token= or x-reset-token header). Safe by default.
export async function POST(req: Request) {
  const secret = process.env.RESET_TOKEN;
  if (!secret) {
    return Response.json(
      { error: "reset_disabled", hint: "set RESET_TOKEN in env to enable" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);
  const provided = url.searchParams.get("token") || req.headers.get("x-reset-token");
  if (provided !== secret) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }

  const usage = await resetUsage();
  return Response.json({ ok: true, ...usage }, { headers: { "cache-control": "no-store" } });
}
