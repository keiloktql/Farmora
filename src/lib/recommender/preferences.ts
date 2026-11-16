// Turns the FPO manager's chat messages into recommender settings. Messages build on each other
// ("within 500 km" then "no rain-fed farms" keeps both); "reset" clears everything.
//
// Rule-based so it runs with no API key. `interpret` is the only entry point, so it can later be
// swapped for an LLM that returns the same `Preferences` shape.

import type { Irrigation } from "./types";

export interface Preferences {
  maxKm?: number | null;
  minAcres?: number | null;
  minTrust?: number | null;
  /** only these states (codes) */
  states?: string[];
  excludeStates?: string[];
  /** only these districts */
  districts?: string[];
  excludeDistricts?: string[];
  /** allowed irrigation types */
  irrigation?: Irrigation[];
  excludeRainfed?: boolean;
  /** farmers must use all of these practices */
  practices?: string[];
  /** drop farmers whose climate risk is above this */
  maxRisk?: number | null;
  excludeFarmers?: number[];
  /** max share of the plan from one farmer / one district */
  farmerCap?: number | null;
  regionCap?: number | null;
  /** how to rank: lowest climate risk first (default), nearest first, or both */
  priority?: "risk" | "distance" | "balanced";
  extraPlanted?: 0 | 0.1;
  /** crop and quantity changes, used outside contract mode */
  crop?: string;
  qtyT?: number;
}

export interface InterpretContext {
  districts: { state: string; district: string }[];
  farmers: { id: number; name: string }[];
  crops: string[];
}

export interface InterpretResult {
  prefs: Preferences;
  changes: string[];
  understood: boolean;
}

const STATES: [RegExp, string, string][] = [
  [/\bandhra( pradesh)?\b/, "AP", "Andhra Pradesh"], [/\btamil ?nadu\b/, "TN", "Tamil Nadu"], [/\bkarnataka\b/, "KA", "Karnataka"],
  [/\btelangana\b/, "TG", "Telangana"], [/\bkerala\b/, "KL", "Kerala"], [/\bmaharashtra\b/, "MH", "Maharashtra"], [/\bgujarat\b/, "GJ", "Gujarat"],
  [/\buttar pradesh\b/, "UP", "Uttar Pradesh"], [/\bbihar\b/, "BR", "Bihar"], [/\b(west )?bengal\b/, "WB", "West Bengal"],
  [/\b(odisha|orissa)\b/, "OD", "Odisha"], [/\bpunjab\b/, "PB", "Punjab"],
];
const DISTRICT_ALIASES: Record<string, string> = {
  nellore: "Sri Potti Sriramulu Nellore", kadapa: "Y.S.R. Kadapa", cuddapah: "Y.S.R. Kadapa", anantapur: "Ananthapuramu",
  ananthapur: "Ananthapuramu", bardhaman: "Purba Bardhaman", burdwan: "Purba Bardhaman", kutch: "Kachchh", mahbubnagar: "Mahabubnagar",
  chikballapur: "Chikkaballapura", belgaum: "Belagavi", bellary: "Ballari", mysore: "Mysuru", trichy: "Tiruchirappalli",
};
const NEG = /\b(avoid|exclude|excluding|except|not|no|without|skip|remove|drop|leave out|minus)\b/;
const IRR_LABEL: Record<Irrigation, string> = { rainfed: "rain-fed", canal: "canal", borewell: "borewell", borewell_drip: "drip" };
const PRACTICE_LABEL: Record<string, string> = { mulching: "mulching", raised_beds: "raised beds", shade_net: "shade net" };
const pct = (v: number) => Math.round(v * 100) + "%";
const uniq = <T,>(a: T[]) => Array.from(new Set(a));

/** Is the mention at `idx` negated by a word shortly before it? */
function negatedAt(text: string, idx: number) {
  const before = text.slice(Math.max(0, idx - 28), idx);
  return NEG.test(before) && !/\b(only|just)\b/.test(before.split(/\b(avoid|exclude|except|not|no|without|skip|remove|drop)\b/).pop() ?? "");
}

