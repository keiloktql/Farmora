import { loadRecommenderData } from "@/lib/recommender/data";
import { describePreferences, interpret, PREFERENCE_HELP, sanitizePreferences } from "@/lib/recommender/preferences";

/**
 * POST /api/recommend/interpret  { message: "no rain-fed farms within 500 km", current?: Preferences }
 * → { prefs, changes, understood, chips, help }. Pure interpretation: nothing is saved or recommended here.
 */
export async function POST(request: Request) {
  let body: { message?: unknown; current?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be JSON: { message, current? }" }, { status: 400 });
  }
  const message = typeof body.message === "string" ? body.message.slice(0, 1000) : "";
  if (!message.trim()) return Response.json({ error: "Send a message." }, { status: 400 });
  const data = loadRecommenderData();
  const districts = Array.from(new Map(data.farmers.filter((f) => f.district).map((f) => [`${f.state}|${f.district}`, { state: f.state, district: f.district! }])).values());
  const result = interpret(message, sanitizePreferences(body.current), {
    districts, farmers: data.farmers.map((f) => ({ id: f.id, name: f.name })), crops: data.crops.map((c) => c.name),
  });
  const names = Object.fromEntries(data.farmers.map((f) => [f.id, f.name]));
  return Response.json({ ...result, chips: describePreferences(result.prefs, names), help: PREFERENCE_HELP });
}
