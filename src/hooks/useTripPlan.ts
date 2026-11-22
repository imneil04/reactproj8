"use client";
/**NEW CODE */
// CHANGED: useState is gone; useMemo + useSyncExternalStore replace it
import { useMemo, useSyncExternalStore } from "react";
import type { Attraction, PlanDay, PlanPlace } from "@/lib/place";
import type { SavedDay } from "@/lib/trip"; // NEW: used by toSavedPlan at the bottom

const MIN_DAYS = 1;
const MAX_DAYS = 60;
const STORAGE_KEY = "placeholder:trip-draft:v2"; // Changed from v1 to v2. Old draft.

const emptyDay = (): PlanDay => ({ place: null, picked: [] });

// NEW: the draft remembers which saved trip (if any) is being edited
interface Draft {
  days: PlanDay[];
  tripId: string | null;
}

// ───────────────────────────────────────────────────────────────
// NEW: tiny external store backed by localStorage
// ───────────────────────────────────────────────────────────────
const listeners = new Set<() => void>();
let cached: string | null | undefined; // undefined = not read from localStorage yet

function getSnapshot(): string | null {
  if (cached === undefined) {
    try {
      cached = localStorage.getItem(STORAGE_KEY);
    } catch {
      cached = null;
    }
  }
  return cached;
}

const getServerSnapshot = (): string | null => null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cached = undefined; // another tab changed it, so re-read next time
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// CHANGED: takes the whole draft instead of just the days
function writeDraft(draft: Draft) {
  cached = JSON.stringify(draft);
  try {
    localStorage.setItem(STORAGE_KEY, cached);
  } catch {
    // storage blocked or full: the plan still works in memory for this tab
  }
  listeners.forEach((l) => l());
}
/*function writeDraft(days: PlanDay[]) {
  cached = JSON.stringify(days);
  try {
    localStorage.setItem(STORAGE_KEY, cached);
  } catch {
    // storage blocked or full: the plan still works in memory for this tab
  }
  listeners.forEach((l) => l());
}*/

// CHANGED: returns a Draft instead of a plain array
function parseDraft(raw: string | null, fallbackLength: number): Draft {
  const fallback: Draft = { days: Array.from({ length: fallbackLength }, emptyDay), tripId: null };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<Draft> | null;
    const days = parsed?.days;
    if (!Array.isArray(days) || days.length === 0) return fallback;
    return { days, tripId: typeof parsed?.tripId === "string" ? parsed.tripId : null };
  } catch {
    return fallback;
  }
}
/*function parseDraft(raw: string | null, fallbackLength: number): PlanDay[] {
  const fallback = Array.from({ length: fallbackLength }, emptyDay);
  if (!raw) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as PlanDay[]) : fallback;
  } catch {
    return fallback;
  }
}*/

export function useTripPlan(initialDays = 3) {
  // ─────────────────────────────────────────────────────────────
  // CHANGED: replaces the old `const [days, setDays] = useState(...)`
  // ─────────────────────────────────────────────────────────────
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  //const days = useMemo(() => parseDraft(raw, initialDays), [raw, initialDays]);
  // CHANGED: the memoized value is now the whole draft
  const draft = useMemo(() => parseDraft(raw, initialDays), [raw, initialDays]);
  const days = draft.days;

  // CHANGED: updates the days but keeps the tripId
  const setDays = (update: (prev: PlanDay[]) => PlanDay[]) => {
    const current = parseDraft(getSnapshot(), initialDays);
    writeDraft({ ...current, days: update(current.days) });
  };
  /*same updater style as before, but it now writes to the store (and localStorage) instead of useState
  const setDays = (update: (prev: PlanDay[]) => PlanDay[]) =>
    writeDraft(update(parseDraft(getSnapshot(), initialDays))); */

  // ─────────────────────────────────────────────────────────────
  // UNCHANGED from here down to the return statement
  // ─────────────────────────────────────────────────────────────
  const updateDay = (index: number, update: (day: PlanDay) => PlanDay) =>
    setDays((prev) => prev.map((d, i) => (i === index ? update(d) : d)));

  function changeLength(delta: number) {
    setDays((prev) => {
      const target = Math.min(MAX_DAYS, Math.max(MIN_DAYS, prev.length + delta));
      return target > prev.length
        ? [...prev, ...Array.from({ length: target - prev.length }, emptyDay)]
        : prev.slice(0, target);
    });
  }

  function toggleCityOnDay(dayIndex: number, place: PlanPlace) {
    updateDay(dayIndex, (day) => {
      if (day.place?.id === place.id) return emptyDay(); // tapping the same city again unassigns it
      if (day.place) return day;                         // day already belongs to another city
      return { place, picked: [] };
    });
  }

  function clearDay(dayIndex: number) {
    updateDay(dayIndex, emptyDay);
  }

  function togglePick(dayIndex: number, attraction: Attraction) {
    setDays((prev) => {
      if (!prev[dayIndex]?.place) return prev; // attractions need a city on that day first
      const alreadyThere = prev[dayIndex].picked.some((a) => a.id === attraction.id);

      return prev.map((d, i) => {
        const without = d.picked.filter((a) => a.id !== attraction.id); // an attraction lives on one day only
        return i === dayIndex && !alreadyThere
          ? { ...d, picked: [...without, attraction] }
          : { ...d, picked: without };
      });
    });
  }

  // CHANGED: also leaves edit mode
  function reset() {
     const current = parseDraft(getSnapshot(), initialDays);
     writeDraft({ days: current.days.map(() => emptyDay()), tripId: null });
    //setDays((prev) => prev.map(() => emptyDay()));
  }

  return {
    days,
    editingTripId: draft.tripId, //
    changeLength,
    toggleCityOnDay,
    clearDay,
    togglePick,
    reset,
    canAddDay: days.length < MAX_DAYS,
    canRemoveDay: days.length > MIN_DAYS,
  };
}

