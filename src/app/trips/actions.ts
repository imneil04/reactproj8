"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SavedDay } from "@/lib/trip";
import { Attraction, PlanDay } from "@/lib/place";

//export type SaveTripResult = { ok: true } | { ok: false; reason: "login" | "invalid" | "error" };
export type SaveTripResult =
  | { ok: true; mode: "created" | "updated" }
  | { ok: false; reason: "login" | "invalid" | "error" };


export type LoadTripResult = { ok: true; days: PlanDay[] } | { ok: false };

const MAX_DAYS = 60;
const MAX_PICKS_PER_DAY = 30;

// the client is untrusted, so check the shape before storing anything
function isValidPlan(plan: unknown): plan is SavedDay[] {
  if (!Array.isArray(plan) || plan.length < 1 || plan.length > MAX_DAYS) return false;
  return plan.every((d) => {
    if (!d || !Array.isArray(d.attractions) || d.attractions.length > MAX_PICKS_PER_DAY) return false;
    const placeOk =
      d.place === null ||
      (!!d.place &&
        typeof d.place.id === "string" &&
        typeof d.place.name === "string" &&
        typeof d.place.country === "string");
    const picksOk = d.attractions.every(
      (a: { id?: unknown; name?: unknown }) => typeof a?.id === "string" && typeof a?.name === "string"
    );
    return placeOk && picksOk;
  });
}


export async function saveTrip(plan: unknown, tripId: string | null = null): Promise<SaveTripResult> {
  
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "login" };

  if (!isValidPlan(plan) || !plan.some((d) => d.place) || JSON.stringify(plan).length > 20_000) {
    return { ok: false, reason: "invalid" };
  }

  // "Tokyo → Kyoto": cities in order, consecutive repeats collapsed
  const title = plan
    .map((d) => d.place?.name)
    .filter((n): n is string => !!n)
    .filter((n, i, all) => n !== all[i - 1])
    .join(" → ");

  if (tripId) {
    const { data: updated, error: updateError } = await supabase
      .from("trvtrips")
      .update({ title, plan })
      .eq("id", tripId)
      .eq("user_id", user.id)
      .select("id");

    if (updateError) {
      console.error("updateTrip failed:", updateError);
      return { ok: false, reason: "error" };
    }

    if (updated && updated.length > 0) {
      revalidatePath("/dashboard");
      return { ok: true, mode: "updated" };
    }
    // the trip no longer exists (deleted elsewhere), so fall through and save the plan as a new trip
  }

  const { error } = await supabase.from("trvtrips").insert({ user_id: user.id, title, plan });

  if (error) {
    console.error("saveTrip failed:", error);
    return { ok: false, reason: "error" };
  }

  revalidatePath("/dashboard");
  return { ok: true, mode: "created" };

  /**OLD CODE replaced by the one just above it */
  /*const { error } = await supabase.from("trvtrips").insert({ user_id: user.id, title, plan });
  if (error) {
    console.error("saveTrip failed:", error);
    return { ok: false, reason: "error" };
  }

  revalidatePath("/dashboard");
  return { ok: true }; */
}

export async function deleteTrip(tripId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // RLS already limits this to the user's own rows; the extra filter is a second guard
  await supabase.from("trvtrips").delete().eq("id", tripId).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function loadTripForEditing(tripId: string): Promise<LoadTripResult> {
  
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: trip } = await supabase
    .from("trvtrips")
    .select("plan")
    .eq("id", tripId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!trip) return { ok: false };

  const saved = trip.plan as SavedDay[];
  const placeIds = [...new Set(saved.flatMap((d) => (d.place ? [d.place.id] : [])))];

  const { data: rows } = await supabase
    .from("trvattractions")
    .select("id, place_id, name, description, image")
    .in("place_id", placeIds)
    .order("sort_order");

  const byPlace = new Map<string, Attraction[]>();
  for (const r of rows ?? []) {
    const list = byPlace.get(r.place_id) ?? [];
    list.push({ id: r.id, name: r.name, description: r.description, image: r.image });
    byPlace.set(r.place_id, list);
  }

  const days: PlanDay[] = saved.map((d) => {
    if (!d.place) return { place: null, picked: [] };
    const all = byPlace.get(d.place.id) ?? [];
    return {
      place: { id: d.place.id, name: d.place.name, country: d.place.country, attractions: all },
      picked: all.filter((a) => d.attractions.some((s) => s.id === a.id)), // drops attractions that no longer exist
    };
  });

  return { ok: true, days };
}

