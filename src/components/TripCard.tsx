import { ChevronDown } from "lucide-react";
import { DeleteTripButton } from "./DeleteTripButton";
import type { SavedTrip } from "@/lib/trip";
import { EditTripButton } from "./EditTripButton";

export function TripCard({ trip }: { trip: SavedTrip }) {
  const stops = trip.plan.reduce((n, d) => n + d.attractions.length, 0);
  const saved = new Date(trip.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="flex flex-col rounded-2xl border border-mist bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-horizon hover:shadow-md">
      <p className="text-[11px] tracking-[0.2em] uppercase text-horizon">{saved}</p>
      <h3 className="font-display text-xl leading-snug mt-2">{trip.title}</h3>
      <p className="text-sm text-ink/60 mt-1">
        {trip.plan.length} {trip.plan.length === 1 ? "day" : "days"} · {stops} {stops === 1 ? "stop" : "stops"}
      </p>

      <details name="trip-itinerary" className="group mt-4">
        <summary className="inline-flex list-none cursor-pointer items-center gap-1 text-sm text-horizon [&::-webkit-details-marker]:hidden">
          View itinerary
          <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
        </summary>

        <ol className="mt-3 space-y-3 border-l-2 border-dotted border-mist pl-4 text-sm">
          {trip.plan.map((day, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-horizon" />
              <p className="font-medium">
                Day {i + 1} ·{" "}
                <span className="font-normal text-ink/70">{day.place ? day.place.name : "Free day"}</span>
              </p>
              {day.attractions.length > 0 && (
                <p className="mt-0.5 text-xs text-ink/50">{day.attractions.map((a) => a.name).join(", ")}</p>
              )}
            </li>
          ))}
        </ol>
      </details>

      <div className="flex items-center justify-between pt-4">
        <EditTripButton tripId={trip.id} />
        <DeleteTripButton tripId={trip.id} />
      </div>
    </article>
  );
}