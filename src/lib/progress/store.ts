// Farmer progress reports and project progress. Reports arrive from farmers (WhatsApp in production) through
// POST /api/progress/reports and are kept in .data/reports.json (git-ignored). Until real reports flow in, each
// allocated contract is seeded with sample reports (marked sample: true) so the page has something to show.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { listContracts } from "@/lib/contracts/store";
import { CYCLE_DAYS, ISSUES, stageAt, stagesFor } from "./stages";

export interface Report {
  id: string; contractId: string; farmerId: number; date: string; frac: number; stage: string; note: string;
  issue: { text: string; severity: "low" | "medium" | "high" } | null; sample?: boolean;
}

const FILE = path.join(process.cwd(), ".data", "reports.json");
let cache: Record<string, Report[]> | null = null;
let queue: Promise<unknown> = Promise.resolve();
const DAY = 86400000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const day = (s: string) => new Date(s + "T00:00:00Z").getTime();
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

async function readAll() {
  if (cache) return cache;
  try { cache = JSON.parse(await readFile(FILE, "utf8")); } catch { cache = {}; }
  return cache!;
}
async function writeAll(all: Record<string, Report[]>) {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(all, null, 1));
  cache = all;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7);

type C = Awaited<ReturnType<typeof listContracts>>["contracts"][number];
/** Season window for a contract. Normally sowing (or the crop cycle) to delivery; for contracts already marked
 *  Growing/Harvest with a recorded progress %, the window is anchored so today sits at that progress (capped at 2 cycles). */
const window = (c: C, today: number) => {
  const cycle = (CYCLE_DAYS[c.produce] ?? 120) * DAY, end = day(c.deliverBy);
  let start = c.sowBy ? day(c.sowBy) : end - cycle;
  const p = (c.progress ?? 0) / 100;
  if ((c.status === "Growing" || c.status === "Harvest") && p > 0 && p < 1 && (today - start) / (end - start) < p && end > today) {
    start = Math.max(end - 2 * cycle, today - p * (end - today) / (1 - p));
  }
  return { start, end };
};

const NOTES = [
  (s: string) => `${s}. Plants look healthy, irrigation on schedule.`,
  (s: string) => `${s} on most rows. Weeding done this week.`,
  (s: string) => `Reached ${s.toLowerCase()}. Applied fertiliser as advised.`,
  (s: string) => `${s}. Sent photos to the FPO field officer.`,
];

/** Sample reports for one contract: every 10–18 days per farmer, riskier farms lag a little, a few go quiet. */
function seed(c: C, today: number): Report[] {
  const { start, end } = window(c, today), span = end - start, out: Report[] = [];
  for (const l of c.allocation?.lot ?? []) {
    const r = rng(hash(c.id + ":" + l.farmerId));
    const lag = (l.riskScore ?? 30) / 100 * 0.14 * r() + (r() < .2 ? .06 : 0);
    const quietFrom = r() < .12 ? today - (16 + r() * 10) * DAY : Infinity;
    for (let t = start + (4 + r() * 8) * DAY; t <= Math.min(today, quietFrom); t += (10 + r() * 8) * DAY) {
      const frac = clamp((t - start) / span - lag + (r() - .5) * .04);
      const st = stageAt(c.produce, frac);
      const hasIssue = r() < .1 + (l.riskScore ?? 30) / 400;
      const issues = ISSUES[c.produce] ?? ["Pest seen on a few plants"];
      out.push({
        id: `${c.id}-${l.farmerId}-${iso(t)}`, contractId: c.id, farmerId: l.farmerId, date: iso(t), frac: Math.round(frac * 1000) / 1000, stage: st.name,
        note: NOTES[Math.floor(r() * NOTES.length)](st.name),
        issue: hasIssue ? { text: issues[Math.floor(r() * issues.length)], severity: r() < .2 ? "high" : r() < .6 ? "medium" : "low" } : null,
        sample: true,
      });
    }
  }
  return out;
}

