import { getUsage } from "@/lib/rateLimit";

// never statically cache a live counter
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/usage — current daily live-AI budget (for the header counter).
export async function GET() {
  const usage = await getUsage();
  return Response.json(usage, {
    headers: { "cache-control": "no-store" },
  });
}
