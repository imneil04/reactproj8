import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { TripCard } from "@/components/TripCard";
import type { SavedTrip } from "@/lib/trip";

export default async function DashboardPage() {

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } =  await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user!.id)
        .single();

    const { data: trips } = await supabase
        .from("trvtrips")
        .select("id, title, plan, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

    const savedTrips = (trips ?? []) as SavedTrip[];

    return (
        <>
            <main className="mx-auto max-w-4xl px-6 py-16">
                {/**welcome greeting block, logout button */}
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl tracking-tight">
                            Welcome back, {profile?.full_name ?? "traveler"}
                        </h1>
                    </div>
                    
                </div>
                 <p className="mt-2 text-sm text-black/60">
                    Your planned trips will live here.
                </p>

                <section className="mt-10">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                        <h2 className="font-display text-2xl">Your Trips</h2>
                        <p className="mt-0.5 text-sm text-ink/50">
                            {savedTrips.length === 0
                            ? "Nothing saved yet"
                            : `${savedTrips.length} saved ${savedTrips.length === 1 ? "trip" : "trips"}`}
                        </p>
                        </div>
                        <Link
                        href="/"
                        className="rounded-full bg-sunset px-5 py-2 text-sm font-medium text-white transition hover:brightness-95 active:scale-[0.98]"
                        >
                        Plan a new trip
                        </Link>
                    </div>

                    {savedTrips.length > 0 ? (
                        <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {savedTrips.map((trip) => (
                                <TripCard key={trip.id} trip={trip} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-mist bg-white/50 px-6 py-12 text-center">
                            <p className="font-display text-lg">No trips yet</p>
                            <p className="mb-5 mt-1 text-sm text-ink/50">
                                Search a place, add it to your days, and save the plan. It will show up here.
                            </p>
                            <Link
                                href="/"
                                className="rounded-full bg-sunset px-5 py-2 text-sm font-medium text-white transition hover:brightness-95"
                            >
                                Start planning
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}