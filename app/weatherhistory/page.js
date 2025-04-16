// app/weatherhistory/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from '@/component/LocationSearch';
import DateRangePicker from '@/component/DateRangePicker';
import UnitToggle from '@/component/UnitToggle';
import WeatherChart from '@/component/WeatherChart';
import WeatherStatCards from '@/component/WeatherStatCards';
import WeatherTable from '@/component/WeatherTable';
import TabsBar from '@/component/TabsBar';

const formatCoordinate = (coord) => {
  if (coord === null || coord === undefined) return 'N/A';
  const num = Number(coord);
  return isNaN(num) ? 'N/A' : num.toFixed(4);
};

export default function WeatherHistory() {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [dateRange, setDateRange] = useState({ type: 'custom', start: null, end: null });
  const [unit, setUnit] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location && dateRange.start && dateRange.end) {
      fetchWeatherData();
    }
  }, [location, dateRange, unit]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('lat', location.lat);
      params.append('lon', location.lon);
      params.append('from', dateRange.start.toISOString().split('T')[0]);
      params.append('to', dateRange.end.toISOString().split('T')[0]);
      params.append('unit', unit);
      if (location.province) params.append('province', location.province);

      const response = await fetch(`/weatherhistory/api/weather-history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch weather data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const weatherStats = weatherData?.weather?.length > 0 ? [
    {
      label: 'Max Temperature',
      value: weatherData.weather.reduce((max, item) => 
        item.temperature_2m_max > max ? item.temperature_2m_max : max, -Infinity
      ).toFixed(1),
      unit: unit === 'metric' ? '°C' : '°F'
    },
    {
      label: 'Min Temperature',
      value: weatherData.weather.reduce((min, item) => 
        item.temperature_2m_min < min ? item.temperature_2m_min : min, Infinity
      ).toFixed(1),
      unit: unit === 'metric' ? '°C' : '°F'
    },
    {
      label: 'Total Precipitation',
      value: weatherData.weather.reduce((sum, item) => 
        sum + (item.precipitation_sum || 0), 0
      ).toFixed(1),
      unit: unit === 'metric' ? 'mm' : 'in'
    },
    {
      label: 'Avg Wind Speed',
      value: (weatherData.weather.reduce((sum, item) => 
        sum + (item.wind_speed_10m_max || 0), 0) / weatherData.weather.length
      ).toFixed(1),
      unit: unit === 'metric' ? 'km/h' : 'mph'
    }
  ] : [];

  return (
    <div>
      <TabsBar/>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Weather History</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-16 mb-6">
            <div className="md:mr-6 max-w-[200px] text-sm">
              <LocationSearch location={location} setLocation={setLocation} />
            </div>

            <div className='max-w-[300px] text-sm'>
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            </div>

            <div className="max-w-[150px] text-sm">
              <UnitToggle unit={unit} setUnit={setUnit} />
            </div>
          </div>
          
          {location && dateRange.start && dateRange.end && (
            <div className="mb-2">
              <h2 className="text-xl font-semibold">
                Weather History: {location.name || `${formatCoordinate(location.lat)}, ${formatCoordinate(location.lon)}`}
              </h2>
              <p className="text-gray-600">
                {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()} • {unit === "metric" ? "Metric" : "Imperial"} Units
              </p>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-8">
            {error}
          </div>
        ) : (
          <>
            {weatherStats && <WeatherStatCards metrics={weatherStats} />}
          
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Temperature & Precipitation</h2>
              <div className="h-96 mb-8">
                {weatherData && <WeatherChart data={weatherData.weather} unit={unit} />}
              </div>
              
              <h2 className="text-xl font-semibold mb-4">Detailed Daily Data</h2>
              <div className="overflow-x-auto">
                {weatherData && <WeatherTable data={weatherData.weather} unit={unit} />}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700"><span className="font-medium">Grid ID:</span> {weatherData?.grid?.grid_id || 'N/A'}</p>
                  <p className="text-gray-700"><span className="font-medium">Coordinates:</span> {weatherData?.grid ? `${formatCoordinate(weatherData.grid.latitude)}, ${formatCoordinate(weatherData.grid.longitude)}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-700"><span className="font-medium">Province:</span> {weatherData?.province || weatherData?.grid?.province || 'N/A'}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}