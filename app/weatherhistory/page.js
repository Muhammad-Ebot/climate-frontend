"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import LocationSearch from '@/component/LocationSearch';
import DateRangePicker from '@/component/DatePicker';
import UnitToggle from '@/component/UnitToggle';
import WeatherChart from '@/component/WeatherChart';
import WeatherStatCards from '@/component/WeatherStatCards';
import WeatherTable from '@/component/WeatherTable';
import TabsBar from '@/component/TabsBar';
import PakistanGridsMap from '@/component/PakistanGridsMap';

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
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedGrid(null);
    
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
      
      // Set the selected grid for map highlighting
      setSelectedGrid({
        id: data.grid.grid_id,
        lat: data.grid.latitude,
        lng: data.grid.longitude,
        region: data.province
      });
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch weather data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [location, dateRange, unit]);

  useEffect(() => {
    if (location && dateRange.start && dateRange.end) {
      fetchWeatherData();
    }
  }, [location, dateRange, unit, fetchWeatherData]);

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
    <div className="min-h-screen bg-gray-50">
      <TabsBar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center space-x-3 mb-6 -mt-8">
          <h1 className="text-3xl font-bold text-gray-800">Weather History</h1>
        </div>
        
        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5s">
            <div>
              <LocationSearch location={location} setLocation={setLocation} />
            </div>
            <div className='mx-12 sm:mx-full'>
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            </div>
            <div>
              <UnitToggle unit={unit} setUnit={setUnit} />
            </div>
          </div>
          
          {location && dateRange.start && dateRange.end && (
            <div className="mb-2">
              <h2 className="text-xl font-semibold">
                {location.name || `${formatCoordinate(location.lat)}, ${formatCoordinate(location.lon)}`}
              </h2>
              <p className="text-gray-600">
                {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded">
            <p className="font-medium">Error loading data:</p>
            <p>{error}</p>
            {location && selectedGrid && (
              <button 
                onClick={fetchWeatherData}
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            )}
          </div>
        )}
        
        {/* Data Display */}
        {!isLoading && !error && weatherData && (
          <>
            {/* Weather Stats Cards */}
            <WeatherStatCards metrics={weatherStats} className="mb-8" />
            
            {/* Weather Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Temperature, Precipitation and Evaporation</h2>
              <div className="h-auto">
                <WeatherChart data={weatherData.weather} unit={unit} />
              </div>
            </div>
            
            {/* Weather Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Detailed Daily Data</h2>
              <div className="overflow-x-auto">
                <WeatherTable data={weatherData.weather} unit={unit} />
              </div>
            </div>
            
            {/* Location Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Grid ID:</span> {weatherData.grid?.grid_id || 'N/A'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Coordinates:</span> {formatCoordinate(weatherData.grid?.latitude)}, {formatCoordinate(weatherData.grid?.longitude)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Province:</span> {weatherData.province || weatherData.grid?.province || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Interactive Map */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Pakistan Grid Map</h2>
              <div className="h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                <PakistanGridsMap 
                  selectedGrid={selectedGrid}
                  weatherData={weatherData ? [weatherData] : []}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}