export function interpret(message: string, current: Preferences, ctx: InterpretContext): InterpretResult {
  const raw = message.trim();
  const t = " " + raw.toLowerCase().replace(/[’']/g, "") + " ";
  let p: Preferences = { ...current };
  const changes: string[] = [];
  const num = (re: RegExp) => { const m = t.match(re); return m ? Number(m[1]) : null; };

  if (/\b(reset|start over|clear (all )?(the )?(filters|preferences|settings)|remove all filters)\b/.test(t)) {
    return { prefs: {}, changes: ["Cleared all preferences"], understood: true };
  }

  // Crop and quantity (applied by the page only when it is not working on a saved contract).
  const crop = ctx.crops.find((c) => new RegExp(`\\b${c.toLowerCase()}s?\\b`).test(t));
  if (crop && /\b(switch|change|make it|instead|deal|order|need)\b/.test(t) && crop !== current.crop) { p.crop = crop; changes.push(`Crop → ${crop}`); }
  const qty = num(/\b(\d+(?:\.\d+)?)\s*(?:t|tons?|tonnes?)\b/);
  if (qty && qty > 0 && qty !== current.qtyT && !/%/.test(t.slice(t.indexOf(String(qty)), t.indexOf(String(qty)) + 6))) { p.qtyT = qty; changes.push(`Quantity → ${qty} t`); }

  // Distance
  if (/\b(any|no) (distance|distance limit)\b|\bremove (the )?distance\b|\banywhere\b/.test(t)) { if (p.maxKm != null) changes.push("No distance limit"); p.maxKm = null; }
  else {
    let km = num(/\b(?:within|under|less than|below|up to|max(?:imum)?|no more than)\s*(\d+)\s*km\b/) ?? num(/\b(\d+)\s*km\s*(?:radius|away|max)\b/);
    if (km == null && /\b(nearby|close by|local|near the fpo|close to the fpo)\b/.test(t)) km = 300;
    if (km != null) { p.maxKm = km; changes.push(`Within ${km} km of the FPO`); }
  }

  // Land size
  if (/\bany (land|farm) size\b/.test(t)) { p.minAcres = null; changes.push("Any land size"); }
  else {
    const ac = num(/\b(?:at least|min(?:imum)?|over|above|more than|≥)\s*(\d+(?:\.\d+)?)\s*(?:acres?|ac)\b/) ?? num(/\b(\d+(?:\.\d+)?)\+?\s*(?:acres?|ac)\s*(?:or more|and above|minimum)\b/);
    if (ac != null) { p.minAcres = ac; changes.push(`At least ${ac} acres`); }
    else if (/\b(big|large|bigger) (farms|farmers|growers)\b/.test(t)) { p.minAcres = 8; changes.push("At least 8 acres (larger farms)"); }
  }

  // Trust (filter only; never part of the score)
  if (/\bany trust\b|\bignore trust\b/.test(t)) { p.minTrust = null; changes.push("Any trust level"); }
  else {
    const tr = num(/\btrust(?:ed)?(?:\s*score)?\s*(?:above|over|of at least|at least|>=?|≥|of)?\s*(\d+)/);
    if (tr != null) { p.minTrust = tr; changes.push(`Trust ≥ ${tr}`); }
    else if (/\b(trusted|reliable|dependable)\b/.test(t)) { p.minTrust = 80; changes.push("Trust ≥ 80"); }
  }

  // States
  if (/\b(any|all) states?\b|\ball of india\b/.test(t)) { p.states = []; p.excludeStates = []; changes.push("All states"); }
  for (const [re, code, name] of STATES) {
    const m = re.exec(t) ?? new RegExp(`\\b${code}\\b`).exec(" " + raw + " ");
    if (!m) continue;
    if (negatedAt(t, m.index)) { p.excludeStates = uniq([...(p.excludeStates ?? []), code]); p.states = (p.states ?? []).filter((s) => s !== code); changes.push(`Exclude ${name}`); }
    else if (/\b(only|just|from|in|within|stick to|limit to)\b/.test(t)) { p.states = uniq([...(p.states ?? []), code]); p.excludeStates = (p.excludeStates ?? []).filter((s) => s !== code); changes.push(`Only ${name}`); }
  }

  // Districts
  const names = new Map<string, { state: string; district: string }>();
  for (const d of ctx.districts) names.set(d.district.toLowerCase(), d);
  for (const [alias, district] of Object.entries(DISTRICT_ALIASES)) { const d = ctx.districts.find((x) => x.district === district); if (d) names.set(alias, d); }
  for (const [label, d] of names) {
    const m = new RegExp(`\\b${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).exec(t);
    if (!m) continue;
    const key = `${d.state}|${d.district}`;
    if (negatedAt(t, m.index)) { p.excludeDistricts = uniq([...(p.excludeDistricts ?? []), key]); p.districts = (p.districts ?? []).filter((x) => x !== key); changes.push(`Exclude ${d.district}`); }
    else if (/\b(only|just|from|in|stick to|limit to)\b/.test(t)) { p.districts = uniq([...(p.districts ?? []), key]); changes.push(`Only ${d.district}`); }
  }

  // Irrigation
  if (/\b(no|avoid|exclude|without|skip) rain-?fed\b|\b(only|just) irrigated\b|\birrigated (farms )?only\b|\bnot rain-?fed\b/.test(t)) { p.excludeRainfed = true; changes.push("No rain-fed farms"); }
  if (/\b(include|allow|ok with) rain-?fed\b|\bany irrigation\b/.test(t)) { p.excludeRainfed = false; p.irrigation = []; changes.push("Any irrigation"); }
  if (/\b(only|just|must have|with|prefer)\b[^.]{0,30}\b(drip|borewell|canal)\b|\b(drip|borewell|canal)\b[^.]{0,12}\bonly\b/.test(t)) {
    const allowed: Irrigation[] = [];
    if (/\bdrip\b/.test(t)) allowed.push("borewell_drip");
    if (/\bborewell\b|\bwell\b/.test(t)) allowed.push("borewell", "borewell_drip");
    if (/\bcanal\b/.test(t)) allowed.push("canal");
    if (allowed.length) { p.irrigation = uniq(allowed); changes.push("Irrigation: " + uniq(allowed.map((a) => IRR_LABEL[a])).join(" or ")); }
  }

  // Practices
  const prac: string[] = [];
  if (/\bmulch(ing)?\b/.test(t)) prac.push("mulching");
  if (/\braised beds?\b/.test(t)) prac.push("raised_beds");
  if (/\bshade ?nets?\b/.test(t)) prac.push("shade_net");
  if (prac.length) {
    if (NEG.test(t) && /\b(dont need|not required|no need)\b/.test(t)) { p.practices = (p.practices ?? []).filter((x) => !prac.includes(x)); changes.push("Practices no longer required"); }
    else { p.practices = uniq([...(p.practices ?? []), ...prac]); changes.push("Must use " + prac.map((x) => PRACTICE_LABEL[x]).join(" and ")); }
  }

  // Risk ceiling
  if (/\bany risk\b/.test(t)) { p.maxRisk = null; changes.push("Any risk level"); }
  else {
    const r = num(/\brisk\s*(?:score)?\s*(?:below|under|less than|<|max(?:imum)?|at most|up to)\s*(\d+)/);
    if (r != null) { p.maxRisk = r; changes.push(`Climate risk ≤ ${r}`); }
    else if (/\b(low[- ]risk|safest) (farmers |farms )?only\b|\bonly (low[- ]risk|safe)\b/.test(t)) { p.maxRisk = 25; changes.push("Climate risk ≤ 25"); }
  }

  // Ranking priority
  if (/\b(prefer|prioriti[sz]e|favou?r|rank by)\b[^.]{0,25}\b(closer|nearer|nearest|nearby|distance|close)\b|\b(closest|nearest) (farmers )?first\b|\b(cut|lower|less|reduce) (transport|travel|distance)\b/.test(t)) {
    p.priority = "distance"; changes.push("Rank nearest farmers first");
  } else if (/\bbalance\b|\bboth risk and distance\b/.test(t)) {
    p.priority = "balanced"; changes.push("Rank by risk and distance together");
  } else if (/\b(lowest|least) risk first\b|\b(prioriti[sz]e|rank by|prefer) (low )?(climate )?risk\b|\bsafest first\b/.test(t)) {
    p.priority = "risk"; changes.push("Rank lowest climate risk first");
  }

  // Spread rules
  const fc = num(/\b(\d+(?:\.\d+)?)\s*%\s*(?:per |from (?:any |one |a )?(?:single )?)farmers?\b/) ?? num(/\bno (?:single )?farmer (?:more|above|over) than (\d+(?:\.\d+)?)\s*%/);
  if (fc != null) { p.farmerCap = Math.min(0.5, Math.max(0.02, fc / 100)); changes.push(`Max ${pct(p.farmerCap)} per farmer`); }
  const rc = num(/\b(\d+(?:\.\d+)?)\s*%\s*(?:per |from (?:any |one |a )?(?:single )?)(?:regions?|districts?|areas?)\b/) ?? num(/\bno (?:single )?(?:region|district|area) (?:more|above|over) than (\d+(?:\.\d+)?)\s*%/);
  if (rc != null) { p.regionCap = Math.min(1, Math.max(0.05, rc / 100)); changes.push(`Max ${pct(p.regionCap)} per district`); }
  if (fc == null && rc == null) {
    if (/\b(spread (it |them |the lot )?(out|more|wider)|more (spread|diversif\w*)|diversify more|less concentrat\w*)\b/.test(t)) {
      p.farmerCap = 0.05; p.regionCap = 0.15; changes.push("Spread wider: max 5% per farmer, 15% per district");
    } else if (/\b(fewer farmers|concentrate|less spread|bigger lots?)\b/.test(t)) {
      p.farmerCap = 0.15; p.regionCap = 0.4; changes.push("Fewer farmers: max 15% per farmer, 40% per district");
    } else if (/\bdefault (spread|caps|rules)\b/.test(t)) { p.farmerCap = null; p.regionCap = null; changes.push("Default spread rules"); }
  }

  // Extra planting
  if (/\b(10 ?% extra|plant extra|add (a )?buffer|with (a )?buffer|safety margin)\b/.test(t)) { p.extraPlanted = 0.1; changes.push("Plant 10% extra"); }
  else if (/\b(no (extra|buffer)|exactly the contract|exact quantity)\b/.test(t)) { p.extraPlanted = 0; changes.push("Plant exactly the contract"); }

  // Individual farmers
  for (const f of ctx.farmers) {
    const m = t.indexOf(" " + f.name.toLowerCase() + " ") >= 0 ? t.indexOf(f.name.toLowerCase()) : -1;
    if (m < 0) continue;
    if (/\b(add back|include|bring back|allow)\b/.test(t.slice(Math.max(0, m - 20), m))) { p.excludeFarmers = (p.excludeFarmers ?? []).filter((x) => x !== f.id); changes.push(`Include ${f.name} again`); }
    else if (negatedAt(t, m)) { p.excludeFarmers = uniq([...(p.excludeFarmers ?? []), f.id]); changes.push(`Exclude ${f.name}`); }
  }

  if (!changes.length) p = { ...current };
  return { prefs: p, changes: uniq(changes), understood: changes.length > 0 };
}

/** Human-readable chips for the active preferences; `key` is the field to clear when a chip is removed. */
export function describePreferences(p: Preferences, farmerNames: Record<number, string> = {}): { key: keyof Preferences; label: string }[] {
  const out: { key: keyof Preferences; label: string }[] = [];
  if (p.maxKm != null) out.push({ key: "maxKm", label: `Within ${p.maxKm} km` });
  if (p.minAcres != null) out.push({ key: "minAcres", label: `≥ ${p.minAcres} acres` });
  if (p.minTrust != null) out.push({ key: "minTrust", label: `Trust ≥ ${p.minTrust}` });
  if (p.states?.length) out.push({ key: "states", label: `Only ${p.states.join(", ")}` });
  if (p.excludeStates?.length) out.push({ key: "excludeStates", label: `Not ${p.excludeStates.join(", ")}` });
  if (p.districts?.length) out.push({ key: "districts", label: `Only ${p.districts.map((d) => d.split("|")[1]).join(", ")}` });
  if (p.excludeDistricts?.length) out.push({ key: "excludeDistricts", label: `Not ${p.excludeDistricts.map((d) => d.split("|")[1]).join(", ")}` });
  if (p.irrigation?.length) out.push({ key: "irrigation", label: "Irrigation: " + uniq(p.irrigation.map((i) => IRR_LABEL[i])).join("/") });
  if (p.excludeRainfed) out.push({ key: "excludeRainfed", label: "No rain-fed" });
  if (p.practices?.length) out.push({ key: "practices", label: "Uses " + p.practices.map((x) => PRACTICE_LABEL[x] ?? x).join(" + ") });
  if (p.maxRisk != null) out.push({ key: "maxRisk", label: `Risk ≤ ${p.maxRisk}` });
  if (p.excludeFarmers?.length) out.push({ key: "excludeFarmers", label: `Excluding ${p.excludeFarmers.map((id) => farmerNames[id] ?? "#" + id).join(", ")}` });
  if (p.farmerCap != null) out.push({ key: "farmerCap", label: `≤ ${pct(p.farmerCap)} per farmer` });
  if (p.regionCap != null) out.push({ key: "regionCap", label: `≤ ${pct(p.regionCap)} per district` });
  if (p.priority && p.priority !== "risk") out.push({ key: "priority", label: p.priority === "distance" ? "Nearest first" : "Risk + distance" });
  return out;
}

export const PREFERENCE_HELP = [
  "within 500 km", "at least 3 acres", "trust above 85", "only Andhra and Karnataka", "avoid Kolar", "no rain-fed farms",
  "drip or borewell only", "must use mulching", "risk below 20", "prefer closer farmers", "spread it out more",
  "max 5% per farmer", "plant 10% extra", "exclude <farmer name>", "reset",
];

/** Keep only well-formed preference fields from untrusted JSON. */
export function sanitizePreferences(raw: unknown): Preferences {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const num = (v: unknown, lo: number, hi: number) => (v == null || v === "" || !Number.isFinite(Number(v)) ? null : Math.min(hi, Math.max(lo, Number(v))));
  const strs = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 60) : []);
  const IRR = ["rainfed", "canal", "borewell", "borewell_drip"];
  const p: Preferences = {
    maxKm: num(r.maxKm, 1, 5000), minAcres: num(r.minAcres, 0, 1000), minTrust: num(r.minTrust, 0, 100),
    states: strs(r.states), excludeStates: strs(r.excludeStates), districts: strs(r.districts), excludeDistricts: strs(r.excludeDistricts),
    irrigation: strs(r.irrigation).filter((x) => IRR.includes(x)) as Irrigation[], excludeRainfed: r.excludeRainfed === true,
    practices: strs(r.practices), maxRisk: num(r.maxRisk, 0, 100),
    excludeFarmers: Array.isArray(r.excludeFarmers) ? r.excludeFarmers.map(Number).filter(Number.isInteger) : [],
    farmerCap: num(r.farmerCap, 0.02, 0.5), regionCap: num(r.regionCap, 0.05, 1),
    priority: r.priority === "distance" || r.priority === "balanced" ? r.priority : "risk",
  };
  if (r.extraPlanted === 0 || r.extraPlanted === 0.1) p.extraPlanted = r.extraPlanted;
  return p;
}
