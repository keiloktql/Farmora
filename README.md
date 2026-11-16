# HarvestLink

An FPO workspace for landing deals with exporters, finding the right farmers for them, and following the produce from field to buyer. The UI is a 3D "living diorama": CSS-3D scenes (an extruded map of India, avatars, farms, a shipping corridor) with glass panels on top.

## Pages

| Route | Page |
| --- | --- |
| `/` | **Overview**: active deals, upcoming deliveries, revenue dashboard, and a 3D India map with per-state weather (hover for the animation), season stage and predicted weather risks |
| `/contracts` | **Contracts · contractor profile**: category tabs (vegetables, grains, fruits, poultry/meat), new-project form, ongoing contracts, live trade desk with avatars that shake hands |
| `/contracts/farmers` | **Contracts · farmers profile**: ongoing farmer contracts, recommended farmers on the India map, WhatsApp updates from farmers |
| `/farmers` | **Farmer database**: personalised 3D avatar profile per farmer with trust score, delivery record, revenue by crop and badges |
| `/new-project` | **New project**: deal specs plus a chat to describe the farmers you need |
| `/recommendations` | **Recommended farmers**: ranks farmers from the prompt, picks the best lot, and pins each farmer on the India map with their profile |
| `/allocation` | **Crop allocation**: pick a crop and paint the suited states on the 3D India map |
| `/buyers` | **Buyers & exporters**: live avatars negotiating and finalising deals |
| `/results` | **Harvest & sale results**: replayable 3D farm harvest simulation |
| `/shipments` | **Shipment tracking**: Chittoor → Chennai → Singapore route on a 3D map |

`/new-project` hands its prompt to `/recommendations` through `localStorage` (key `hl_prompt`); if storage is unavailable the recommendations page falls back to a default mango prompt.

## Data

All data is illustrative sample data defined in each page component: farmers, exporters, weather, risk predictions, crop suitability, yields and distances. The recommendation scoring (crop fit 40%, distance 25%, land 20%, trust 15%) and the prompt parser are stand-ins for the backend recommendation model and the weather and risk services. State borders are approximate.

## How the pages are built

Each page lives in `src/components/pages/` and is a client component with a `Logic` class (state, handlers, a `renderVals()` method) plus the markup. `src/lib/dc.tsx` provides the small runtime (`DC`, `DCLogic`, `css`) and scales the fixed 1440×900 canvas to the browser window. Routes in `src/app/**/page.tsx` just render these components.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