export async function projectProgress() {
  const today = day(new Date().toISOString().slice(0, 10));
  const { contracts } = await listContracts();
  const live = contracts.filter((c) => c.allocation?.lot.length && c.status !== "Shipped");
  const all = { ...(await readAll()) };
  let changed = false;
  for (const c of live) if (!all[c.id]) { all[c.id] = seed(c, today); changed = true; }
  if (changed) await writeAll(all);

  const projects = live.map((c) => {
    const { start, end } = window(c, today), span = end - start;
    const expected = clamp((today - start) / span);
    const reports = (all[c.id] ?? []).slice().sort((a, b) => a.date.localeCompare(b.date));
    const farmers = c.allocation!.lot.map((l) => {
      const mine = reports.filter((r) => r.farmerId === l.farmerId), last = mine[mine.length - 1] ?? null;
      const daysSince = last ? Math.round((today - day(last.date)) / DAY) : null;
      const openIssue = mine.slice(-2).map((r) => r.issue).filter(Boolean).pop() ?? null;
      const frac = last?.frac ?? 0;
      return {
        farmerId: l.farmerId, name: l.name, district: l.district ?? "", state: l.state, plannedT: l.tonnes, frac, stage: last?.stage ?? "No report yet",
        lastReport: last?.date ?? null, daysSince, silent: daysSince == null ? today - start > 14 * DAY : daysSince > 14, behind: expected - frac > .12, issue: openIssue,
      };
    });
    const tot = farmers.reduce((s, f) => s + f.plannedT, 0) || 1;
    const reported = farmers.reduce((s, f) => s + f.frac * f.plannedT, 0) / tot;
    const impact = { low: .05, medium: .15, high: .3 };
    const forecastT = farmers.reduce((s, f) => s + f.plannedT * (1 - (f.issue ? impact[f.issue.severity] : 0)), 0);
    const gap = expected - reported;
    const issues = farmers.filter((f) => f.issue).length, silent = farmers.filter((f) => f.silent).length;
    const health = gap > .12 || forecastT < c.qtyT * .9 ? "Behind" : gap > .05 || issues >= 3 ? "Watch" : "On track";
    const stages = stagesFor(c.produce).map(([name, f]) => ({ name, frac: f, date: iso(start + f * span) }));
    return {
      id: c.id, exporter: c.exporter, produce: c.produce, qtyT: c.qtyT, country: c.country, start: iso(start), deliverBy: c.deliverBy,
      daysToDelivery: Math.round((end - today) / DAY), expected, reported, health, issues, silent,
      reporting: farmers.filter((f) => f.daysSince != null && f.daysSince <= 14).length, forecastT: Math.round(forecastT * 10) / 10,
      plannedT: c.allocation!.plannedT, stages, expectedStage: stageAt(c.produce, expected).name, reportedStage: stageAt(c.produce, reported).name,
      farmers, feed: reports.slice(-60).reverse().map((r) => ({ ...r, name: farmers.find((f) => f.farmerId === r.farmerId)?.name ?? "Farmer" })),
      sample: reports.some((r) => r.sample),
    };
  });
  return { today: iso(today), projects, unallocated: contracts.filter((c) => !c.allocation?.lot.length).map((c) => ({ id: c.id, produce: c.produce, qtyT: c.qtyT, exporter: c.exporter })) };
}

/** Record a progress report from a farmer (WhatsApp bot or field officer). */
export function addReport(input: { contractId: string; farmerId: number; frac?: number; stage?: string; note: string; issue?: Report["issue"] }) {
  const run = queue.then(async () => {
    const { contracts } = await listContracts();
    const c = contracts.find((x) => x.id === input.contractId);
    if (!c) return { error: `No contract ${input.contractId}`, code: 404 };
    if (!c.allocation?.lot.some((l) => l.farmerId === input.farmerId)) return { error: `Farmer ${input.farmerId} is not on ${c.id}`, code: 400 };
    const stages = stagesFor(c.produce);
    const byName = input.stage ? stages.find(([n]) => n.toLowerCase() === input.stage!.toLowerCase()) : null;
    const frac = clamp(input.frac ?? byName?.[1] ?? 0);
    const date = new Date().toISOString().slice(0, 10);
    const r: Report = { id: `${c.id}-${input.farmerId}-${Date.now()}`, contractId: c.id, farmerId: input.farmerId, date, frac, stage: byName?.[0] ?? stageAt(c.produce, frac).name, note: input.note, issue: input.issue ?? null };
    const all = { ...(await readAll()) };
    all[c.id] = [...(all[c.id] ?? []), r];
    await writeAll(all);
    return { report: r };
  });
  queue = run.catch(() => undefined);
  return run;
}
