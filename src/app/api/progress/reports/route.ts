import { addReport } from "@/lib/progress/store";

/**
 * POST /api/progress/reports — a farmer's progress update (from the WhatsApp bot or a field officer).
 * { contractId, farmerId, stage?: "Flowering" | frac?: 0.45, note, issue?: { text, severity: "low"|"medium"|"high" } }
 */
export async function POST(request: Request) {
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return Response.json({ error: "Body must be JSON" }, { status: 400 }); }
  const farmerId = Number(b.farmerId);
  if (typeof b.contractId !== "string" || !Number.isInteger(farmerId) || typeof b.note !== "string" || !b.note.trim()) {
    return Response.json({ error: "contractId, farmerId and note are required" }, { status: 400 });
  }
  const sev = (b.issue as { severity?: unknown } | undefined)?.severity;
  const issue = b.issue && typeof (b.issue as { text?: unknown }).text === "string" && (sev === "low" || sev === "medium" || sev === "high")
    ? { text: String((b.issue as { text: string }).text).slice(0, 200), severity: sev as "low" | "medium" | "high" } : null;
  const out = await addReport({
    contractId: b.contractId, farmerId, note: b.note.slice(0, 500), issue,
    stage: typeof b.stage === "string" ? b.stage : undefined, frac: typeof b.frac === "number" ? b.frac : undefined,
  });
  if ("error" in out) return Response.json({ error: out.error }, { status: out.code });
  return Response.json(out, { status: 201 });
}
