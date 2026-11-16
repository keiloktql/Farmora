// Farmer recommender: climate-risk scoring, spread-out lot selection and deal risk.
// Ported from the backtested Python model (recsys/hlrec on the yash-changes branch), with track records
// switched off: every farmer is treated as new, and trust is display/filter only.

import type {
  CalibrationData, ClimateData, CropProfile, DealRequest, FarmerRecord, LotLine, PlanOption, RecommendResponse,
  ScoredFarmer, SeasonAnomaly,
} from "./types";

export const HISTORY_SEASONS = 15;        // past seasons replayed per farmer
export const MIN_SEASONS = 8;             // fewer than this -> no climate score
export const FARMER_CAP = 0.08;           // no farmer above 8% of the plan
export const REGION_CAP = 0.25;           // no district (or state, if district unknown) above 25% of the plan
export const DELIVERY_PRIOR = 0.92;       // chance a new farmer delivers at all (no track record yet)
export const FARM_NOISE = 0.15;           // farm-to-farm variation within a district in one season
export const UNKNOWN_FREE_SHARE = 0.4;    // free land assumed when not reported
export const EXTRA_OPTIONS = [0, 0.1];    // management chooses: plant exactly the contract, or 10% extra

const PRIOR_SENSITIVITY = { rainfed: 1.25, canal: 1.0, borewell: 0.9, borewell_drip: 0.75 } as const;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const round = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

/** How strongly a farm feels a bad season, from onboarding answers only. */
export function sensitivity(f: FarmerRecord): { value: number; flags: string[]; reasons: string[] } {
  const flags: string[] = [];
  const reasons: string[] = [];
  let s: number;
  if (f.irrigation) {
    s = PRIOR_SENSITIVITY[f.irrigation];
    reasons.push(f.irrigation === "rainfed" ? "Rain-fed: feels bad seasons more" : `Irrigation: ${f.irrigation.replace("_", " + ")}`);
    if (f.irrigation !== "rainfed" && f.irrigationReliable === false) { s *= 1.1; reasons.push("Water runs short in dry months"); }
  } else {
    s = 1.0;
    flags.push("Irrigation not recorded");
  }
  if (f.practices?.includes("mulching")) { s *= 0.92; reasons.push("Mulching"); }
  if (f.practices?.includes("raised_beds")) { s *= 0.97; reasons.push("Raised beds"); }
  if (f.waterlogging === "sometimes") s *= 1.03;
  if (f.waterlogging === "often") { s *= 1.1; reasons.push("Field often waterlogs"); }
  return { value: s, flags, reasons };
}

function climateSeries(climate: ClimateData, crop: string, f: FarmerRecord): { series: SeasonAnomaly[]; place: string; source: string } | null {
  const byPlace = climate.crops[crop];
  if (!byPlace) return null;
  for (const key of [f.district ? `${f.state}|${f.district}` : null, f.state]) {
    if (key && byPlace[key]?.length) {
      const series = [...byPlace[key]].sort((a, b) => b.season - a.season).slice(0, HISTORY_SEASONS);
      if (series.length >= MIN_SEASONS) return { series, place: key, source: climate.sources?.[crop]?.[key] === "weather" ? "weather-stress score" : "yield records" };
    }
  }
  return null;
}

export interface ClimateProfile {
  /** 0-100, higher = riskier */
  riskScore: number;
  /** average loss in the worst 20% of seasons at this farm (0.2 = 20% below normal) */
  tailLoss: number;
  place: string;
  source: string;
  /** newest first: the area's anomaly, and this farm's (after irrigation/practices) */
  seasons: { season: number; area: number; farm: number }[];
  /** season -> farm yield multiplier (1 = normal) */
  multipliers: Map<number, number>;
  typical: number;
  reason: string;
}

/** Climate risk for one farmer and one crop, from past seasons at their location scaled by their sensitivity. */
export function climateProfile(f: FarmerRecord, crop: string, climate: ClimateData, sens = sensitivity(f).value): ClimateProfile | null {
  const hist = climateSeries(climate, crop, f);
  if (!hist) return null;
  const drift = hist.series.reduce((s, x) => s + x.anomaly, 0) / hist.series.length;
  const multipliers = new Map(hist.series.map((x) => [x.season, Math.max(0, 1 + drift + sens * (x.anomaly - drift))]));
  const losses = [...multipliers.values()].map((v) => 1 - v).sort((a, b) => b - a);
  const k = Math.max(1, Math.round(0.2 * losses.length));
  const tail = losses.slice(0, k).reduce((s, v) => s + v, 0) / k;
  return {
    riskScore: Math.round(100 * clamp(tail / 0.6, 0, 1)), tailLoss: round(Math.max(0, tail), 3), place: hist.place, source: hist.source,
    seasons: hist.series.map((x) => ({ season: x.season, area: round(x.anomaly, 3), farm: round(multipliers.get(x.season)! - 1, 3) })),
    multipliers, typical: Math.max(0, 1 + drift),
    reason: `Worst seasons at ${hist.place.split("|").reverse().join(", ")}: about ${Math.round(Math.max(0, tail) * 100)}% below normal (${hist.source}, ${hist.series.length} seasons)`,
  };
}

