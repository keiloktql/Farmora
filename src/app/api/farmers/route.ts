import { searchFarmers, type FarmerQuery } from "@/lib/farmers/directory";

/**
 * GET /api/farmers?q=&crop=Mango&state=AP&irrigation=borewell&onContract=yes|no&sort=risk|name|km|free
 * → { farmers, totals, facets, stateNames }
 */
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams;
  const pick = <T extends string>(v: string | null, ok: readonly T[]) => (v && (ok as readonly string[]).includes(v) ? (v as T) : null);
  const query: FarmerQuery = {
    q: p.get("q")?.slice(0, 80) ?? null, crop: p.get("crop"), state: p.get("state"), irrigation: p.get("irrigation"),
    onContract: pick(p.get("onContract"), ["yes", "no"] as const), sort: pick(p.get("sort"), ["risk", "name", "km", "free"] as const),
  };
  return Response.json(await searchFarmers(query));
}
