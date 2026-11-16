// God's-eye view of the FPO: every deal, every allocated farmer, where supply comes from, where it goes,
// what needs attention, and how the whole book would have done in past seasons.

import { listContracts } from "@/lib/contracts/store";
import { STATE_NAMES } from "@/lib/farmers/directory";
import { loadRecommenderData } from "@/lib/recommender/data";
import { climateProfile } from "@/lib/recommender/model";

const STAGES = ["Draft", "Matching farmers", "Allocated", "Growing", "Harvest", "Shipped"] as const;
const r1 = (v: number) => Math.round(v * 10) / 10;

export interface WatchItem { level: "high" | "medium"; title: string; detail: string; href: string }

export async function getPortfolio() {
  const { contracts } = await listContracts();
  const { farmers, climate } = loadRecommenderData();
  const byId = new Map(farmers.map((f) => [f.id, f]));
  const live = contracts.filter((c) => c.status !== "Shipped");

  // Every allocated farmer line, with location and climate multipliers for the stress test.
  const lines = live.flatMap((c) => (c.allocation?.lot ?? []).map((l) => {
    const f = byId.get(l.farmerId);
    const prof = f ? climateProfile(f, c.produce, climate) : null;
    return { contractId: c.id, crop: c.produce, exporter: c.exporter, farmerId: l.farmerId, name: l.name, state: l.state, district: l.district ?? "",
      lat: f?.lat ?? null, lon: f?.lon ?? null, tonnes: l.tonnes, acres: l.acres, multipliers: prof?.multipliers ?? null, typical: prof?.typical ?? 1 };
  }));
  const allocatedT = lines.reduce((s, l) => s + l.tonnes, 0);

  // Where supply comes from.
  const dmap = new Map<string, { state: string; district: string; tonnes: number; deals: Set<string>; crops: Set<string>; farmers: Set<number> }>();
  for (const l of lines) {
    const k = `${l.state}|${l.district}`;
    const d = dmap.get(k) ?? { state: l.state, district: l.district, tonnes: 0, deals: new Set(), crops: new Set(), farmers: new Set() };
    d.tonnes += l.tonnes; d.deals.add(l.contractId); d.crops.add(l.crop); d.farmers.add(l.farmerId);
    dmap.set(k, d);
  }
  const districts = [...dmap.values()].map((d) => ({
    state: d.state, stateName: STATE_NAMES[d.state] ?? d.state, district: d.district, tonnes: r1(d.tonnes),
    share: allocatedT ? d.tonnes / allocatedT : 0, deals: [...d.deals], crops: [...d.crops], farmers: d.farmers.size,
  })).sort((a, b) => b.tonnes - a.tonnes);

  // Where it goes.
  const cmap = new Map<string, { country: string; deals: number; tonnes: number; valueINR: number; exporters: Set<string> }>();
  for (const c of live) {
    const x = cmap.get(c.country) ?? { country: c.country, deals: 0, tonnes: 0, valueINR: 0, exporters: new Set() };
    x.deals++; x.tonnes += c.qtyT; x.valueINR += c.valueINR ?? 0; x.exporters.add(c.exporter);
    cmap.set(c.country, x);
  }
  const destinations = [...cmap.values()].map((x) => ({ ...x, exporters: x.exporters.size })).sort((a, b) => b.valueINR - a.valueINR || b.tonnes - a.tonnes);

  // Stress test: replay each past season on today's allocated book (1 = every farm has a typical season).
  const seasons = new Set<number>();
  for (const l of lines) for (const s of l.multipliers?.keys() ?? []) seasons.add(s);
  const stress = [...seasons].sort((a, b) => a - b).map((season) => {
    const got = lines.reduce((s, l) => s + l.tonnes * (l.multipliers?.has(season) ? l.multipliers.get(season)! / (l.typical || 1) : 1), 0);
    return { season, delivered: allocatedT ? got / allocatedT : 1 };
  });
  const worst = stress.length ? stress.reduce((a, b) => (b.delivered < a.delivered ? b : a)) : null;

  // Money and risk.
  const valueINR = live.reduce((s, c) => s + (c.valueINR ?? 0), 0);
  const valueAtRisk = live.reduce((s, c) => s + (c.valueINR != null && c.allocation?.chance != null ? c.valueINR * (1 - c.allocation.chance) : 0), 0);
  const unallocatedValue = live.reduce((s, c) => s + (!c.allocation?.lot.length ? c.valueINR ?? 0 : 0), 0);

  // What needs attention.
  const watch: (WatchItem & { rank: number })[] = [];
  for (const c of live) {
    const a = c.allocation, href = `/contracts?id=${c.id}`, what = `${c.produce} ${c.qtyT} t · ${c.exporter}`;
    if (!a?.lot.length) watch.push({ rank: c.daysToDelivery < 60 ? 0 : 3, level: c.daysToDelivery < 60 ? "high" : "medium", title: `No farmers yet: ${what}`, detail: `Due in ${c.daysToDelivery} days`, href });
    else if (!a.feasible) watch.push({ rank: 1, level: "high", title: `Short by ${a.shortByT} t: ${what}`, detail: "Not enough eligible farmers or free land", href });
    else if (a.chance != null && a.chance < 0.7) watch.push({ rank: 2, level: "medium", title: `${Math.round(a.chance * 100)}% delivery chance: ${what}`, detail: "Consider planting 10% extra or widening the search", href });
    if (a?.lot.length && c.daysToDelivery >= 0 && c.daysToDelivery <= 30 && c.status !== "Harvest") watch.push({ rank: 1, level: "high", title: `Due in ${c.daysToDelivery} days: ${what}`, detail: `Still at “${c.status}”`, href });
  }
  for (const d of districts.filter((x) => x.share >= 0.12 || x.deals.length >= 3).slice(0, 2)) {
    watch.push({ rank: 2, level: d.share >= 0.2 ? "high" : "medium", title: `${d.district} carries ${Math.round(d.share * 100)}% of all supply`, detail: `${d.deals.length} deals depend on it: one bad season hits them together`, href: "/farmers" });
  }
  watch.sort((a, b) => a.rank - b.rank);

  const engaged = new Set(lines.map((l) => l.farmerId));
  return {
    kpis: {
      deals: live.length, exporters: new Set(live.map((c) => c.exporter)).size, countries: destinations.length,
      valueINR, valueAtRisk: Math.round(valueAtRisk), unallocatedValue,
      volumeT: r1(live.reduce((s, c) => s + c.qtyT, 0)), allocatedT: r1(allocatedT),
      farmersEngaged: engaged.size, farmersTotal: farmers.length, acresCommitted: r1(lines.reduce((s, l) => s + l.acres, 0)),
      districts: districts.length,
    },
    pipeline: STAGES.map((stage) => {
      const list = contracts.filter((c) => c.status === stage);
      return { stage, count: list.length, valueINR: list.reduce((s, c) => s + (c.valueINR ?? 0), 0) };
    }),
    timeline: live.map((c) => ({
      id: c.id, exporter: c.exporter, produce: c.produce, qtyT: c.qtyT, country: c.country, valueINR: c.valueINR, status: c.status, progress: c.progress,
      start: c.sowBy ?? c.createdAt.slice(0, 10), end: c.deliverBy, daysToDelivery: c.daysToDelivery,
      chance: c.allocation?.chance ?? null, risk: c.risk.level,
    })),
    pins: lines.filter((l) => l.lat != null).map((l) => ({ contractId: l.contractId, crop: l.crop, exporter: l.exporter, farmerId: l.farmerId, name: l.name, state: l.state, district: l.district, lat: l.lat, lon: l.lon, tonnes: l.tonnes })),
    districts, destinations,
    stress: { seasons: stress, worst, allocatedT: r1(allocatedT) },
    watch: watch.slice(0, 6).map((w) => ({ level: w.level, title: w.title, detail: w.detail, href: w.href })),
  };
}
