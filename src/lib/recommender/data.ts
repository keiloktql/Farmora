// Loads the recommender's data. Today it reads the JSON files in src/data/recommender/; swap these
// imports for a database query later without touching the model or the API route.

import calibration from "@/data/recommender/calibration.json";
import climate from "@/data/recommender/climate.json";
import crops from "@/data/recommender/crops.json";
import farmers from "@/data/recommender/farmers.json";
import type { CalibrationData, ClimateData, CropProfile, FarmerRecord } from "./types";

export function loadRecommenderData() {
  return {
    farmers: farmers as FarmerRecord[],
    crops: crops as CropProfile[],
    climate: climate as ClimateData,
    calibration: calibration as unknown as CalibrationData,
  };
}
