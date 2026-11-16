# Farmora

An FPO workspace for landing deals with exporters, finding the right farmers for them, and following the produce from field to buyer. The UI is a 3D "living diorama": CSS-3D scenes (an extruded map of India, avatars, farms, a shipping corridor) with glass panels on top.

## Pages

| Route | Page |
| --- | --- |
| `/` | **Overview**: live deals, deliveries, pipeline value and value at risk; 3D India map with per-state weather (weather is sample data) |
| `/contracts` | **Contracts**: every deal with exporters, standards, allocated farmers and deal risk; **New project** starts here |
| `/new-project` | **New project**: paste an order book, review contracts, allocate farmers |
| `/recommendations` | **Farmer picking**: climate-risk recommender with a chat to change preferences; saves allocations to a contract |
| `/farmers` | **Farmer DB**: 275 sample farmers as game-style character sheets with real climate history |
| `/buyers` | **Buyers · Farmora Pro**: exporter network by crop pack; locked exporters stay anonymous; start a deal → contract |
| `/whatsapp` | **WhatsApp**: the farmer's side, two product reels (onboarding; an export order from offer to payment) with chapters. Videos in `public/whatsapp/` |
| `/progress` | **Progress**: each project against its season timeline, from farmers' progress reports (sample until WhatsApp is connected) |

## Data

- Farmers (`src/data/recommender/farmers.json`) are synthetic; climate history (`climate.json`) is real: Government APY yield records and NASA POWER weather. Rebuild with `tools/sample-data/build_sample_data.py`.
- Contracts, buy-side decisions and progress reports are stored in `.data/` (git-ignored), seeded from `src/data/`.
- Exporters (`src/data/buyers/exporters.json`) and the Pro plan (`plan.json`) are fictional sample data.
- Farmer progress reports are seeded samples; real ones go to `POST /api/progress/reports`.

## How the pages are built

Each page lives in `src/components/pages/` and is a client component with a `Logic` class (state, handlers, a `renderVals()` method) plus the markup. `src/lib/dc.tsx` provides the small runtime (`DC`, `DCLogic`, `css`) and scales the fixed 1440×900 canvas to the browser window. Routes in `src/app/**/page.tsx` just render these components.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
