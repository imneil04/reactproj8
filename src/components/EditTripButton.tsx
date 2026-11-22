"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { loadTripForEditing } from "@/app/trips/actions";
import { hasDraftInProgress, startEditingTrip } from "@/hooks/useTripPlan";

export function EditTripButton({ tripId }: { tripId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  function handleEdit() {
    if (
      hasDraftInProgress() &&
      !window.confirm("This will replace the plan you're currently working on. Continue?")
    ) {
      return;
    }

    setFailed(false);
    startTransition(async () => {
      const result = await loadTripForEditing(tripId);
      if (!result.ok) {
        setFailed(true);
        return;
      }
      startEditingTrip(tripId, result.days);
      router.push("/");
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={handleEdit}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-xs text-horizon underline-offset-2 transition hover:underline cursor-pointer disabled:opacity-50"
      >
        <Pencil className="w-3.5 h-3.5" />
        {isPending ? "Opening…" : "Edit"}
      </button>
      {failed && (
        <span role="alert" className="text-xs text-sunset">
          Couldn&apos;t open this trip.
        </span>
      )}
    </span>
  );
}