import React from "react";

const iconMap = {
  "01d": "☀️", // 晴天
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

export default function WeatherIcon({ code }) {
  const icon = iconMap[code] || "❓";

  return (
    <div
      aria-label="weather-icon"
      style={{ fontSize: "4rem", animation: "bounce 1.5s infinite ease-in-out" }}
      className="text-yellow-400"
    >
      {icon}
    </div>
  );
}
