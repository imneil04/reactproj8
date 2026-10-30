//creating type for attire
export type AttireType = 

  |"light-clothing"
  | "layers"
  | "warm-coat"
  | "umbrella"
  | "comfy-shoes"
  | "sun-protection"
  | "light-jacket"
  | "t-shirts"
  | "shorts"
  | "sweater" 
  | "scarf-gloves";

export type Season = "spring" | "summer" | "fall" | "winter";

export const SEASONS: {id: Season; label: string; range: string; months: number[] }[] = [
  { id: "spring", label: "Spring", range: "Jan–Apr", months: [0, 1, 2, 3] },
  { id: "summer", label: "Summer", range: "May–Aug", months: [4, 5, 6, 7] },
  { id: "fall", label: "Fall", range: "Sep–Oct", months: [8, 9] },
  { id: "winter", label: "Winter", range: "Nov–Dec", months: [10, 11] },
];

//month is o-indexed (0 = Jan), match Date.getMonth()
export function getSeasonForMonth(month: number): Season {
  return SEASONS.find((s) => s.months.includes(month))?.id ?? "spring";
}

//interface
export interface PlaceInsights {

  bestMonths: string;
  popularFood: string[];
  busiestTime: string;
  //attire: AttireType[];
  attire: Record<Season, AttireType[]>;

}

const MOCK_INSIGHTS: Record<string, PlaceInsights> = {
  tokyo: {
    bestMonths: "March–May, October–November",
    popularFood: ["Sushi", "Ramen", "Takoyaki"],
    busiestTime: "Cherry blossom season (late March–early April)",
    //attire: ["layers", "comfy-shoes", "umbrella"],
      attire: {
      spring: ["light-jacket", "t-shirts", "comfy-shoes", "umbrella"],
      summer: ["shorts", "t-shirts", "sun-protection", "umbrella"],
      fall: ["layers", "light-jacket", "comfy-shoes"],
      winter: ["warm-coat", "sweater", "scarf-gloves"],
    },
  },
  osaka: {
    bestMonths: "March–May, October–November",
    popularFood: ["Takoyaki", "Okonomiyaki", "Kushikatsu"],
    busiestTime: "Cherry blossom season (late March–early April)",
      attire: {
      spring: ["light-jacket", "t-shirts", "comfy-shoes"],
      summer: ["shorts", "t-shirts", "sun-protection", "umbrella"],
      fall: ["layers", "light-jacket", "comfy-shoes"],
      winter: ["warm-coat", "sweater", "scarf-gloves"],
    },
  },
  kyoto: {
  bestMonths: "March–May, October–November",
  popularFood: ["Kaiseki", "Matcha sweets", "Yudofu"],
  busiestTime: "Autumn foliage season (mid-November)",
      attire: {
      spring: ["light-jacket", "t-shirts", "comfy-shoes"],
      summer: ["light-clothing", "shorts", "sun-protection", "umbrella"],
      fall: ["layers", "light-jacket", "comfy-shoes"],
      winter: ["warm-coat", "sweater", "scarf-gloves"],
    },
  },
  paris: {
    bestMonths: "April–June, September–October",
    popularFood: ["Croissants", "Escargot", "Crème brûlée"],
    busiestTime: "Summer (July–August)",
    attire: {
      spring: ["light-jacket", "umbrella", "comfy-shoes"],
      summer: ["t-shirts", "shorts", "sun-protection", "comfy-shoes"],
      fall: ["layers", "umbrella", "comfy-shoes"],
      winter: ["warm-coat", "sweater", "scarf-gloves"],
    },
  },
  "new york": {
    bestMonths: "April–June, September–November",
    popularFood: ["Bagels", "Pizza", "Cheesecake"],
    busiestTime: "Holiday season (late November–December)",
    attire: {
      spring: ["light-jacket", "comfy-shoes", "umbrella"],
      summer: ["t-shirts", "shorts", "sun-protection", "comfy-shoes"],
      fall: ["layers", "light-jacket", "comfy-shoes"],
      winter: ["warm-coat", "sweater", "scarf-gloves"],
    },
  },
};

export function getInsightsFor(place: string): PlaceInsights | null {
  return MOCK_INSIGHTS[place.toLowerCase()] ?? null;
}