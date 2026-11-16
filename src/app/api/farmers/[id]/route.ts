import { getFarmer } from "@/lib/farmers/directory";

/** GET /api/farmers/42 → full profile with climate history and contract commitments. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const farmer = await getFarmer(Number(id));
  if (!farmer) return Response.json({ error: `No farmer ${id}` }, { status: 404 });
  return Response.json(farmer);
}