/** Deterministic random numbers so the same request always gives the same answer. */
function rng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const normal = () => {
    const u = Math.max(next(), 1e-12), v = next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  return { next, normal };
}

function calibrate(cal: CalibrationData | null, extra: number, raw: number): number {
  const table = cal?.tables[extra.toFixed(2)];
  if (!table?.length) return raw;
  // The backtest only saw well-covered plans; below its lowest point, scale down toward 0 instead of clamping up.
  if (raw <= table[0][0]) return table[0][0] > 0 ? table[0][1] * (raw / table[0][0]) : raw;
  for (let i = 1; i < table.length; i++) {
    const [x0, y0] = table[i - 1], [x1, y1] = table[i];
    if (raw <= x1) return x1 === x0 ? y1 : y0 + ((raw - x0) / (x1 - x0)) * (y1 - y0);
  }
  return table[table.length - 1][1];
}

type Prepared = { farmer: ScoredFarmer; region: string; multipliers: Map<number, number> | null; typical: number; perAcreT: number };

export function recommend(
  req: DealRequest,
  data: { farmers: FarmerRecord[]; crops: CropProfile[]; climate: ClimateData; calibration: CalibrationData | null },
  /** acres each farmer has already committed to other contracts (farmer id -> acres) */
  reservedAcres: Record<number, number> = {},
): RecommendResponse {
  const notes: string[] = [];
  const crop = data.crops.find((c) => c.name.toLowerCase() === req.crop.toLowerCase());
  const climatePlaces = Object.keys(data.climate.crops[crop?.name ?? req.crop] ?? {}).length;
  if (!crop) notes.push(`No crop profile for ${req.crop}: yield per acre and grade share are needed to size the lot.`);
  if (!climatePlaces) notes.push(`No climate history loaded for ${req.crop}: risk scores and delivery chance are pending.`);
  if (!data.farmers.length) notes.push("No farmers loaded.");

  const c = req.constraints ?? {};
  const place = (f: FarmerRecord) => `${f.state}|${f.district ?? ""}`;
  const eligible = data.farmers.filter((f) =>
    f.crops.some((x) => x.toLowerCase() === req.crop.toLowerCase())
    && (!c.maxKm || f.kmFromFpo <= c.maxKm)
    && (!c.minAcres || f.totalAcres >= c.minAcres)
    && (!c.minTrust || (f.trust ?? 0) >= c.minTrust)
    && (!c.states?.length || c.states.includes(f.state))
    && !c.excludeStates?.includes(f.state)
    && (!c.districts?.length || c.districts.includes(place(f)))
    && !c.excludeDistricts?.includes(place(f))
    && (!c.irrigation?.length || (f.irrigation != null && c.irrigation.includes(f.irrigation)))
    && !(c.excludeRainfed && (f.irrigation === "rainfed" || f.irrigation == null))
    && (c.practices ?? []).every((p) => f.practices?.includes(p))
    && !c.excludeFarmers?.includes(f.id));

  // Seasons shared by everyone with history, so bad years line up across farmers (that's what spreading protects against).
  const prepared: Prepared[] = eligible.map((f) => {
    const sens = sensitivity(f);
    const prof = climateProfile(f, crop?.name ?? req.crop, data.climate, sens.value);
    const flags = [...sens.flags];
    const reasons = [...sens.reasons];
    let riskScore: number | null = null;
    let multipliers: Map<number, number> | null = null;
    let typical = 1;
    if (prof) {
      ({ riskScore, multipliers, typical } = prof);
      reasons.unshift(prof.reason);
    } else {
      flags.push("Climate history not loaded");
    }
    const reported = f.freeAcres ?? f.totalAcres * UNKNOWN_FREE_SHARE;
    if (f.freeAcres == null) flags.push("Free land not reported (assumed 40%)");
    const reserved = reservedAcres[f.id] ?? 0;
    if (reserved > 0) flags.push(`${round(reserved, 2)} ac already committed to other contracts`);
    const freeAcres = Math.max(0, reported - reserved);
    const perAcreT = crop ? crop.yieldTPerAcre * crop.gradeShare * DELIVERY_PRIOR : 0;
    return {
      farmer: { ...f, riskScore, sensitivity: round(sens.value, 2), capacityT: round(freeAcres * perAcreT, 2), freeAcresUsed: round(freeAcres, 2), flags, reasons },
      region: f.district ? `${f.state}|${f.district}` : f.state,
      multipliers, typical, perAcreT,
    };
  });

  // Optional ceiling on climate risk (farmers without history are kept).
  const pool = c.maxRisk != null ? prepared.filter((p) => p.farmer.riskScore == null || p.farmer.riskScore <= c.maxRisk!) : prepared;
  if (c.maxRisk != null && pool.length < prepared.length) notes.push(`${prepared.length - pool.length} farmers above risk ${c.maxRisk} left out.`);

  // Ranking: lowest climate risk first (default; unknown risk sits in the middle), nearest first, or both together.
  const risk = (p: Prepared) => p.farmer.riskScore ?? 50;
  const km = (p: Prepared) => Math.min(p.farmer.kmFromFpo / 25, 100);      // 2,500 km -> 100
  const rankKey = c.priority === "distance" ? (p: Prepared) => km(p) * 1000 + risk(p)
    : c.priority === "balanced" ? (p: Prepared) => 0.6 * risk(p) + 0.4 * km(p)
    : (p: Prepared) => risk(p) * 1000 + km(p);
  pool.sort((a, b) => rankKey(a) - rankKey(b));
  const farmerCap = c.farmerCap ?? FARMER_CAP, regionCap = c.regionCap ?? REGION_CAP;

  const options: PlanOption[] = EXTRA_OPTIONS.map((extra) => {
    const planned = req.qtyT * (1 + extra);
    const used = new Map<string, number>();
    const picks: { p: Prepared; t: number }[] = [];
    let left = planned;
    for (const p of pool) {
      if (left <= 1e-9 || !crop) break;
      const room = Math.min(p.farmer.capacityT, farmerCap * planned, regionCap * planned - (used.get(p.region) ?? 0));
      if (room <= 0) continue;
      const t = Math.min(room, left);
      picks.push({ p, t });
      used.set(p.region, (used.get(p.region) ?? 0) + t);
      left -= t;
    }
    const plannedT = planned - Math.max(0, left);
    const lot: LotLine[] = picks.map(({ p, t }) => ({ id: p.farmer.id, tonnes: round(t, 2), acres: round(p.perAcreT ? t / p.perAcreT : 0, 2) }));
    const base = {
      extraPlanted: extra, plannedT: round(plannedT, 1), feasible: left <= 1e-6 && !!crop, shortByT: round(Math.max(0, left), 1),
      lot, landAcres: round(lot.reduce((s, l) => s + l.acres, 0), 1), farmers: lot.length, regions: used.size,
    };
    const missing = picks.filter(({ p }) => !p.multipliers).length;
    if (!picks.length || missing) {
      return { ...base, chance: null, rawChance: null, avgShortfallWhenShortT: null, expectedSurplusT: null,
        chanceNote: !picks.length ? "No lot yet." : `Needs climate history for ${missing} of ${picks.length} farmers in the lot.` };
    }
    // Replay past seasons: every lot farmer gets that season's multiplier, plus farm-level luck and the chance of not delivering.
    const seasons = Array.from(new Set(picks.flatMap(({ p }) => [...p.multipliers!.keys()]))).sort((a, b) => a - b);
    const r = rng(Math.round(req.qtyT * 1000) + seasons.length * 7919 + Math.round(extra * 100));
    const draws = 200;
    let met = 0, total = 0, shortSum = 0, shortCount = 0, surplusSum = 0;
    for (const season of seasons) {
      for (let d = 0; d < draws; d++) {
        let supply = 0;
        for (const { p, t } of picks) {
          const m = p.multipliers!.get(season) ?? p.typical;   // season not on record -> a typical season
          if (r.next() > DELIVERY_PRIOR) continue;
          supply += (t / DELIVERY_PRIOR) * m * Math.max(0, 1 + FARM_NOISE * r.normal());
        }
        total++;
        if (supply >= req.qtyT) met++;
        else { shortSum += req.qtyT - supply; shortCount++; }
        surplusSum += Math.max(0, supply - req.qtyT);
      }
    }
    const raw = met / total;
    return {
      ...base, rawChance: round(raw, 3), chance: round(base.feasible ? calibrate(data.calibration, extra, raw) : raw, 3),
      avgShortfallWhenShortT: shortCount ? round(shortSum / shortCount, 1) : 0, expectedSurplusT: round(surplusSum / total, 1),
      chanceNote: `Replays ${seasons.length} past seasons for the lot, calibrated against the backtest.`,
    };
  });

  return {
    crop: crop?.name ?? req.crop, qtyT: req.qtyT,
    dataStatus: { farmers: data.farmers.length, cropProfile: !!crop, climatePlaces, notes },
    shortlist: pool.map((p) => p.farmer),
    options,
  };
}
