export interface SavedDay {
  place: { id: string; name: string; country: string } | null;
  attractions: { id: string; name: string }[];
}

export interface SavedTrip {
  id: string;
  title: string;
  plan: SavedDay[];
  created_at: string;
}