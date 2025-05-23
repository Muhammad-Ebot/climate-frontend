{/*"use client";
import { useState, useEffect } from 'react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';
import CurrentWeather from '@/component/weather/CurrentWeather';
import ThreeDayOutlook from '@/component/weather/ThreeDayOutlook';
import HourlyForecast from '@/component/weather/HourlyForecast';
import LongTermOutlook from '@/component/weather/LongTermOutlook';
import UnitToggle from '@/component/UnitToggle';

export default function WeatherForecast() {
  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [threeDayForecast, setThreeDayForecast] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState(null);
  const [longTermForecast, setLongTermForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      fetchAllWeatherData();
    }
  }, [location, unit]);

  const fetchAllWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current weather from Open-Meteo API
      const currentResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m&temperature_unit=${unit === 'metric' ? 'celsius' : 'fahrenheit'}&windspeed_unit=${unit === 'metric' ? 'kmh' : 'mph'}`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Failed to fetch current weather data');
      }
      
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);

      // Fetch other forecasts from your Django backend
      const forecastsResponse = await fetch(
        `/api/weather-forecast?lat=${location.lat}&lon=${location.lon}&unit=${unit}`
      );
      
      if (!forecastsResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const forecastsData = await forecastsResponse.json();
      
      setThreeDayForecast(forecastsData.threeDay);
      setHourlyForecast(forecastsData.hourly);
      setLongTermForecast(forecastsData.longTerm);

    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        
          <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-16 mb-6">
            <div className="md:mr-6 max-w-[200px] text-sm">
              <LocationSearch location={location} setLocation={setLocation} />
            </div >
            <div className="max-w-[150px] text-sm"><UnitToggle unit={unit} setUnit={setUnit} /></div>
          </div>
        

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {location ? (
          <div className="space-y-6">
            {/* Current Weather 
            <div className="bg-white rounded-lg shadow-md p-6">
              <CurrentWeather 
                data={currentWeather} 
                unit={unit} 
                location={location} 
              />
            </div>*/}

            {/* 3-Day Outlook 
            {threeDayForecast && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <ThreeDayOutlook 
                  data={threeDayForecast} 
                  unit={unit} 
                />
              </div>
            )}*/}

            {/* Hourly Forecast 
            {hourlyForecast && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <HourlyForecast 
                  data={hourlyForecast} 
                  unit={unit} 
                />
              </div>
            )}*/}

            {/* Long Term Outlook 
            {longTermForecast && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <LongTermOutlook 
                  data={longTermForecast} 
                  unit={unit} 
                />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p className="text-blue-700">
              Enter location coordinates to view weather forecast.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}*/}