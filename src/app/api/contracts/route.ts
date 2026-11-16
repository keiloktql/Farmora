import type { NextRequest } from "next/server";
import { parseDate } from "@/lib/contracts/orderbook";
import { createContracts, listContracts } from "@/lib/contracts/store";
import type { NewContract } from "@/lib/contracts/types";

/** GET /api/contracts?exporter=Name → contracts (with value, risk and standards) plus the exporter filter list. */
export async function GET(request: NextRequest) {
  const exporter = request.nextUrl.searchParams.get("exporter");
  return Response.json(await listContracts(exporter));
}

/** POST /api/contracts  { contracts: NewContract[] }  (or a single contract object) → created contracts. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON." }, { status: 400 });
  }
  const raw = (body as { contracts?: unknown })?.contracts ?? [body];
  if (!Array.isArray(raw) || !raw.length) return Response.json({ error: "Send { contracts: [...] }." }, { status: 400 });

  const errors: string[] = [];
  const inputs: NewContract[] = raw.map((r, i) => {
    const c = (r ?? {}) as Record<string, unknown>;
    const qtyT = Number(c.qtyT);
    const deliverBy = typeof c.deliverBy === "string" ? parseDate(c.deliverBy) : null;
    const sowBy = typeof c.sowBy === "string" && c.sowBy ? parseDate(c.sowBy) : null;
    const price = c.pricePerKg == null || c.pricePerKg === "" ? null : Number(c.pricePerKg);
    if (!c.exporter || !c.produce || !c.country) errors.push(`Contract ${i + 1}: exporter, produce and country are required`);
    if (!Number.isFinite(qtyT) || qtyT <= 0) errors.push(`Contract ${i + 1}: qtyT must be a positive number`);
    if (!deliverBy) errors.push(`Contract ${i + 1}: deliverBy must be a date`);
    if (price != null && (!Number.isFinite(price) || price < 0)) errors.push(`Contract ${i + 1}: pricePerKg must be a number`);
    return {
      exporter: String(c.exporter ?? "").trim(), produce: String(c.produce ?? "").trim(), qtyT, country: String(c.country ?? "").trim(),
      pricePerKg: price, deliverBy: deliverBy ?? "", sowBy,
      constraints: (c.constraints as NewContract["constraints"]) ?? undefined,
      source: c.source === "orderbook" ? "orderbook" : "manual",
    };
  });
  if (errors.length) return Response.json({ error: errors.join("; ") }, { status: 400 });
  return Response.json({ created: await createContracts(inputs) }, { status: 201 });
}
