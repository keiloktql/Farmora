import { allocateContract } from "@/lib/contracts/store";
import { sanitizePreferences } from "@/lib/recommender/preferences";

/**
 * POST /api/contracts/CT-1001/allocate  { extraPlanted?: 0 | 0.1, constraints?: Preferences }
 * Runs the recommender for this contract (land already given to other contracts is excluded) and saves the lot.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let extra = 0;
  let constraints: Parameters<typeof allocateContract>[2];
  try {
    const body = (await request.json()) as { extraPlanted?: number; constraints?: Record<string, unknown> };
    extra = body?.extraPlanted === 0.1 ? 0.1 : 0;
    if (body?.constraints && typeof body.constraints === "object") constraints = sanitizePreferences(body.constraints);
  } catch {
    /* no body: plant exactly the contract, keep its saved filters */
  }
  const contract = await allocateContract(id, extra, constraints);
  if (!contract) return Response.json({ error: `No contract ${id}` }, { status: 404 });
  return Response.json(contract);
}
