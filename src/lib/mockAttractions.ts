//import { image } from "motion/react-client";

export interface Attraction {
    name: string;
    description: string;
    image: string;
}

const MOCK_DATA: Record<string, Attraction[]> = {
  tokyo: [
    { name: "Senso-ji Temple", description: "Tokyo's oldest temple, known for its iconic Thunder Gate and lantern-lined approach.", image: "/images/tokyosj_unsplash.jpg" },
    { name: "Shibuya Crossing", description: "The world's busiest pedestrian crossing, framed by neon signage and skyscrapers.", image: "/images/tokyosc_unsplash.jpg" },
    { name: "Tokyo Tower", description: "A red-and-white broadcast tower with sweeping views across the city skyline.", image: "/images/tokyott_unsplash.jpg" },
    { name: "Meiji Shrine", description: "A tranquil forested shrine dedicated to Emperor Meiji, tucked away near Harajuku.", image: "/images/tokyoms_unsplash.jpg" },
  ],
  paris: [
    { name: "Eiffel Tower", description: "The iron lattice landmark that defines the Paris skyline, best seen at sunset.", image: "/images/pariset_unsplash.jpg" },
    { name: "Louvre Museum", description: "The world's largest art museum, home to the Mona Lisa and countless masterpieces.", image: "/images/parislm_unsplash.jpg" },
    { name: "Notre-Dame Cathedral", description: "A Gothic masterpiece on the Île de la Cité, still under restoration after the 2019 fire.", image: "/images/parisndc_unsplash.jpg" },
    { name: "Montmartre", description: "A hilltop artists' quarter crowned by the white domes of Sacré-Cœur.", image: "/images/parismm_unsplash.jpg" },
  ],
  "new york": [
    { name: "Central Park", description: "An 843-acre green escape in the middle of Manhattan, ideal for a walk or picnic.", image: "/images/newyorkcp_unsplash.jpg" },
    { name: "Statue of Liberty", description: "The iconic copper statue standing on Liberty Island, reachable by ferry.", image: "/images/newyorksol_unsplash.jpg" },
    { name: "Times Square", description: "A dazzling, ever-lit intersection packed with billboards, theaters, and crowds.", image: "/images/newyorkts_unsplash.jpg" },
    { name: "Empire State Building", description: "An Art Deco skyscraper with an observation deck offering panoramic city views.", image: "/images/newyorkesb_unsplash.jpg" },
  ],
  osaka: [
    { name: "Osaka Castle", description: "A striking castle set in a park famous for cherry blossoms in spring.", image: "/images/osakaoc_unsplash.jpg" },
    { name: "Dotonbori", description: "A neon-lit canal district bursting with street food stalls and giant signage.", image: "/images/osakadb_unsplash.jpg" },
    { name: "Tsutenkaku Tower", description: "A retro-futuristic obeservation tower in Shinsekai, once the tallest structure in Asia and now beloved symbol of old Osaka.", image: "/images/osakatto_unsplash.jpg" },
    { name: "Umeda Sky Building", description: "A twin-tower complex connected by a floating observatory with 360° views.", image: "/images/osakausb_unsplash.jpg" },
  ],
  kyoto: [
    { name: "Nara Park", description: "A sprawling park just outside Kyoto famous for its hundreds of free-roaming, bowing sika deer and the historic Todai-ji temple nearby.", image: "/images/kyotonara.jpg" },
    { name: "Kinkaku-ji", description: "The Golden Pavilion, a Zen temple gilded in gold leaf overlooking a still pond.", image: "/images/kyotogp_unsplash.jpg" },
    { name: "Arashiyama Bamboo Grove", description: "A soaring bamboo forest path just outside the city center.", image: "/images/kyotoabg_unsplash.jpg" },
    { name: "Gion District", description: "Kyoto's historic geisha quarter, lined with traditional wooden machiya houses.", image: "/images/kyotogd_unsplash.jpg" },
  ],
};

export function getAttractionsFor(place: string): Attraction[] {
    
    return MOCK_DATA[place.toLowerCase()] ?? [];
}