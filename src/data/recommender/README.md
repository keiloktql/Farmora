# Recommender data

Rebuild `farmers.json` and `climate.json` with `uv run --with pandas --with numpy --with requests python tools/sample-data/build_sample_data.py`.

The farmer recommender (`src/lib/recommender/`, served at `POST /api/recommend`) reads these files.
Fill them in to switch the model on. Shapes are defined in `src/lib/recommender/types.ts`.

| File | Status | What goes in |
|---|---|---|
| `farmers.json` | **275 sample farmers** (synthetic people) in 55 real districts across 12 states, all onboarding fields filled | One record per farmer. Add `district`, `irrigation`, `irrigationReliable`, `practices`, `waterlogging` and `freeAcres` from onboarding. |
| `crops.json` | Yield and grade values the page already used (illustrative) | Per crop: `yieldTPerAcre` and `gradeShare` (share meeting the buyer's grade). |
| `climate.json` | **Real data, 2005–2021**: yield records where they exist, otherwise a weather-stress score from real NASA POWER weather | Per crop, per place, past seasons' yield anomaly (below). |
| `calibration.json` | From the backtest | Maps the raw simulated delivery chance to how often contracts were really met. Refit when real deliveries exist. |

## climate.json

```json
{
  "crops": {
    "Mango": {
      "AP|Chittoor": [{ "season": 2021, "anomaly": -0.18 }, { "season": 2020, "anomaly": 0.06 }],
      "AP": [{ "season": 2021, "anomaly": -0.11 }]
    }
  }
}
```

- `anomaly` = that season's yield ÷ the normal yield before it, minus 1 (−0.18 = 18% below normal). The backtest computed
  "normal" as the median of the previous 5 seasons from the APY district statistics.
- Place keys are `"STATE|District"`; a `"STATE"` series is used when the farmer has no district or the district has no series.
- At least 8 seasons are needed; the latest 15 are used. Places with the same seasons are compared season by season, which is
  how the model sees which areas have bad years together.

## What the model does with them

- **Risk score (0–100, higher = riskier):** how far this farm would have fallen below normal in the worst 20% of the last
  15 seasons at its location, scaled by irrigation, practices and waterlogging. Trust is never part of it; it is a display and filter only.
- **Lot:** lowest risk first (unknown risk sits in the middle), with no farmer above 8% and no district (or state) above
  25% of the plan.
- **Plan options:** plant exactly the contract, or 10% extra; management chooses.
- **Delivery chance:** past seasons replayed for the whole lot with farm-level luck and a 92% delivery prior, then
  calibrated. It stays empty until every farmer in the lot has climate history.