// ───────────────────────────────────────────────────────────────
// NEW: the slimmed-down shape stored in the database
// (no attraction descriptions or images)
// ───────────────────────────────────────────────────────────────
export function toSavedPlan(days: PlanDay[]): SavedDay[] {
  return days.map((d) => ({
    place: d.place && { id: d.place.id, name: d.place.name, country: d.place.country },
    attractions: d.picked.map((a) => ({ id: a.id, name: a.name })),
  }));
}

// --- NEW: used by the dashboard's Edit button ---
export function startEditingTrip(tripId: string, days: PlanDay[]) {
  writeDraft({ days, tripId });
}
export function hasDraftInProgress(): boolean {
  return parseDraft(getSnapshot(), 1).days.some((d) => d.place);
}

/**------------------------------------------------------- */
/**OLD CODE - prior to persistent saving of trip plan */
/*"use client";
import { useState } from "react";
import type { Attraction, PlanDay, PlanPlace } from "@/lib/place";

const MIN_DAYS = 1;
const MAX_DAYS = 60;

const emptyDay = (): PlanDay => ({ place: null, picked: [] });

export function useTripPlan(initialDays = 3) {

    const [days, setDays] = useState<PlanDay[]>(() =>
    Array.from({ length: initialDays }, emptyDay)
  );

     const updateDay = (index: number, update: (day: PlanDay) => PlanDay) =>
     setDays((prev) => prev.map((d, i) => (i === index ? update(d) : d)));

     function changeLength(delta: number) {
     setDays((prev) => {
      const target = Math.min(MAX_DAYS, Math.max(MIN_DAYS, prev.length + delta));
      return target > prev.length
        ? [...prev, ...Array.from({ length: target - prev.length }, emptyDay)]
        : prev.slice(0, target);
    });
  }

  function toggleCityOnDay(dayIndex: number, place: PlanPlace) {
    updateDay(dayIndex, (day) => {
      if (day.place?.id === place.id) return emptyDay(); // tapping the same city again unassigns it
      if (day.place) return day;                         // day already belongs to another city
      return { place, picked: [] };
    });
  }


  function clearDay(dayIndex: number) {
    updateDay(dayIndex, emptyDay);
  }

  function togglePick(dayIndex: number, attraction: Attraction) {
    setDays((prev) => {
      if (!prev[dayIndex]?.place) return prev; // attractions need a city on that day first
      const alreadyThere = prev[dayIndex].picked.some((a) => a.id === attraction.id);

      return prev.map((d, i) => {
        const without = d.picked.filter((a) => a.id !== attraction.id); // an attraction lives on one day only
        return i === dayIndex && !alreadyThere
          ? { ...d, picked: [...without, attraction] }
          : { ...d, picked: without };
      });
    });
  }

  function reset() {
    setDays((prev) => prev.map(() => emptyDay()));
  }

  return {
    days,
    changeLength,
    toggleCityOnDay,
    clearDay,
    togglePick,
    reset,
    canAddDay: days.length < MAX_DAYS,
    canRemoveDay: days.length > MIN_DAYS,
  };
} */