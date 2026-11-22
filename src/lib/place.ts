export interface Attraction {

    id: string; //added 11-15-2026 for saving place or attractions per user
    name: string;
    description: string;
    image: string;
}

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

//interface for attractions detailed info
export interface PlaceInsights {

  country: string; //country name
  bestMonths: string;
  popularFood: string[];
  busiestTime: string;
  //attire: AttireType[];
  attire: Record<Season, AttireType[]>;

}

//added 11-15-2026 for saving place or attractions feature per user
export interface PlanPlace {

  id: string;
  name: string;
  country: string;
  attractions: Attraction[]; //snapshot taken when the city is added, so its attractions can be planned later without re-searching
}

export interface PlanDay {

  place: PlanPlace | null; // which city this day is in
  picked: Attraction[]; //optional: attractions planned for this day
}