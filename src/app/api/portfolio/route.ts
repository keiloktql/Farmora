import { getPortfolio } from "@/lib/portfolio";

/** GET /api/portfolio → the FPO's whole book: KPIs, pipeline, timeline, supply map, destinations, stress test, watchlist. */
export async function GET() {
  return Response.json(await getPortfolio());
}
