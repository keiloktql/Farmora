// Contracts (deals with exporters) and the farmer allocation saved against each one.

import type { Preferences } from "@/lib/recommender/preferences";

export type ContractStatus = "Draft" | "Matching farmers" | "Allocated" | "Growing" | "Harvest" | "Shipped";

export interface AllocationLine {
  farmerId: number;
  name: string;
  state: string;
  district?: string | null;
  tonnes: number;
  acres: number;
  /** climate risk 0-100 at allocation time; null when climate history was missing */
  riskScore: number | null;
}

export interface Allocation {
  extraPlanted: number;
  plannedT: number;
  feasible: boolean;
  shortByT: number;
  regions: number;
  landAcres: number;
  chance: number | null;
  chanceNote: string;
  avgShortfallWhenShortT: number | null;
  lot: AllocationLine[];
  allocatedAt: string;
}

/** The FPO manager's farmer preferences saved with a contract (same shape the recommender chat produces). */
export type ContractConstraints = Preferences;

export interface Contract {
  id: string;
  exporter: string;
  produce: string;
  qtyT: number;
  country: string;
  /** agreed price paid for the produce, ₹ per kg */
  pricePerKg: number | null;
  sowBy?: string | null;
  /** ISO date */
  deliverBy: string;
  status: ContractStatus;
  /** 0-100 season progress, for display */
  progress: number;
  stageNote?: string;
  constraints?: ContractConstraints;
  allocation?: Allocation | null;
  source: "seed" | "orderbook" | "manual";
  createdAt: string;
}

export type NewContract = Omit<Contract, "id" | "status" | "progress" | "allocation" | "createdAt" | "source"> & {
  status?: ContractStatus;
  source?: Contract["source"];
};

export interface DealRisk {
  level: "Low" | "Medium" | "High" | "Provisional" | "Unassessed";
  /** 0-100, higher = riskier; null when it cannot be computed yet */
  score: number | null;
  reasons: string[];
}
