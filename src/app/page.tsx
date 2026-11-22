"use client"
import Image from "next/image";
import { useState, useRef } from "react";
//-----------------OLD IMPORTS-----------
//removed 'getAttractionsFor' from this line to make it type-only import
//import { type Attraction } from "@/lib/mockAttractions";
//removed 'getInsightsFor' same ass getAttractionsFor
//import { getSeasonForMonth, SEASONS, type PlaceInsights, type AttireType, type Season } from "@/lib/mockInsights";

//------------------NEW IMPORTS----------
import { getPlace } from "@/lib/places";
import type { Attraction, PlaceInsights, AttireType, Season, PlanPlace } from "@/lib/place";
import { getSeasonForMonth, SEASONS } from "@/lib/seasons";
{/**react hooks */}
import { useTripPlan, toSavedPlan } from "@/hooks/useTripPlan";
//---------------------------------------
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
//import Navigation from "@/components/Nav";
import NoticeBanner from "./NoticeBannerHome";
import { type WeatherData } from "@/types/weather";
import Link from "next/link";
import { saveTrip } from "./trips/actions";
//lucide-react icons
import { Shirt, Layers, 
  Snowflake, Umbrella, 
  Footprints, Sun, 
  Wind, Thermometer,
  Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, Droplets, LoaderCircle,
  Plus, Minus, ChevronDown, X, CalendarDays, Save, type LucideIcon } from "lucide-react";

const WEATHER_ICONS: Record<string, LucideIcon> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudLightning,
  Snow: CloudSnow,
};

function WeatherIcon({ main, className }: { main: string; className?: string }) {
  const Icon = WEATHER_ICONS[main] ?? CloudFog; // mist, fog, haze, etc.
  return <Icon className={className} />;
}


const ATTIRE_DISPLAY: Record<AttireType, { label: string; icon: LucideIcon }> = {
  "light-clothing": { label: "Light, breathable clothes", icon: Shirt },
  layers: { label: "Layers", icon: Layers },
  "warm-coat": { label: "Warm coat", icon: Snowflake },
  umbrella: { label: "Umbrella", icon: Umbrella },
  "comfy-shoes": { label: "Comfy walking shoes", icon: Footprints },
  "sun-protection": { label: "Sun protection", icon: Sun },
  "light-jacket": { label: "Light jacket", icon: Wind },
  "t-shirts": { label: "T-shirts", icon: Shirt },
  shorts: { label: "Shorts", icon: Thermometer },
  sweater: { label: "Sweater", icon: Shirt },
  "scarf-gloves": { label: "Scarf & gloves", icon: Snowflake },
};

//for saving attractions per user. Pill icon
const pill = (active: boolean) =>
  `rounded-full border px-2.5 py-0.5 text-xs cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed ${
    active ? "bg-horizon text-white border-horizon" : "bg-white border-mist hover:border-horizon"
  }`; 

