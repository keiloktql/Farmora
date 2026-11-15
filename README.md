# HarvestLink Crop Planning

An FPO crop-planning prototype based on the pilot PRD: one FPO, one crop, one growing season. It helps an FPO turn buyer demand into a transparent acreage plan, invite members to participate voluntarily, share crop-calendar guidance, monitor expected supply, and record harvest and sale outcomes.

## Pilot workflow

- `/` — FPO overview: confirmed order vs forecast demand, member commitment, projected supply, and workflow status.
- `/demand` — Edit buyer, crop, volume, quality requirements, delivery window, and source. Confirmed demand stays separate from forecast demand.
- `/plan` — Review and change grower allocations. Required acreage is calculated from demand volume, expected yield, and an adjustable uncertainty buffer.
- `/farmers` — See farmer responses and a WhatsApp recommendation preview with accept, decline, and call-back choices. No message is sent.
- `/guidance` — Draft a small crop-calendar message set with language selection and a visible agronomy-review requirement.
- `/results` — Record actual harvest, accepted grade, realized price, downgrade reason, and buyer feedback.

The FPO can import a CSV member sheet on the overview page; the prototype stores the imported rows locally. The old `/marketplace`, `/network`, `/forecasts`, and `/shipments` URLs redirect to their closest crop-planning sections. Marketplace discovery, trading, logistics dispatch, and automated agronomy are outside this pilot.

## Prototype notes

All records are illustrative. Changes are saved in browser local storage for demo continuity; they are not synced to a backend or sent through WhatsApp. The allocation estimate makes its yield and uncertainty assumptions visible and does not promise a sale, yield, price, or farmer income. Crop-care messages require local agronomy review before real use.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Next.js Cache Components are enabled; the shared workspace uses the `hours` cache profile.
