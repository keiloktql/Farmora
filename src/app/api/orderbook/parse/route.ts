import { EXAMPLE_ORDER_BOOK, parseOrderBook } from "@/lib/contracts/orderbook";
import { COUNTRIES } from "@/lib/contracts/standards";
import { loadRecommenderData } from "@/lib/recommender/data";

/** GET /api/orderbook/parse → an example order book to try. */
export async function GET() {
  return Response.json({ example: EXAMPLE_ORDER_BOOK });
}

/** POST /api/orderbook/parse  { text } → one parsed row per deal, with errors and warnings. Nothing is saved. */
export async function POST(request: Request) {
  let text = "";
  try {
    text = String(((await request.json()) as { text?: unknown })?.text ?? "");
  } catch {
    return Response.json({ error: "Body must be JSON: { text }" }, { status: 400 });
  }
  if (!text.trim()) return Response.json({ error: "Paste at least one line of the order book." }, { status: 400 });
  const crops = loadRecommenderData().crops.map((c) => c.name);
  const rows = parseOrderBook(text, crops, COUNTRIES);
  return Response.json({ rows, ok: rows.filter((r) => r.contract).length, failed: rows.filter((r) => !r.contract).length });
}
