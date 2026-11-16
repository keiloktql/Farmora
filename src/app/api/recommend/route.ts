import { reservedAcresFor } from "@/lib/contracts/store";
import { loadRecommenderData } from "@/lib/recommender/data";
import { recommend } from "@/lib/recommender/model";
import { sanitizePreferences } from "@/lib/recommender/preferences";
import type { DealRequest } from "@/lib/recommender/types";

/**
 * POST /api/recommend
 * Body: { crop: "Mango", qtyT: 30, constraints?: Preferences (see lib/recommender/preferences.ts), contractId? }
 * With contractId, land other contracts already hold is excluded (same as saving an allocation).
 * Returns the scored shortlist and two plan options (plant exactly the contract, or 10% extra).
 */
export async function POST(request: Request) {
  let body: Partial<DealRequest>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const qtyT = Number(body.qtyT);
  if (!body.crop || typeof body.crop !== "string" || !Number.isFinite(qtyT) || qtyT <= 0) {
    return Response.json({ error: "Send a crop name and a positive qtyT (tonnes)." }, { status: 400 });
  }
  const req: DealRequest = { crop: body.crop, qtyT, constraints: sanitizePreferences(body.constraints) };
  const contractId = typeof (body as { contractId?: unknown }).contractId === "string" ? (body as { contractId: string }).contractId : null;
  const reserved = contractId ? await reservedAcresFor(contractId) : {};
  return Response.json(recommend(req, loadRecommenderData(), reserved));
}
