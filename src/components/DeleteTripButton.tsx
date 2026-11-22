"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTrip } from "@/app/trips/actions";

export function DeleteTripButton({ tripId }: { tripId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        aria-label="Delete trip"
        className="inline-flex items-center gap-1.5 text-xs text-ink/40 hover:text-sunset cursor-pointer transition"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-xs">
      <button
        onClick={() =>
          startTransition(async () => {
            await deleteTrip(tripId);
          })
        }
        disabled={isPending}
        className="font-medium text-sunset cursor-pointer disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-ink/50 hover:text-ink cursor-pointer"
      >
        Cancel
      </button>
    </span>
  );
}