// Turns a pasted order book (CSV, tab-separated from a spreadsheet, or one deal per line) into contracts.

import type { NewContract } from "./types";

export interface ParsedRow {
  line: number;
  raw: string;
  contract: NewContract | null;
  errors: string[];
  warnings: string[];
}

const ALIASES: Record<string, string[]> = {
  exporter: ["exporter", "buyer", "company", "customer", "importer"],
  produce: ["produce", "crop", "product", "commodity", "item"],
  qty: ["qty", "quantity", "tonnes", "tons", "volume", "t"],
  country: ["country", "destination", "market", "dest"],
  price: ["price", "rate", "₹/kg", "price/kg", "price per kg", "rs/kg", "inr/kg"],
  deliverBy: ["deliver by", "deliver_by", "deadline", "due", "delivery", "delivery date", "ship by"],
  sowBy: ["sow by", "sow_by", "sowing", "plant by"],
};
const POSITIONAL = ["exporter", "produce", "qty", "country", "price", "deliverBy", "sowBy"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function splitLine(line: string, delim: string): string[] {
  if (delim !== ",") return line.split(delim).map((c) => c.trim());
  const out: string[] = [];
  let cur = "", quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function parseQty(v: string): number | null {
  const m = v.toLowerCase().replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(kg|t|tonnes?|tons?|mt|q|quintals?)?/);
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2] ?? "t";
  if (unit === "kg") return n / 1000;
  if (unit.startsWith("q")) return n / 10;
  return n;
}

function parsePrice(v: string): number | null {
  const m = v.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const n = Number(m[1]);
  return /quintal|\/q\b/i.test(v) ? n / 100 : /\/t\b|tonne/i.test(v) ? n / 1000 : n;
}

export function parseDate(v: string): string | null {
  const s = v.trim().toLowerCase();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return iso(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);           // DD/MM/YYYY (Indian order)
  if (m) return iso(+m[3], +m[2], +m[1]);
  m = s.match(/^(\d{1,2})\s+([a-z]{3})[a-z]*\.?\s+(\d{4})$/);       // 20 Mar 2027
  if (m && MONTHS.includes(m[2])) return iso(+m[3], MONTHS.indexOf(m[2]) + 1, +m[1]);
  m = s.match(/^([a-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(\d{4})$/);     // Mar 20, 2027
  if (m && MONTHS.includes(m[1])) return iso(+m[3], MONTHS.indexOf(m[1]) + 1, +m[2]);
  return null;
}

function iso(y: number, mo: number, d: number): string | null {
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const title = (s: string) => s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function parseOrderBook(text: string, knownCrops: string[], knownCountries: string[]): ParsedRow[] {
  const lines = text.split(/\r?\n/).map((l, i) => ({ l: l.trim(), i: i + 1 })).filter((x) => x.l && !x.l.startsWith("#"));
  if (!lines.length) return [];
  const sample = lines[0].l;
  const delim = sample.includes("\t") ? "\t" : sample.includes(";") ? ";" : sample.includes("|") ? "|" : ",";

  // Header row? Map its columns by name; otherwise assume the positional order.
  const first = splitLine(sample, delim).map((c) => c.toLowerCase());
  const headerCols = first.map((c) => Object.keys(ALIASES).find((k) => ALIASES[k].includes(c)) ?? null);
  const hasHeader = headerCols.filter(Boolean).length >= 2;
  const cols = hasHeader ? headerCols : POSITIONAL;
  const body = hasHeader ? lines.slice(1) : lines;

  return body.map(({ l, i }) => {
    const cells = splitLine(l, delim);
    const get = (k: string) => { const idx = cols.indexOf(k); return idx >= 0 ? cells[idx] ?? "" : ""; };
    const errors: string[] = [], warnings: string[] = [];

    const exporter = get("exporter").trim();
    if (!exporter) errors.push("Missing exporter");
    const produceRaw = get("produce");
    const produce = knownCrops.find((c) => c.toLowerCase() === produceRaw.trim().toLowerCase()) ?? title(produceRaw);
    if (!produce) errors.push("Missing produce");
    else if (!knownCrops.some((c) => c.toLowerCase() === produce.toLowerCase())) warnings.push(`No crop profile for ${produce}: the recommender can't size land yet`);
    const qtyT = parseQty(get("qty"));
    if (qtyT == null || qtyT <= 0) errors.push("Quantity not understood (e.g. 18 t)");
    const countryRaw = title(get("country"));
    const country = knownCountries.find((c) => c.toLowerCase() === countryRaw.toLowerCase()) ?? countryRaw;
    if (!country) errors.push("Missing destination country");
    else if (!knownCountries.includes(country)) warnings.push(`No standards summary for ${country} yet`);
    const priceRaw = get("price");
    const pricePerKg = priceRaw ? parsePrice(priceRaw) : null;
    if (priceRaw && pricePerKg == null) warnings.push("Price not understood (e.g. ₹24/kg)");
    if (!priceRaw) warnings.push("No price given");
    const deliverBy = parseDate(get("deliverBy"));
    if (!deliverBy) errors.push("Delivery date not understood (e.g. 2027-03-20 or 20 Mar 2027)");
    const sowRaw = get("sowBy");
    const sowBy = sowRaw ? parseDate(sowRaw) : null;
    if (sowRaw && !sowBy) warnings.push("Sow-by date not understood");

    const contract: NewContract | null = errors.length ? null : {
      exporter, produce, qtyT: qtyT!, country, pricePerKg, deliverBy: deliverBy!, sowBy, source: "orderbook",
    };
    return { line: i, raw: l, contract, errors, warnings };
  });
}

export const EXAMPLE_ORDER_BOOK = [
  "exporter,produce,quantity,country,price,deliver by,sow by",
  "LionCity Fresh Imports,Mango,30 t,Singapore,₹78/kg,2027-05-20,",
  "Gulf Fruit Link,Banana,25 t,UAE,₹32/kg,15 Apr 2027,2026-12-01",
  "Island Foods,Rice,40 t,Maldives,₹36/kg,2027-02-28,",
  "Spice Route Exporters,Chilli,6 t,Sri Lanka,₹98/kg,10/04/2027,",
].join("\n");
