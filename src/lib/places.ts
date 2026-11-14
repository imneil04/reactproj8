"use server";
import { createClient } from "./supabase/server";
//old 
//import type { Attraction } from "./mockAttractions";
//import type { PlaceInsights } from "./mockInsights";
//new
import type { Attraction, PlaceInsights } from "./place";

//entire file replaces two sync lookups with one query that fetches the place and its attractions together
export interface Place {
    name: string;
    insights: PlaceInsights;
    attractions: Attraction[];
}

export async function getPlace(search: string): Promise<Place | null> {
  
  //keyword 'await' makes it server-side 
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trvplaces")
    .select(
      "name, country, best_months, busiest_time, popular_food, attire, trvattractions(name, description, image)"
    )
    .eq("slug", search.trim().toLowerCase())
    .order("sort_order", { referencedTable: "trvattractions" })
    .maybeSingle();

    if (error) console.error("getPlace failed:", error);
    if (!data) return null;

    return {
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
