export interface Attraction {
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