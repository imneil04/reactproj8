export interface Attraction {
    name: string;
    description: string;
}

const MOCK_DATA: Record<string, Attraction[]> = {
  tokyo: [
    { name: "Senso-ji Temple", description: "Tokyo's oldest temple, known for its iconic Thunder Gate and lantern-lined approach." },
    { name: "Shibuya Crossing", description: "The world's busiest pedestrian crossing, framed by neon signage and skyscrapers." },
    { name: "Tokyo Tower", description: "A red-and-white broadcast tower with sweeping views across the city skyline." },
    { name: "Meiji Shrine", description: "A tranquil forested shrine dedicated to Emperor Meiji, tucked away near Harajuku." },
  ],
  paris: [
    { name: "Eiffel Tower", description: "The iron lattice landmark that defines the Paris skyline, best seen at sunset." },
    { name: "Louvre Museum", description: "The world's largest art museum, home to the Mona Lisa and countless masterpieces." },
    { name: "Notre-Dame Cathedral", description: "A Gothic masterpiece on the Île de la Cité, still under restoration after the 2019 fire." },
    { name: "Montmartre", description: "A hilltop artists' quarter crowned by the white domes of Sacré-Cœur." },
  ],
  "new york": [
    { name: "Central Park", description: "An 843-acre green escape in the middle of Manhattan, ideal for a walk or picnic." },
    { name: "Statue of Liberty", description: "The iconic copper statue standing on Liberty Island, reachable by ferry." },
    { name: "Times Square", description: "A dazzling, ever-lit intersection packed with billboards, theaters, and crowds." },
    { name: "Empire State Building", description: "An Art Deco skyscraper with an observation deck offering panoramic city views." },
  ],
  osaka: [
    { name: "Osaka Castle", description: "A striking castle set in a park famous for cherry blossoms in spring." },
    { name: "Dotonbori", description: "A neon-lit canal district bursting with street food stalls and giant signage." },
    { name: "Shitennoji Temple", description: "One of Japan's oldest Buddhist temples, founded in 593 AD." },
    { name: "Umeda Sky Building", description: "A twin-tower complex connected by a floating observatory with 360° views." },
  ],
  kyoto: [
    { name: "Fushimi Inari Shrine", description: "Famous for its thousands of vermilion torii gates winding up the mountainside." },
    { name: "Kinkaku-ji", description: "The Golden Pavilion, a Zen temple gilded in gold leaf overlooking a still pond." },
    { name: "Arashiyama Bamboo Grove", description: "A soaring bamboo forest path just outside the city center." },
    { name: "Gion District", description: "Kyoto's historic geisha quarter, lined with traditional wooden machiya houses." },
  ],
};

export function getAttractionsFor(place: string): Attraction[] {
    
    return MOCK_DATA[place.toLowerCase()] ?? [];
}