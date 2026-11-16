// Crop calendars: typical days from sowing (or flowering / chick placement) to delivery, and the stages a
// farmer reports along the way, each starting at a share of that window.

export const CYCLE_DAYS: Record<string, number> = { Tomato: 120, Chilli: 150, Groundnut: 115, Rice: 130, Mango: 150, Banana: 300, Broiler: 45 };

const FIELD: [string, number][] = [["Land prep & nursery", 0], ["Transplanted", .12], ["Vegetative", .25], ["Flowering", .45], ["Fruit set", .6], ["Harvesting", .8], ["Packed & ready", .95]];
export const STAGES: Record<string, [string, number][]> = {
  Tomato: FIELD, Chilli: FIELD,
  Groundnut: [["Sown", 0], ["Germinated", .1], ["Vegetative", .2], ["Pegging & flowering", .4], ["Pod filling", .6], ["Harvesting", .85], ["Dried & ready", .95]],
  Rice: [["Nursery", 0], ["Transplanted", .15], ["Tillering", .3], ["Flowering", .5], ["Grain filling", .65], ["Harvesting", .85], ["Milled & bagged", .95]],
  Mango: [["Flowering", 0], ["Fruit set", .2], ["Fruit growing", .4], ["Maturing", .7], ["Harvesting", .85], ["Graded & packed", .95]],
  Banana: [["Planted", 0], ["Vegetative", .15], ["Shooting", .55], ["Bunch filling", .7], ["Harvesting", .88], ["Packed", .96]],
  Broiler: [["Chicks placed", 0], ["Brooding", .1], ["Growing", .35], ["Finishing", .7], ["Catching", .9], ["Processed", .96]],
};

export const stagesFor = (crop: string) => STAGES[crop] ?? FIELD;
export const stageAt = (crop: string, frac: number) => {
  const s = stagesFor(crop);
  let i = 0;
  for (let k = 0; k < s.length; k++) if (frac >= s[k][1]) i = k;
  return { index: i, name: s[i][0] };
};

export const ISSUES: Record<string, string[]> = {
  Tomato: ["Whitefly on lower leaves", "Leaf curl in a few rows", "Fruit borer seen"],
  Chilli: ["Thrips on new leaves", "Leaf curl spreading", "Fruit rot after rain"],
  Groundnut: ["Leaf spot", "Dry spell, soil cracking", "Red hairy caterpillar"],
  Rice: ["Stem borer", "Brown plant hopper", "Water stagnation after rain"],
  Mango: ["Hoppers during flowering", "Unseasonal rain dropped flowers", "Fruit fly"],
  Banana: ["Sigatoka leaf spot", "Wind damage to a few plants", "Bunchy top suspected"],
  Broiler: ["Heat stress, feed intake down", "A few birds coughing", "Feed delivery late"],
};
