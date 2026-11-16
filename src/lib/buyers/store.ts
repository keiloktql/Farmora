// Farmora Pro exporter network: exporters who want to buy from Indian FPOs, what they buy, at what prices,
// when, and what they need. Access is by crop pack: an exporter's identity and contact are only returned when
// the FPO's plan covers at least one crop they buy (enforced here, not just hidden in the page).
// Sample data: src/data/buyers/exporters.json and plan.json.

import exporters from "@/data/buyers/exporters.json";
import plan from "@/data/buyers/plan.json";
import { createContracts, listContracts, reservedAcres } from "@/lib/contracts/store";
import type { Contract } from "@/lib/contracts/types";
import { loadRecommenderData } from "@/lib/recommender/data";
import { recommend } from "@/lib/recommender/model";

interface Buy { crop: string; tonnesPerYear: number; price: number[]; months: string }
interface Exporter {
  id: string; name: string; country: string; city: string; type: string; since: number; verified: boolean; responseHrs: number;
  buys: Buy[]; needs: string[]; payment: string; minOrderT: number; contact: { person: string; role: string; email: string }; about: string;
}

const ALL = exporters as Exporter[];
const inPlan = (crop: string) => plan.crops.includes(crop);
const unlocked = (e: Exporter) => e.buys.some((b) => inPlan(b.crop));

/** Tonnes your farmers could still commit per crop, after land already given to contracts. */
function capacityByCrop(contracts: Contract[]) {
  const data = loadRecommenderData(), reserved = reservedAcres(contracts);
  const out: Record<string, number> = {};
  for (const c of data.crops) {
    const res = recommend({ crop: c.name, qtyT: 1 }, data, reserved);
    out[c.name] = Math.round(res.shortlist.reduce((s, f) => s + f.capacityT, 0) * 10) / 10;
  }
  return out;
}

export async function exporterNetwork() {
  const { contracts } = await listContracts();
  const capacity = capacityByCrop(contracts as Contract[]);
  const pastPrice = (crop: string) => {
    const xs = contracts.filter((c) => c.produce === crop && c.pricePerKg != null).map((c) => c.pricePerKg as number).sort((a, b) => a - b);
    if (!xs.length) return null;
    const m = Math.floor(xs.length / 2);
    return xs.length % 2 ? xs[m] : Math.round((xs[m - 1] + xs[m]) / 2 * 10) / 10;
  };
  const list = ALL.map((e) => {
    const open = unlocked(e);
    const mine = contracts.filter((c) => c.exporter === e.name);
    return {
      id: e.id, unlocked: open, country: e.country, city: e.city, type: e.type, since: e.since, verified: e.verified, responseHrs: e.responseHrs,
      name: open ? e.name : `${e.type} · ${e.country}`,
      buys: e.buys.map((b) => ({ ...b, inPlan: inPlan(b.crop), yourCapacityT: capacity[b.crop] ?? 0, yourPastPrice: pastPrice(b.crop) })),
      demandT: e.buys.reduce((s, b) => s + b.tonnesPerYear, 0),
      needs: e.needs, payment: e.payment, minOrderT: e.minOrderT,
      contact: open ? e.contact : null, about: open ? e.about : null,
      partner: open && mine.length > 0, deals: open ? mine.map((c) => ({ id: c.id, produce: c.produce, qtyT: c.qtyT, status: c.status })) : [],
    };
  });
  const crops = Array.from(new Set(ALL.flatMap((e) => e.buys.map((b) => b.crop)))).sort().map((crop) => ({
    crop, inPlan: inPlan(crop), exporters: ALL.filter((e) => e.buys.some((b) => b.crop === crop)).length,
    demandT: ALL.reduce((s, e) => s + (e.buys.find((b) => b.crop === crop)?.tonnesPerYear ?? 0), 0), yourCapacityT: capacity[crop] ?? 0,
  }));
  return {
    plan: { tier: plan.tier, renewsOn: plan.renewsOn, crops: plan.crops, addOnPricePerCropINR: plan.addOnPricePerCropINR },
    exporters: list, crops, countries: Array.from(new Set(ALL.map((e) => e.country))).sort(),
  };
}

/** Start a deal with an exporter for a crop your plan covers: creates a contract ready for farmer matching. */
export async function startDeal(input: { exporterId: string; crop: string; qtyT: number; pricePerKg: number; deliverBy: string }) {
  const e = ALL.find((x) => x.id === input.exporterId);
  if (!e) return { error: `No exporter ${input.exporterId}`, code: 404 };
  const buy = e.buys.find((b) => b.crop === input.crop);
  if (!buy) return { error: `${e.name} does not buy ${input.crop}`, code: 400 };
  if (!inPlan(input.crop)) return { error: `${input.crop} is not in your Farmora Pro plan`, code: 403 };
  const [contract] = await createContracts([{
    exporter: e.name, produce: input.crop, qtyT: input.qtyT, country: e.country, pricePerKg: input.pricePerKg, deliverBy: input.deliverBy, sowBy: null,
    status: "Matching farmers", stageNote: `Started from the Farmora Pro exporter network`, source: "manual",
  }]);
  return { contract };
}
