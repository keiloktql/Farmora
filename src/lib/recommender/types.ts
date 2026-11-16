// Data contract for the farmer recommender. The JSON files in src/data/recommender/ follow these shapes.

import type { Preferences } from "./preferences";

export type Irrigation = "rainfed" | "canal" | "borewell" | "borewell_drip";

/** One farmer, as collected at onboarding. Optional fields can be filled in later; the model flags what is missing. */
export interface FarmerRecord {
  id: number;
  name: string;
  /** state code, e.g. "AP" */
  state: string;
  /** district name; climate history is looked up by "STATE|District", then by "STATE" */
  district?: string | null;
  village?: string | null;
  lat?: number | null;
  lon?: number | null;
  kmFromFpo: number;
  totalAcres: number;
  /** land the farmer can give to a new order; if unknown the model assumes 40% of total (flagged) */
  freeAcres?: number | null;
  crops: string[];
  irrigation?: Irrigation | null;
  /** water lasts through the dry months (ignored for rain-fed) */
  irrigationReliable?: boolean | null;
  practices?: string[];
  waterlogging?: "never" | "sometimes" | "often" | null;
  /** display and filter only: never part of the score */
  trust?: number | null;
  onTimePct?: number | null;
  pastContracts?: number | null;
}

export interface CropProfile {
  name: string;
  /** typical harvest, tonnes per acre */
  yieldTPerAcre: number;
  /** share of the harvest that meets the buyer's grade */
  gradeShare: number;
}

/** Yield anomaly for one past season in one place: yield / normal yield - 1 (e.g. -0.25 = 25% below normal). */
export interface SeasonAnomaly {
  season: number;
  anomaly: number;
}

export interface ClimateData {
  /** crop name -> place key ("AP|Chittoor" or "AP") -> past seasons */
  crops: Record<string, Record<string, SeasonAnomaly[]>>;
  /** crop -> place -> where the series comes from: real yield records, or a weather-stress score from real weather */
  sources?: Record<string, Record<string, "yield" | "weather">>;
  notes?: Record<string, string>;
}

export interface CalibrationData {
  source: string;
  /** extra planted ("0.00", "0.10") -> isotonic points [raw chance, observed share met] */
  tables: Record<string, [number, number][]>;
}

export interface DealRequest {
  crop: string;
  qtyT: number;
  /** filters, ranking and spread rules from the FPO manager (see preferences.ts) */
  constraints?: Preferences;
}

export interface ScoredFarmer extends FarmerRecord {
  /** 0-100, higher = riskier; null when climate history is missing */
  riskScore: number | null;
  /** how strongly this farm feels a bad season (1 = like the district average) */
  sensitivity: number;
  /** planned tonnes this farmer could supply from their free land */
  capacityT: number;
  freeAcresUsed: number;
  flags: string[];
  reasons: string[];
}

export interface LotLine {
  id: number;
  tonnes: number;
  acres: number;
}

export interface PlanOption {
  extraPlanted: number;
  plannedT: number;
  feasible: boolean;
  shortByT: number;
  lot: LotLine[];
  landAcres: number;
  farmers: number;
  regions: number;
  /** calibrated chance of delivering the full contract; null when climate history is missing */
  chance: number | null;
  rawChance: number | null;
  avgShortfallWhenShortT: number | null;
  expectedSurplusT: number | null;
  chanceNote: string;
}

export interface RecommendResponse {
  crop: string;
  qtyT: number;
  dataStatus: {
    farmers: number;
    cropProfile: boolean;
    climatePlaces: number;
    notes: string[];
  };
  shortlist: ScoredFarmer[];
  options: PlanOption[];
}
