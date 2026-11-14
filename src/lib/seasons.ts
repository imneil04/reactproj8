import type { Season } from "./place";

export const SEASONS: {id: Season; label: string; range: string; months: number[] }[] = [
  { id: "spring", label: "Spring", range: "Jan–Apr", months: [0, 1, 2, 3] },
  { id: "summer", label: "Summer", range: "May–Aug", months: [4, 5, 6, 7] },
  { id: "fall", label: "Fall", range: "Sep–Oct", months: [8, 9] },
  { id: "winter", label: "Winter", range: "Nov–Dec", months: [10, 11] },
];

//month is o-indexed (0 = Jan), match Date.getMonth()
export function getSeasonForMonth(month: number): Season {
  return SEASONS.find((s) => s.months.includes(month))?.id ?? "spring";
}