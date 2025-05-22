import React, { useState, useEffect } from "react";
import WeatherIcon from "./components/WeatherIcon";
import { languages } from "./i18n";
import { motion, AnimatePresence } from "framer-motion";

const apiKey = "da7be22a064e8e36c8e9385be0d67fc4";

export default function App() {
  const [lang, setLang] = useState("ja");
  const t = languages[lang];

  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  // 加载城市数据
  useEffect(() => {
    fetch("/cities.json")
      .then((res) => res.json())
      .then(setCities)
      .catch(() => setCities([]));
  }, []);

  // 模糊搜索建议
  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = cities
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 10);
    setSuggestions(filtered);
  }, [query, cities]);

  // 获取天气
  async function fetchWeather(cityName) {
    setWeather(null);
    setError("");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        cityName
      )}&appid=${apiKey}&units=metric&lang=${lang}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(t.errorNotFound);
      const data = await res.json();
      setWeather(data);
      setSelectedCity(cityName);
    } catch (e) {
      setError(e.message);
    }
  }

  function onSelectCity(cityName) {
    setQuery(cityName);
    setSuggestions([]);
    fetchWeather(cityName);
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-400 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold select-none">{t.title}</h1>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-gray-300 rounded px-2"
            aria-label={t.languageLabel}
          >
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-xl border-2 border-blue-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
            placeholder={t.placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-autocomplete="list"
            aria-controls="suggestion-list"
          />
          {suggestions.length > 0 && (
            <ul
              id="suggestion-list"
              className="absolute bg-white border border-blue-300 rounded-xl w-full mt-1 max-h-52 overflow-auto z-10 shadow-lg"
            >
              {suggestions.map((city) => (
                <li
                  key={city.name}
                  onClick={() => onSelectCity(city.name)}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-500 hover:text-white transition"
                >
                  {city.name} ({city.country})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-8 min-h-[200px]">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-red-500 font-semibold text-center"
              >
                {error}
              </motion.div>
            )}
            {weather && (
              <motion.div
                key="weather"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold mb-2">
                  {weather.name} ({weather.sys.country})
                </h2>
                <WeatherIcon code={weather.weather[0].icon} />
                <p className="text-lg mt-2">
                  {weather.weather[0].description}
                </p>
                <p>
                  {weather.main.temp} °C
                </p>
                <p>
                  {t.humidity}: {weather.main.humidity}%
                </p>
                <p>
                  {t.wind}: {weather.wind.speed} m/s
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
