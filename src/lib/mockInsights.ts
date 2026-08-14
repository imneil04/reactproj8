export interface PlaceInsights {
  bestMonths: string;
  popularFood: string[];
  busiestTime: string;
}

const MOCK_INSIGHTS: Record<string, PlaceInsights> = {
  tokyo: {
    bestMonths: "March–May, October–November",
    popularFood: ["Sushi", "Ramen", "Takoyaki"],
    busiestTime: "Cherry blossom season (late March–early April)",
  },
  osaka: {
    bestMonths: "March–May, October–November",
    popularFood: ["Takoyaki", "Okonomiyaki", "Kushikatsu"],
    busiestTime: "Cherry blossom season (late March–early April)",
  },
  kyoto: {
  bestMonths: "March–May, October–November",
  popularFood: ["Kaiseki", "Matcha sweets", "Yudofu"],
  busiestTime: "Autumn foliage season (mid-November)",
  },
  paris: {
    bestMonths: "April–June, September–October",
    popularFood: ["Croissants", "Escargot", "Crème brûlée"],
    busiestTime: "Summer (July–August)",
  },
  "new york": {
    bestMonths: "April–June, September–November",
    popularFood: ["Bagels", "Pizza", "Cheesecake"],
    busiestTime: "Holiday season (late November–December)",
  },
};

export function getInsightsFor(place: string): PlaceInsights | null {
  return MOCK_INSIGHTS[place.toLowerCase()] ?? null;
}