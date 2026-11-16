import { parseDate } from "@/lib/contracts/orderbook";
import { startDeal } from "@/lib/buyers/store";

/** POST /api/buyers/deal { exporterId, crop, qtyT, pricePerKg, deliverBy } → { contract } */
export async function POST(request: Request) {
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return Response.json({ error: "Body must be JSON" }, { status: 400 }); }
  const qtyT = Number(b.qtyT), price = Number(b.pricePerKg), deliverBy = typeof b.deliverBy === "string" ? parseDate(b.deliverBy) : null;
  if (typeof b.exporterId !== "string" || typeof b.crop !== "string") return Response.json({ error: "exporterId and crop are required" }, { status: 400 });
  if (!(qtyT > 0) || !(price > 0) || !deliverBy) return Response.json({ error: "qtyT, pricePerKg and deliverBy must be valid" }, { status: 400 });
  const out = await startDeal({ exporterId: b.exporterId, crop: b.crop, qtyT, pricePerKg: price, deliverBy });
  if ("error" in out) return Response.json({ error: out.error }, { status: out.code });
  return Response.json(out, { status: 201 });
}
