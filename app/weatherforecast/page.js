import React from "react";
import { mockWeatherData } from "./mockWeatherData";

export default function WeatherPage() {
  const { location, current, daily } = mockWeatherData;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Location Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">{`Weather in ${location.name}`}</h1>
        <p className="text-gray-500">
          {location.lat}° N, {location.lon}° E
        </p>
      </div>

      {/* Current Weather */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex justify-between items-center">
        <div>
          <p className="text-2xl font-semibold">{current.date} - {current.time}</p>
          <p className="text-5xl font-bold">{current.temperature}°C</p>
          <p className="text-gray-600 text-xl">{current.condition}</p>
        </div>
        <div className="text-6xl">{current.icon}</div>
      </div>

      {/* Daily Forecast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {daily.map((day, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="font-semibold">{day.day}</p>
            <div className="text-3xl">{day.icon}</div>
            <p className="text-sm text-gray-600">{day.condition}</p>
            <p className="text-lg font-bold">{day.tempMax}° / {day.tempMin}°</p>
          </div>
        ))}
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Humidity" value={`${current.humidity}%`} />
        <StatCard label="Wind Speed" value={`${current.windSpeed} km/h`} />
        <StatCard label="Pressure" value={`${current.pressure} hPa`} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
