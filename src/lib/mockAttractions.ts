const mock_data: Record<string, string[]> = {
    tokyo: ["Senso-ji Temple", "Shibuya Crossing", "Tokyo Tower", "Meiji Shrine"],
    osaka: ["Tsutenkaku Tower", "Dotonbori", "Osaka Castle"],
    kyoto: ["Thousand Tori Gates", "Arashiyama Bamboo Forest", "Umeda Sky Building"],
    paris: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Montmartre"],
    "new york": ["Central Park", "Statue of Liberty", "Times Square", "Empire State Building"]
};

export function getAttractionsFor(place: string): string[] {
    return mock_data[place.toLowerCase()] ?? [];
}