export default function Home() {

  //current text typed in search box
  const [ query, setQuery ] = useState("");
  //list of attractions found, or null if no search yet
  const [ results, setResults ] = useState<Attraction[] | null>(null);
  //the place name that was actually searched
  const [ searchedPlace, setSearchedPlace ] = useState("");
  //validation msg shown when search is attempted with empty input
  const [ error, setError ] = useState("");
  //quick facts about the searched place
  const [ insights, setInsights ] = useState<PlaceInsights | null>(null);
  //track state for images, name of the attraction currently hovered
  const [ hoveredAtraction, setHoveredAtraction ] = useState<string | null>(null);
  //season state
  const [ selectedSeason, setSelectedSeason ] = useState<Season>(() => getSeasonForMonth(new Date().getMonth())); //season whose attire is shown

  //weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);                 // current conditions + 3-day forecast
  const [weatherStatus, setWeatherStatus] = useState<"idle" | "loading" | "error">("idle"); // fetch state for the weather block
  const latestWeatherRequest = useRef(0);  

  const latestSearch = useRef(0);// lets us ignore response from older searches

  // true while a search is waiting on supabase
  const [ isSearching, setIsSearching ] = useState(false);

  //for saving attractions or place per user
  const plan = useTripPlan(3);                                           // the multi-city, day-by-day plan
  // searched place, in the shape the plan stores
  const [currentPlace, setCurrentPlace] = useState<PlanPlace | null>(null); 
   // which day's attraction picker is open
  const [expandedDay, setExpandedDay] = useState<number | null>(null);     
  // save state type
  const [ saveState, setSaveState ] = useState<"idle" | "saving" | "saved" | "updated" |"login" | "error">("idle"); 


  //new function for getting weather
  async function fetchWeather(place: string) {
    const requestId = ++latestWeatherRequest.current;
    setWeather(null);
    setWeatherStatus("loading");
    try {
      const res = await fetch(`/api/weather?place=${encodeURIComponent(place)}`);
      if (!res.ok) throw new Error("Weather request failed");
      const data: WeatherData = await res.json();
      if (requestId !== latestWeatherRequest.current) return; // a newer search took over
      
      setWeather(data);
      setWeatherStatus("idle");
    } catch {
      if (requestId !== latestWeatherRequest.current) return;
      
      setWeatherStatus("error");
    }
  }
  
  /** 
  //for searching attractions, REPLACED WITH async function one
  function handleSearch() {

    const trimmed = query.trim();
    if (!trimmed)
    {
      setError("Please type a place or attraction before searching.")
      return;
    }

    setError("");
    setSearchedPlace(trimmed);
    setResults(getAttractionsFor(trimmed));
    setInsights(getInsightsFor(trimmed));
    fetchWeather(trimmed); //for weather details
  } */

  //for attractions (refractored the old one above)
  async function handleSearch() {

    const trimmed = query.trim();

    if (!trimmed) {
      setError("Please type a place or attraction before searching.");
      return;
    }
    setError("");
    setIsSearching(true);

    const requestId = ++latestSearch.current;
    try {

        const place = await getPlace(trimmed);
        if (requestId !== latestSearch.current) return; // a newer search took over

        setSearchedPlace(place?.name ?? trimmed);
        setResults(place?.attractions ?? []);
        setInsights(place?.insights ?? null);
        setCurrentPlace(
          place
            ? { id: place.id, name: place.name, country: place.insights.country, attractions: place.attractions }
            : null
        );
        
        if (place) fetchWeather(trimmed); //for weather details
      }
    finally {
        //only the latest search is allowed to turn the spinner off
        if (requestId === latestSearch.current) setIsSearching(false);
    }
  }

  //handler to save trips
  async function handleSaveTrip() {
  setSaveState("saving");
  try {
    const result = await saveTrip(toSavedPlan(plan.days), plan.editingTripId);
    if (result.ok) {
      plan.reset();
      setExpandedDay(null);
      setSaveState(result.mode === "updated" ? "updated" : "saved"); //set matching state
    } else {
      setSaveState(result.reason === "login" ? "login" : "error");
    }
  } catch {
    setSaveState("error");
  }
}

  //clear page
  function handleClear() {

    setQuery("");
    setResults(null);
    setSearchedPlace("");
    setError("");
    setInsights(null);
    setIsSearching(false);

    //for weather details
    setWeather(null);
    setWeatherStatus("idle");
    setCurrentPlace(null);

    //cancels any in-flight search
    latestSearch.current++;

  }

  return (
    <>
      {/**<Navigation /> */}
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <NoticeBanner />
        <div className="w-full max-w-lg text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase text-horizon mb-3">
            <span>placeholder</span>
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-medium leading-tight mb-10">
            Find what&apos;s worth seeing
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Type a place — Tokyo, Paris, New York…"
              className="flex-1 bg-white border border-mist rounded-full px-6 py-3 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-horizon transition"
            />
            {/**items-center cursor-pointer bg-sunset text-white px-7 py-2 rounded-full font-medium hover:shadow-md hover:brightness-95 active:scale-[0.98] transition */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="inline-flex items-center justify-center gap-2 min-w-[8rem] bg-sunset text-white px-7 py-2 rounded-full font-medium hover:brightness-95 active:scale-[0.98] transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Checking now...
                    </>
                  ) : (
                    "Search attraction"
                  )}
              </button>

              <button
                onClick={handleClear}
                className="cursor-pointer bg-emerald-500 text-white px-7 py-2 rounded-full font-medium hover:shadow-sm hover:brightness-95 active:scale-[0.98] transition"
                >
                Clear Search
              </button>
            </div>
          </motion.div>

          {error && (
            <p className="text-sm text-sunset mt-3">{error}</p>
          )}
          {/**rendering insights card (to display what to expect items) */}
          {insights && (
            <motion.div
              key={`insights-${searchedPlace}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cursor-pointer bg-white border border-mist rounded-xl px-5 py-4 mt-4 hover:shadow-md hover:border-horizon hover:scale-[1.01] space-y-2 text-sm">
              <p>
                <span className="text-horizon font-medium">Best time to visit:</span>{" "}
                {insights.bestMonths}
              </p>
              <p>
                <span className="text-horizon font-medium">Popular food:</span>{" "}
                {insights.popularFood.join(", ")}
              </p>
              <p>
                <span className="text-horizon font-medium">Busiest period:</span>{" "}
                {insights.busiestTime}
              </p>

              {/**weather insights block */}
              <div className="pt-3 border-t border-mist">
                <p className="text-horizon font-medium mb-2">Weather in {searchedPlace}:</p>

                {weatherStatus === "loading" && <p className="text-ink/50">Checking the skies…</p>}
                {weatherStatus === "error" && (
                  <p className="text-ink/50">Couldn&apos;t load the weather right now.</p>
                )}

                {weather && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <WeatherIcon main={weather.main} className="w-8 h-8 text-horizon" />
                      <div>
                        <p className="font-display text-2xl leading-none">{Math.round(weather.temp)}°C</p>
                        <p className="text-xs text-ink/60 capitalize">
                          {weather.condition} · feels like {Math.round(weather.feelsLike)}°
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-ink/60 space-y-1">
                        <p className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5" /> {weather.humidity}%
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Wind className="w-3.5 h-3.5" /> {Math.round(weather.windKmh)} km/h
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {weather.forecast.map((day) => (
                        <div
                          key={day.date}
                          className="rounded-lg bg-paper border border-mist px-3 py-2 text-center text-xs transition hover:border-horizon"
                        >
                          <p className="font-medium">{day.weekday}</p>
                          <WeatherIcon main={day.main} className="w-5 h-5 text-horizon mx-auto my-1" />
                          <p>
                            {Math.round(day.max)}° <span className="text-ink/50">{Math.round(day.min)}°</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/**what to pack block */}
              <div className="pt-3 border-t border-mist">
                <p className="text-horizon font-medium mb-2">What to pack:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {SEASONS.map((season) => (
                      <button
                        key={season.id}
                        onClick={() => setSelectedSeason(season.id)}
                        className={`rounded-full border px-3 py-1 text-xs cursor-pointer transition ${
                          selectedSeason === season.id
                            ? "bg-horizon text-white border-horizon"
                            : "bg-white border-mist hover:border-horizon"
                        }`}
                      >
                        {season.label} <span className="opacity-60">{season.range}</span>
                      </button>
                    ))}
                  </div>
                  {/**the key on the motion div remounts it on each season switch, so the pills fade in again. Same as the results and insights cards*/}
                  <motion.div
                    key={selectedSeason}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-wrap gap-2"
                  >
                    {insights.attire[selectedSeason].map((item) => {
                      const { label, icon: Icon } = ATTIRE_DISPLAY[item];
                      return (
                        <span
                          key={item}
                          className="group inline-flex items-center gap-1.5 rounded-full bg-paper border border-mist px-3 py-1.5 text-xs cursor-default transition duration-200 ease-out hover:-translate-y-0.5 hover:border-horizon hover:bg-white hover:shadow-sm"
                        >
                          <Icon className="w-3.5 h-3.5 text-horizon transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6" />
                          {label}
                        </span>
                      );
                    })}
                  </motion.div>
              </div>
            </motion.div>
          )}

          {/**trip length stepper or picker */}
          {currentPlace && (
            <div className="mb-5 mt-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-horizon/10 text-horizon">
                  <CalendarDays className="w-4 h-4" />
                </span>
                <div>
                  {/**new h3 block */}
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg leading-tight">Plan your trip</h3>
                    {plan.editingTripId && (
                      <span className="rounded-full bg-horizon/10 px-2.5 py-0.5 text-xs text-horizon">
                        Editing saved trip
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50">
                    Add {currentPlace.name} to your days, then tap{" "}
                    <span className="font-medium text-horizon">Plan on</span> under each attraction to choose its day.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-ink/60">Trip length</span>
                <div className="inline-flex items-center rounded-full border border-mist bg-white">
                  <button
                    onClick={() => plan.changeLength(-1)}
                    disabled={!plan.canRemoveDay}
                    aria-label="Remove a day"
                    className="p-2 rounded-full cursor-pointer transition hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 tabular-nums">
                    {plan.days.length} {plan.days.length === 1 ? "day" : "days"}
                  </span>
                  <button
                    onClick={() => plan.changeLength(1)}
                    disabled={!plan.canAddDay}
                    aria-label="Add a day"
                    className="p-2 rounded-full cursor-pointer transition hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-ink/50">Add {currentPlace.name} to:</span>
                {plan.days.map((day, i) => {
                  const here = day.place?.id === currentPlace.id;
                  const takenByOther = !!day.place && !here;
                  return (
                    <button
                      key={i}
                      onClick={() => plan.toggleCityOnDay(i, currentPlace)}
                      disabled={takenByOther}
                      aria-pressed={here}
                      title={takenByOther ? `Day ${i + 1} is already set to ${day.place?.name}` : undefined}
                      className={pill(here)}
                    >
                      Day {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/**plan panel, so the user can save their trip plans (login required) */}
          {(saveState === "saved" || saveState === "updated") && !plan.days.some((d) => d.place) && (
            <div
              role="status"
              className="w-full max-w-2xl mt-12 rounded-xl border border-horizon/30 bg-horizon/5 px-5 py-4 text-left text-sm"
            >
              <span className="font-medium text-horizon">
                {saveState === "updated" ? "Trip updated." : "Trip saved."}
              </span>{" "}
              <Link href="/dashboard" className="underline underline-offset-2">
                View your trips
              </Link>
            </div>
          )}

          {plan.days.some((d) => d.place) && (
            <section className="w-full max-w-2xl mt-12 text-left">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    plan.reset();
                    setExpandedDay(null);
                  }}
                  className="text-sm text-ink/50 hover:text-ink underline underline-offset-2 transition cursor-pointer"
                >
                  Clear plan
                </button>
                <button
                  onClick={handleSaveTrip}
                  disabled={saveState === "saving"}
                  className="inline-flex items-center gap-1 mb-1 rounded-full bg-sunset px-5 py-1.5 text-sm font-medium text-white transition hover:brightness-95 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saveState === "saving" ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saveState === "saving" ? "Saving…" : plan.editingTripId ? "Update trip" : "Save trip"}
                </button>
              </div>

              {saveState === "login" && (
                <p role="alert" className="mb-3 text-sm text-ink/70">
                  Log in to save this trip. Your plan will be waiting when you&apos;re back.{" "}
                  <Link href="/login" className="text-horizon underline underline-offset-2">
                    Log in
                  </Link>
                </p>
              )}
              {saveState === "error" && (
                <p role="alert" className="mb-3 text-sm text-sunset">
                  Couldn&apos;t save your trip. Please try again.
                </p>
              )}
              {/**planner grid list */}
              <div className="grid gap-3 sm:grid-cols-2">
                {plan.days.map((day, i) => (
                  <div key={i} className="rounded-xl border border-mist bg-white px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-horizon font-medium text-sm">Day {i + 1}</p>
                      {day.place && (
                        <button
                          onClick={() => plan.clearDay(i)}
                          aria-label={`Remove ${day.place.name} from day ${i + 1}`}
                          className="text-ink/40 hover:text-sunset cursor-pointer transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {day.place ? (
                      <>
                        <p className="text-sm font-medium">
                          {day.place.name}
                          <span className="text-ink/50 font-normal">, {day.place.country}</span>
                        </p>

                        {day.picked.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-ink/70">
                            {day.picked.map((a) => (
                              <li key={a.id} className="flex items-center justify-between gap-2">
                                {a.name}
                                <button
                                  onClick={() => plan.togglePick(i, a)}
                                  aria-label={`Remove ${a.name} from day ${i + 1}`}
                                  className="text-ink/40 hover:text-sunset cursor-pointer transition"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}

                        <button
                          onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                          aria-expanded={expandedDay === i}
                          className="mt-3 inline-flex items-center gap-1 text-xs text-horizon cursor-pointer"
                        >
                          {expandedDay === i ? "Hide attractions" : "Plan attractions"}
                          <ChevronDown
                            className={`w-3.5 h-3.5 transition-transform ${expandedDay === i ? "rotate-180" : ""}`}
                          />
                        </button>

                        {expandedDay === i && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {day.place.attractions.map((a) => (
                              <button
                                key={a.id}
                                onClick={() => plan.togglePick(i, a)}
                                aria-pressed={day.picked.some((p) => p.id === a.id)}
                                className={pill(day.picked.some((p) => p.id === a.id))}
                              >
                                {a.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-ink/40">No city yet</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {results && (
            <motion.div
              key={`results-${searchedPlace}`} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 text-left">
              <h2 className="font-display text-lg mb-5">
                  Top spots in {" "} 
                  <span className="text-horizon">{searchedPlace}</span>
                  {insights && <span className="text-ink/50">, {insights.country}</span>}
              </h2>

              {results.length > 0 ? (
                <ul className="relative border-l-2 border-dotted border-mist pl-5.5 space-y-4">
                  {results.map((attraction) => (
                    <li key={attraction.name} className="relative" 
                        onMouseEnter={() => setHoveredAtraction(attraction.name)}
                        onMouseLeave={() => setHoveredAtraction(null)}
                    >
                      <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-horizon" />
                      <div className="flex items-center gap-2">
                        <div className="cursor-pointer flex-1 max-w-xs bg-gray-50 border border-mist rounded-xl px-4 py-3 shadow-sm hover:shadow-sm transition">
                            <p className="font-medium">{attraction.name}</p>
                            <p className="text-sm text-ink/70 mt-2">{attraction.description}</p>

                            {currentPlace && plan.days.some((d) => d.place?.id === currentPlace.id) && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                                <span className="text-xs text-ink/50">Plan on:</span>
                                {plan.days.map((day, i) => {
                                  if (day.place?.id !== currentPlace.id) return null;
                                  const active = day.picked.some((a) => a.id === attraction.id);
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => plan.togglePick(i, attraction)}
                                      aria-pressed={active}
                                      className={pill(active)}
                                    >
                                      Day {i + 1}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                        </div>
                      
                        <AnimatePresence>
                          {hoveredAtraction === attraction.name && (
                            <motion.div
                              initial={{ opacity: 0, x: 12, width: 0 }}
                              animate={{ opacity: 1, x: 0, width: 160 }}
                              exit={{ opacity: 0, x: 12, width: 0 }}
                              transition={{ duration: 0.3 }}
                              className="relative shadow-lg h-30 overflow-hidden rounded-lg shrink-0"
                            >
                              <Image
                                src={attraction.image}
                                alt={attraction.name}
                                fill
                                sizes="160px"
                                quality={90}
                                className="object-cover rounded-lg"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>  
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink/50">
                  No results for this one yet — please try another place.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
