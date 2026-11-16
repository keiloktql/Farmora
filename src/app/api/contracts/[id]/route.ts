import { getContract } from "@/lib/contracts/store";

/** GET /api/contracts/CT-1001 → one contract with value, deal risk, standards and allocated farmers. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) return Response.json({ error: `No contract ${id}` }, { status: 404 });
  return Response.json(contract);
}
