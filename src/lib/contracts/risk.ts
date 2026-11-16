import type { Contract, DealRisk } from "./types";

export function daysUntil(isoDate: string, today = new Date()): number {
  const d = new Date(isoDate + "T00:00:00");
  return Math.round((d.getTime() - new Date(today.toDateString()).getTime()) / 86400000);
}

/**
 * Deal risk, from the saved allocation:
 * - delivery chance from the recommender when every allotted farmer has climate history (score = 100 - chance%)
 * - otherwise "Provisional": we can check coverage and spread, but not weather
 */
export function dealRisk(c: Contract, today = new Date()): DealRisk {
  const a = c.allocation;
  const days = daysUntil(c.deliverBy, today);
  const timing = days < 0 ? `Delivery date passed ${-days} days ago` : `${days} days to delivery`;
  if (!a || !a.lot.length) return { level: "Unassessed", score: null, reasons: ["No farmers allocated yet", timing] };

  const reasons: string[] = [];
  if (!a.feasible) reasons.push(`Short by ${a.shortByT} t: not enough eligible farmers or free land`);
  else reasons.push(`Plan covers ${a.plannedT} t across ${a.regions} region${a.regions === 1 ? "" : "s"}`);
  reasons.push(timing);

  if (a.chance != null) {
    const score = Math.round((1 - a.chance) * 100);
    reasons.unshift(`${Math.round(a.chance * 100)}% chance of full delivery`);
    const level = !a.feasible || score >= 35 ? "High" : score >= 15 ? "Medium" : "Low";
    return { level, score, reasons };
  }
  reasons.push("Climate history not loaded: delivery chance pending");
  return { level: a.feasible ? "Provisional" : "High", score: null, reasons };
}
