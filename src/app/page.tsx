"use client"
import Image from "next/image";
import { useState } from "react";
import { getAttractionsFor, type Attraction } from "@/lib/mockAttractions";
import { getInsightsFor, type PlaceInsights } from "@/lib/mockInsights";
import { motion } from "motion/react";
import Navigation from "@/components/Nav";
import NoticeBanner from "./NoticeBannerHome";

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

  //for searching attractions
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
  }

  //clear page
  function handleClear() {

    setQuery("");
    setResults(null);
    setSearchedPlace("");
    setError("");
    setInsights(null);

  }

  return (
    <>
      <Navigation />
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
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleSearch}
                className="cursor-pointer bg-sunset text-white px-7 py-2 rounded-full font-medium hover:shadow-md hover:brightness-95 active:scale-[0.98] transition"
                >
                Check Attractions
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
            </motion.div>
          )}

          {results && (
            <motion.div
              key={`results-${searchedPlace}`} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-10 text-left">
              <h2 className="font-display text-lg mb-5">
                  Top spots in <span className="text-horizon">{searchedPlace}</span>
              </h2>

              {results.length > 0 ? (
                <ul className="relative border-l-2 border-dotted border-mist pl-5.5 space-y-4">
                  {results.map((attraction) => (
                    <li key={attraction.name} className="relative">
                      <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-horizon" />
                      <div className="max-w-xs bg-gray-50 border border-mist rounded-xl px-4 py-3 shadow-sm hover:shadow-sm transition">
                        <p className="font-medium">{attraction.name}</p>
                        <p className="text-sm text-ink/70 mt-2">{attraction.description}</p>
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
