import { NextResponse } from "next/server";
import type { WeatherData, DayForecast } from "@/types/weather";

//endpoint
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface ForecastEntry {
  dt: number;
  main: { temp: number };
  weather: { main: string }[];
}

export async function GET(request: Request) {

    const place = new URL(request.url).searchParams.get("place")?.trim();
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!place) return NextResponse.json({ error: "Missing place" }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: "Weather not configured" }, { status: 500 });

    const query = `q=${encodeURIComponent(place)}&units=metric&appid=${apiKey}`;

    try {

          // cached for 10 minutes per place, which keeps API calls low
        const [currentRes, forecastRes] = await Promise.all([
            fetch(`${BASE_URL}/weather?${query}`, { next: { revalidate: 600 } }),
            fetch(`${BASE_URL}/forecast?${query}`, { next: { revalidate: 600 } }),
        ]);

        if (currentRes.status === 404) {
        return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }
        if (!currentRes.ok || !forecastRes.ok) {
        return NextResponse.json({ error: "Weather service unavailable" }, { status: 502 });
        }

        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        // shift timestamps into the place's local time (read the result with getUTC* / toISOString)
        const tz: number = forecast.city.timezone; // seconds offset from UTC
        const toLocal = (dt: number) => new Date((dt + tz) * 1000);
        const todayKey = toLocal(Math.floor(Date.now() / 1000)).toISOString().slice(0, 10);

         // group the 3-hour entries by local calendar date
        const byDay = new Map<string, ForecastEntry[]>();
        for (const entry of forecast.list as ForecastEntry[]) {
        const key = toLocal(entry.dt).toISOString().slice(0, 10);
        byDay.set(key, [...(byDay.get(key) ?? []), entry]);
        }

        // skip today (already covered by "current"), keep the next 3 days
        const days: DayForecast[] = [...byDay.entries()]
        .filter(([date]) => date !== todayKey)
        .slice(0, 3)
        .map(([date, entries]) => {
            const temps = entries.map((e) => e.main.temp);
            // the entry closest to midday represents the day's conditions
            const midday = entries.reduce((best, e) =>
            Math.abs(toLocal(e.dt).getUTCHours() - 12) <
            Math.abs(toLocal(best.dt).getUTCHours() - 12)
                ? e
                : best
            );
            return {
            date,
            weekday: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
                weekday: "short",
                timeZone: "UTC",
            }),
            min: Math.min(...temps),
            max: Math.max(...temps),
            main: midday.weather[0].main,
            };
        });

        const data: WeatherData = {
        temp: current.main.temp,
        feelsLike: current.main.feels_like,
        humidity: current.main.humidity,
        windKmh: current.wind.speed * 3.6, // m/s to km/h
        main: current.weather[0].main,
        condition: current.weather[0].description,
        forecast: days,
        };

        return NextResponse.json(data);


    }
    catch {
        return NextResponse.json({ error: "Weather service unavailable" }, { status: 502 });
    }
}