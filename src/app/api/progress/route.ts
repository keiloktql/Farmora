import { projectProgress } from "@/lib/progress/store";

/** GET /api/progress → every allocated project: timeline, expected vs reported progress, farmers, report feed. */
export async function GET() {
  return Response.json(await projectProgress());
}
