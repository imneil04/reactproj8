//creating type for attire
export type AttireType = 

  |"light-clothing"
  | "layers"
  | "warm-coat"
  | "umbrella"
  | "comfy-shoes"
  | "sun-protection";

export interface PlaceInsights {

  bestMonths: string;
  popularFood: string[];
  busiestTime: string;
  attire: AttireType[];

}

const MOCK_INSIGHTS: Record<string, PlaceInsights> = {
  tokyo: {
    bestMonths: "March–May, October–November",
    popularFood: ["Sushi", "Ramen", "Takoyaki"],
    busiestTime: "Cherry blossom season (late March–early April)",
    attire: ["layers", "comfy-shoes", "umbrella"],
  },
  osaka: {
    bestMonths: "March–May, October–November",
    popularFood: ["Takoyaki", "Okonomiyaki", "Kushikatsu"],
    busiestTime: "Cherry blossom season (late March–early April)",
    attire: ["light-clothing", "comfy-shoes", "umbrella", "sun-protection"],
  },
  kyoto: {
  bestMonths: "March–May, October–November",
  popularFood: ["Kaiseki", "Matcha sweets", "Yudofu"],
  busiestTime: "Autumn foliage season (mid-November)",
  attire: ["layers", "comfy-shoes", "umbrella"],
  },
  paris: {
    bestMonths: "April–June, September–October",
    popularFood: ["Croissants", "Escargot", "Crème brûlée"],
    busiestTime: "Summer (July–August)",
    attire: ["layers", "comfy-shoes", "umbrella"],
  },
  "new york": {
    bestMonths: "April–June, September–November",
    popularFood: ["Bagels", "Pizza", "Cheesecake"],
    busiestTime: "Holiday season (late November–December)",
    attire: ["layers", "warm-coat", "comfy-shoes"],
  },
};

export function getInsightsFor(place: string): PlaceInsights | null {
  return MOCK_INSIGHTS[place.toLowerCase()] ?? null;
}