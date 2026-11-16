// Short, plain summaries of what an export lot has to satisfy for each destination.
// These are orientation notes for the FPO, not legal advice: confirm exact requirements with the exporter.

export interface Standards {
  authority: string;
  rules: string[];
}

const COMMON_INDIA = "__INDIA_CERT__";
const PLANT_CERT = "Phytosanitary certificate from India's Plant Quarantine (PPQS)";
const ANIMAL_CERT = "Veterinary health certificate from India's animal quarantine service";
const ANIMAL = ["broiler", "poultry", "chicken", "eggs", "mutton", "goat meat", "meat", "fish"];

const BY_COUNTRY: Record<string, Standards> = {
  Singapore: {
    authority: "Singapore Food Agency (SFA)",
    rules: [
      "Pesticide residues within SFA maximum residue limits; consignments can be sampled and tested",
      "Buyer holds the SFA import licence and permit for each consignment",
      "Traceable lot ID with farm-level spray records",
      COMMON_INDIA,
    ],
  },
  UAE: {
    authority: "UAE Ministry of Climate Change and Environment and municipal food control",
    rules: ["Residue and labelling checks at the port of entry", "Halal certification for poultry and meat", COMMON_INDIA],
  },
  Maldives: {
    authority: "Maldives Food and Drug Authority (MFDA)",
    rules: ["Import permit held by the buyer", "Shelf-life and labelling checks on arrival", COMMON_INDIA],
  },
  "Sri Lanka": {
    authority: "National Plant Quarantine Service (NPQS)",
    rules: ["Import permit issued before shipment", "Inspection on arrival for pests and residues", COMMON_INDIA],
  },
  Malaysia: {
    authority: "Malaysian Quarantine and Inspection Services (MAQIS)",
    rules: ["Import permit and inspection at entry", "Halal certification for poultry and meat", COMMON_INDIA],
  },
};

export const COUNTRIES = Object.keys(BY_COUNTRY);

/** Rules for this destination, keeping only the ones that apply to plant or animal produce. */
export function standardsFor(country: string, produce = ""): Standards {
  const base = BY_COUNTRY[country] ?? {
    authority: `${country} food-safety and plant-quarantine authorities`,
    rules: ["Confirm residue limits, permits and labelling with the exporter", COMMON_INDIA],
  };
  const animal = ANIMAL.includes(produce.trim().toLowerCase());
  const rules = base.rules
    .filter((r) => animal || !/halal|poultry and meat/i.test(r))
    .filter((r) => !animal || !/pesticide residues|spray records/i.test(r))
    .map((r) => (r === COMMON_INDIA ? (animal ? ANIMAL_CERT : PLANT_CERT) : r));
  return { authority: base.authority, rules };
}
