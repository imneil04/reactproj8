export interface DayForecast {
    
    date: string; //local calendar date, e.g "2026-10-31"
    weekday: string; //"sat"
    min: number;
    max: number;
    main: string; //openweather group: "Clear", "Clouds", "Rain"...
}

export interface WeatherData {

    temp: number;
    feelsLike: number;
    humidity: number;
    windKmh: number;
    main: string;
    condition: string; // "light rain"
    forecast: DayForecast[];
}

