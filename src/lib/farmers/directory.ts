// Farmer directory: the onboarding records plus what the rest of the system knows about each farmer —
// climate risk per crop (same scoring the recommender uses) and land committed to contracts.

import { listContracts } from "@/lib/contracts/store";
import { loadRecommenderData } from "@/lib/recommender/data";
import { climateProfile, sensitivity, UNKNOWN_FREE_SHARE } from "@/lib/recommender/model";
import type { FarmerRecord, Irrigation } from "@/lib/recommender/types";

export const STATE_NAMES: Record<string, string> = {
  AP: "Andhra Pradesh", TN: "Tamil Nadu", KA: "Karnataka", TG: "Telangana", KL: "Kerala", MH: "Maharashtra", GJ: "Gujarat",
  UP: "Uttar Pradesh", BR: "Bihar", WB: "West Bengal", OD: "Odisha", PB: "Punjab",
};

export interface Commitment {
  contractId: string; exporter: string; produce: string; status: string; deliverBy: string; tonnes: number; acres: number;
}

export interface FarmerQuery {
  q?: string | null; crop?: string | null; state?: string | null; irrigation?: string | null;
  onContract?: "yes" | "no" | null; sort?: "risk" | "name" | "km" | "free" | null;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

async function commitmentsByFarmer() {
  const { contracts } = await listContracts();
  const out = new Map<number, Commitment[]>();
  for (const c of contracts) {
    for (const l of c.allocation?.lot ?? []) {
      const list = out.get(l.farmerId) ?? [];
      list.push({ contractId: c.id, exporter: c.exporter, produce: c.produce, status: c.status, deliverBy: c.deliverBy, tonnes: l.tonnes, acres: l.acres });
      out.set(l.farmerId, list);
    }
  }
  return out;
}

function summarise(f: FarmerRecord, commits: Commitment[]) {
  const { climate } = loadRecommenderData();
  const risk: Record<string, number | null> = {};
  for (const crop of f.crops) risk[crop] = climateProfile(f, crop, climate)?.riskScore ?? null;
  const reported = f.freeAcres ?? f.totalAcres * UNKNOWN_FREE_SHARE;
  const committed = r2(commits.reduce((s, c) => s + c.acres, 0));
  return {
    ...f, stateName: STATE_NAMES[f.state] ?? f.state, risk, freeReported: f.freeAcres != null,
    committedAcres: committed, freeNowAcres: r2(Math.max(0, reported - committed)), contracts: commits.length,
  };
}
export type FarmerSummary = ReturnType<typeof summarise>;

/** Filtered, sorted list plus totals and filter options. */
export async function searchFarmers(query: FarmerQuery) {
  const { farmers } = loadRecommenderData();
  const commits = await commitmentsByFarmer();
  const all = farmers.map((f) => summarise(f, commits.get(f.id) ?? []));
  const q = query.q?.trim().toLowerCase();
  const crop = query.crop || null;
  const rows = all.filter((f) =>
    (!q || [f.name, f.district, f.village, f.stateName, f.state].some((x) => x?.toLowerCase().includes(q)))
    && (!crop || f.crops.includes(crop))
    && (!query.state || f.state === query.state)
    && (!query.irrigation || f.irrigation === query.irrigation)
    && (!query.onContract || (query.onContract === "yes" ? f.contracts > 0 : f.contracts === 0)));
  // Risk shown for the crop being filtered on, otherwise the farmer's lowest-risk crop.
  const shownRisk = (f: FarmerSummary) => {
    if (crop) return f.risk[crop] ?? null;
    const v = Object.values(f.risk).filter((x): x is number => x != null);
    return v.length ? Math.min(...v) : null;
  };
  const sort = query.sort ?? "risk";
  rows.sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name)
      : sort === "km" ? a.kmFromFpo - b.kmFromFpo
      : sort === "free" ? b.freeNowAcres - a.freeNowAcres
      : (shownRisk(a) ?? 101) - (shownRisk(b) ?? 101) || a.kmFromFpo - b.kmFromFpo);

  const count = <K extends string>(key: (f: FarmerSummary) => K[]) => {
    const m: Record<string, number> = {};
    for (const f of all) for (const k of key(f)) m[k] = (m[k] ?? 0) + 1;
    return m;
  };
  return {
    farmers: rows.map((f) => ({ ...f, shownRisk: shownRisk(f), riskCrop: crop })),
    totals: {
      farmers: all.length,
      districts: new Set(all.map((f) => `${f.state}|${f.district}`)).size,
      states: new Set(all.map((f) => f.state)).size,
      totalAcres: Math.round(all.reduce((s, f) => s + f.totalAcres, 0)),
      freeAcres: Math.round(all.reduce((s, f) => s + f.freeNowAcres, 0)),
      committedAcres: Math.round(all.reduce((s, f) => s + f.committedAcres, 0) * 10) / 10,
      onContracts: all.filter((f) => f.contracts > 0).length,
    },
    facets: {
      crops: count((f) => f.crops),
      states: count((f) => [f.state]),
      irrigation: count((f) => (f.irrigation ? [f.irrigation] : [])),
    },
    stateNames: STATE_NAMES,
  };
}

/** One farmer's full profile: onboarding answers, contracts, and the climate history behind each risk score. */
export async function getFarmer(id: number) {
  const { farmers, climate } = loadRecommenderData();
  const f = farmers.find((x) => x.id === id);
  if (!f) return null;
  const commits = (await commitmentsByFarmer()).get(id) ?? [];
  const sens = sensitivity(f);
  const climateByCrop = f.crops.map((crop) => {
    const p = climateProfile(f, crop, climate, sens.value);
    if (!p) return { crop, riskScore: null, note: "No climate history for this crop here yet" };
    const worst = [...p.seasons].sort((a, b) => a.farm - b.farm).slice(0, 3);
    return { crop, riskScore: p.riskScore, tailLoss: p.tailLoss, place: p.place, source: p.source, seasons: [...p.seasons].reverse(), worst, reason: p.reason };
  });
  return {
    ...summarise(f, commits),
    sensitivity: Math.round(sens.value * 100) / 100, sensitivityReasons: sens.reasons, flags: sens.flags,
    commitments: commits, climate: climateByCrop,
  };
}

export const IRRIGATION_LABEL: Record<Irrigation, string> = { rainfed: "Rain-fed", canal: "Canal", borewell: "Borewell", borewell_drip: "Borewell + drip" };
