import { exporterNetwork } from "@/lib/buyers/store";

/** GET /api/buyers → Farmora Pro exporter network: plan, exporters (locked ones without identity/contact), crops, countries. */
export async function GET() {
  return Response.json(await exporterNetwork());
}
