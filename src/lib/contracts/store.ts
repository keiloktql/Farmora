// Contracts are persisted as rows in InsForge so writes survive serverless deployments.

import "server-only";
import { createAdminClient } from "@insforge/sdk";
import { randomUUID } from "node:crypto";
import { connection } from "next/server";
import seed from "@/data/contracts/seed.json";
import { loadRecommenderData } from "@/lib/recommender/data";
import { recommend } from "@/lib/recommender/model";
import { daysUntil, dealRisk } from "./risk";
import { standardsFor } from "./standards";
import type { Allocation, Contract, ContractStatus, NewContract } from "./types";

let queue: Promise<unknown> = Promise.resolve();
const RECORDS_TABLE = "farmora_contract_records";

function database() {
  const baseUrl = process.env.INSFORGE_URL;
  const apiKey = process.env.INSFORGE_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("Contract storage is not configured. Set INSFORGE_URL and INSFORGE_API_KEY.");
  }
  return createAdminClient({ baseUrl, apiKey }).database;
}

/** Serialise writes so two requests can't overwrite each other's changes. */
function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function persist(list: Contract[]) {
  if (!list.length) return;
  const { error } = await database().from(RECORDS_TABLE).upsert(
    list.map((contract) => ({ id: contract.id, payload: contract, updated_at: new Date().toISOString() })),
    { onConflict: "id" },
  );
  if (error) throw error;
}

function newId(): string {
  return `CT-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/** Acres each farmer has already given to contracts other than `exceptId`. */
export function reservedAcres(list: Contract[], exceptId?: string): Record<number, number> {
  const out: Record<number, number> = {};
  for (const c of list) {
    if (c.id === exceptId || !c.allocation) continue;
    for (const l of c.allocation.lot) out[l.farmerId] = (out[l.farmerId] ?? 0) + l.acres;
  }
  return out;
}

/** Run the recommender for one contract, respecting land already committed elsewhere. */
export function runRecommender(c: Contract, list: Contract[], extraPlanted = 0) {
  const data = loadRecommenderData();
  const res = recommend({ crop: c.produce, qtyT: c.qtyT, constraints: c.constraints }, data, reservedAcres(list, c.id));
  const opt = res.options.find((o) => o.extraPlanted === extraPlanted) ?? res.options[0];
  const byId = new Map(res.shortlist.map((f) => [f.id, f]));
  const allocation: Allocation = {
    extraPlanted: opt.extraPlanted, plannedT: opt.plannedT, feasible: opt.feasible, shortByT: opt.shortByT, regions: opt.regions,
    landAcres: opt.landAcres, chance: opt.chance, chanceNote: opt.chanceNote, avgShortfallWhenShortT: opt.avgShortfallWhenShortT,
    allocatedAt: new Date().toISOString(),
    lot: opt.lot.map((l) => {
      const f = byId.get(l.id)!;
      return { farmerId: l.id, name: f.name, state: f.state, district: f.district ?? null, tonnes: l.tonnes, acres: l.acres, riskScore: f.riskScore };
    }),
  };
  return { response: res, allocation };
}

async function load(): Promise<Contract[]> {
  await connection();
  const db = database();
  const { data, error } = await db
    .from(RECORDS_TABLE)
    .select("payload")
    .order("id", { ascending: true })
    .limit(2000);
  if (error) throw error;

  const stored = (data ?? []).map((row) => row.payload as Contract);
  if (stored.length) return stored;

  // First run: seed the deals the app already showed, then allocate farmers to
  // those already under way (earliest delivery first, so land accounting is consistent).
  const now = new Date().toISOString();
  const list: Contract[] = (seed as (NewContract & { status: ContractStatus; progress: number; stageNote?: string })[])
    .map((s, i) => ({ ...s, id: `CT-${1001 + i}`, allocation: null, source: "seed" as const, createdAt: now }));
  for (const c of [...list].sort((a, b) => a.deliverBy.localeCompare(b.deliverBy))) {
    if (c.status !== "Matching farmers" && c.status !== "Draft") c.allocation = runRecommender(c, list).allocation;
  }
  await persist(list);
  return list;
}

export function withDetails(c: Contract) {
  const value = c.pricePerKg != null ? Math.round(c.pricePerKg * c.qtyT * 1000) : null;
  return { ...c, valueINR: value, daysToDelivery: daysUntil(c.deliverBy), risk: dealRisk(c), standards: standardsFor(c.country, c.produce) };
}

export async function listContracts(exporter?: string | null) {
  const list = await load();
  const exporters = Array.from(new Set(list.map((c) => c.exporter))).map((name) => {
    const mine = list.filter((c) => c.exporter === name);
    return { name, count: mine.length, valueINR: mine.reduce((s, c) => s + (c.pricePerKg ?? 0) * c.qtyT * 1000, 0) };
  }).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const shown = (exporter ? list.filter((c) => c.exporter === exporter) : list)
    .slice().sort((a, b) => a.deliverBy.localeCompare(b.deliverBy)).map(withDetails);
  return { contracts: shown, exporters, total: list.length };
}

/** Land other contracts already hold, for previewing a contract's allocation in the recommender. */
export async function reservedAcresFor(id: string) {
  return reservedAcres(await load(), id);
}

export async function getContract(id: string) {
  const c = (await load()).find((x) => x.id === id);
  return c ? withDetails(c) : null;
}

export function createContracts(inputs: NewContract[]) {
  return exclusive(async () => {
    const list = [...(await load())];
    const created: Contract[] = [];
    for (const input of inputs) {
      const c: Contract = {
        exporter: input.exporter, produce: input.produce, qtyT: input.qtyT, country: input.country, pricePerKg: input.pricePerKg ?? null,
        sowBy: input.sowBy ?? null, deliverBy: input.deliverBy, constraints: input.constraints, stageNote: input.stageNote ?? "Ready for farmer matching",
        id: newId(), status: input.status ?? "Draft", progress: 5, allocation: null, source: input.source ?? "manual", createdAt: new Date().toISOString(),
      };
      list.push(c);
      created.push(c);
    }
    await persist(list);
    return created.map(withDetails);
  });
}

export function allocateContract(id: string, extraPlanted: number, constraints?: Contract["constraints"]) {
  return exclusive(async () => {
    const list = [...(await load())];
    const i = list.findIndex((c) => c.id === id);
    if (i < 0) return null;
    if (constraints) list[i] = { ...list[i], constraints };
    const { allocation } = runRecommender(list[i], list, extraPlanted);
    list[i] = {
      ...list[i], allocation,
      status: list[i].status === "Draft" || list[i].status === "Matching farmers" ? "Allocated" : list[i].status,
      stageNote: list[i].status === "Draft" || list[i].status === "Matching farmers" ? "Farmers allocated · awaiting their replies" : list[i].stageNote,
    };
    await persist(list);
    return withDetails(list[i]);
  });
}
