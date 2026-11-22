"use server";

import { createClient } from "./supabase/server";
//old 
//import type { Attraction } from "./mockAttractions";
//import type { PlaceInsights } from "./mockInsights";
//new
import type { Attraction, PlaceInsights } from "./place";

//entire file replaces two sync lookups with one query that fetches the place and its attractions together
export interface Place {

    id: string; //added 11-15-2026 - for saving attractions
    name: string;
    insights: PlaceInsights;
    attractions: Attraction[];
}

export async function getPlace(search: string): Promise<Place | null> {
  
  //keyword 'await' makes it server-side 
  const supabase = await createClient();

  //added id type for saved attractions
  const { data, error } = await supabase
    .from("trvplaces")
    .select(
      "id, name, country, best_months, busiest_time, popular_food, attire, trvattractions(id, name, description, image)"
    )
    .eq("slug", search.trim().toLowerCase())
    .order("sort_order", { referencedTable: "trvattractions" })
    .maybeSingle();

    if (error) console.error("getPlace failed:", error);
    if (!data) return null;

    return {
      
        id: data.id, //added 11-15-2026 for saving attractions later
        name: data.name,
        insights: {
        country: data.country,
        bestMonths: data.best_months,
        popularFood: data.popular_food,
        busiestTime: data.busiest_time,
        attire: data.attire,
        },
        attractions: data.trvattractions,
    };
}
