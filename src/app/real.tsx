'use client';

import { useEffect, useState, useRef } from 'react';
import debounce from 'lodash.debounce';
import { fetchCurrentWeather, fetchForecast } from '@/lib/weather';
import {
  getSearchHistory,
  saveSearchHistory,
  deleteSearchHistory,
} from '@/lib/history';

type Location = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

type WeatherData = {
  main: { temp: number; humidity: number; temp_min: number; temp_max: number };
  wind: { speed: number };
  weather: { main: string; icon: string; description: string }[];
  coord: { lon: number; lat: number };
  name: string;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (q: string) => {
    if (!q) return;
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    const data = await res.json();
    setSuggestions(data);
  }, 500);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setQuery(value);
  if (!value.trim()) {
    setSuggestions([]); // Clear suggestions when input is empty
    return;
  }
  handleSearch(value);
};

// close suggestions dropdown when user clicks outside search input field
const inputRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setSuggestions([]); // Close dropdown
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);



  const handleSelect = async (loc: Location) => {
    const locationName = `${loc.name}, ${loc.country}`;
    setQuery(locationName);
    setSuggestions([]);

    setLoading(true);

    try {
      const current = await fetchCurrentWeather(loc.lat, loc.lon);
      const forecastData = await fetchForecast(loc.lat, loc.lon);

      setWeather(current);
      setForecast(filterForecastByDay(forecastData));

      await saveSearchHistory(locationName, loc.lat, loc.lon);

      const updatedHistory = await getSearchHistory();
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSearchHistory(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleHistoryClick = async (item: any) => {
    setQuery(item.locationName);

    setLoading(true);
    try {
      const current = await fetchCurrentWeather(item.lat, item.lon);
      const forecastData = await fetchForecast(item.lat, item.lon);
      setWeather(current);
      setForecast(filterForecastByDay(forecastData));
    } catch (error) {
      console.error('Error fetching history weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const past = await getSearchHistory();
      setHistory(past);
    })();
  }, []);

  const filterForecastByDay = (data: any[]) => {
    const seenDates = new Set();
    return data.filter((entry) => {
      const date = entry.dt_txt.split(' ')[0];
      if (!seenDates.has(date)) {
        seenDates.add(date);
        return true;
      }
      return false;
    }).slice(0, 5);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Weather App</h1>

      {/* Search Input */}
      <div ref={inputRef} className="mb-4 relative">
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white"
          placeholder="Search for a city..."
          value={query}
          onChange={handleChange}
        />

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="border border-gray-600 rounded mt-1 bg-gray-700 shadow-md">
            {suggestions.map((loc, idx) => (
              <li
                key={idx}
                className="p-2 hover:bg-gray-600 cursor-pointer"
                onClick={() => handleSelect(loc)}
              >
                {loc.name}, {loc.country}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {/* Current Weather */}
      {!loading && weather && (
        <div className="mt-6 border rounded p-4 shadow bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">
            Current Weather in {weather.name}
          </h2>
        
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                // className="w-full h-full"
              />
              <div>
                <p className="text-2xl">{Math.round(weather.main.temp)}°C</p>
                <p className="font-bold">{weather.weather[0].main}</p>
                <p>{weather.weather[0].description}</p>
              </div>
            </div>
            <div>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Wind: {weather.wind.speed} m/s</p>
              <p>Min Temp: {weather.main.temp_min}°C</p>
              <p>Max Temp: {weather.main.temp_max}°C</p>
              <p>Longitude: {weather.coord.lon}</p>
              <p>Latitude: {weather.coord.lat}</p>
            </div>
          </div>
        </div>
      )}

      {/* Forecast */}
      {!loading && forecast.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">5-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {forecast.map((day, idx) => (
              <div
                key={idx}
                className="bg-gray-800 rounded shadow p-4 text-center"
              >
                <p className="font-medium mb-2">
                  {new Date(day.dt_txt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric', 
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  className="mx-auto"
                />
                <p className="text-xl mt-2">{Math.round(day.main.temp)}°C</p>
                <p className="text-sm">{day.weather[0].main}</p>
                <p className="text-xs">{day.weather[0].description}</p>
                <p className="text-xs mt-1">Humidity: {day.main.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {history.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">Recent Searches</h3>
          <ul className="space-y-2">
            {history.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 bg-gray-700 rounded"
              >
                <button
                  onClick={() => handleHistoryClick(item)}
                  className="text-blue-400 hover:underline text-left"
                >
                  {item.locationName}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
