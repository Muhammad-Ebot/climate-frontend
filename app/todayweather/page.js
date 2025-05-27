//app/Todayweather/page.js
"use client";

import { useState, useEffect } from 'react';
import TabsBar from '@/component/TabsBar';
import LocationSearch from '@/component/LocationSearch';
import UnitToggle from '@/component/UnitToggle';
import dynamic from 'next/dynamic';

// Lazy-load the map component
const WeatherMap = dynamic(() => import('@/component/WeatherMap'), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">Loading map...</div>
});

export default function TodayWeather() {
  const [location, setLocation] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch current weather from OpenMeteo API
        const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=1`;
        
        // Fetch air quality data
        const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
        
        const [weatherResponse, airQualityResponse] = await Promise.all([
          fetch(currentWeatherUrl),
          fetch(airQualityUrl)
        ]);
        
        if (!weatherResponse.ok || !airQualityResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const weatherJson = await weatherResponse.json();
        const airQualityJson = await airQualityResponse.json();
        
        // Convert weather code to description
        const getWeatherDescription = (code) => {
          const weatherCodes = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
          };
          return weatherCodes[code] || 'Unknown';
        };
        
        // Get AQI description
        const getAQIDescription = (aqi) => {
          if (aqi <= 50) return { text: 'Good', color: 'text-green-500' };
          if (aqi <= 100) return { text: 'Moderate', color: 'text-yellow-500' };
          if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-500' };
          if (aqi <= 200) return { text: 'Unhealthy', color: 'text-red-500' };
          if (aqi <= 300) return { text: 'Very Unhealthy', color: 'text-purple-500' };
          return { text: 'Hazardous', color: 'text-red-800' };
        };
        
        // Get wind direction
        const getWindDirection = (degrees) => {
          const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
          return directions[Math.round(degrees / 22.5) % 16];
        };
        
        // Convert units if needed
        const tempCurrent = unit === 'metric' ? Math.round(weatherJson.current.temperature_2m) : Math.round(weatherJson.current.temperature_2m * 9/5 + 32);
        const tempFeelsLike = unit === 'metric' ? Math.round(weatherJson.current.apparent_temperature) : Math.round(weatherJson.current.apparent_temperature * 9/5 + 32);
        const windSpeed = unit === 'metric' ? Math.round(weatherJson.current.wind_speed_10m) : Math.round(weatherJson.current.wind_speed_10m * 0.621371);
        const windGusts = unit === 'metric' ? Math.round(weatherJson.current.wind_gusts_10m) : Math.round(weatherJson.current.wind_gusts_10m * 0.621371);
        
        const processedData = {
          current: {
            temp: tempCurrent,
            feels_like: tempFeelsLike,
            weather_condition: getWeatherDescription(weatherJson.current.weather_code),
            weather_code: weatherJson.current.weather_code,
            is_day: weatherJson.current.is_day,
            humidity: weatherJson.current.relative_humidity_2m,
            pressure: Math.round(weatherJson.current.pressure_msl),
            cloud_cover: weatherJson.current.cloud_cover,
            precipitation: weatherJson.current.precipitation || 0,
            wind: {
              speed: windSpeed,
              direction: getWindDirection(weatherJson.current.wind_direction_10m),
              direction_degrees: weatherJson.current.wind_direction_10m,
            },
            wind_gusts: windGusts,
            air_quality: {
              aqi: airQualityJson.current.us_aqi,
              description: getAQIDescription(airQualityJson.current.us_aqi),
              pm2_5: airQualityJson.current.pm2_5,
              pm10: airQualityJson.current.pm10,
              ozone: airQualityJson.current.ozone,
              no2: airQualityJson.current.nitrogen_dioxide,
              so2: airQualityJson.current.sulphur_dioxide,
              co: airQualityJson.current.carbon_monoxide
            }
          },
          location_name: location.name,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setWeatherData(processedData);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location, unit]);

  // Get weather icon based on weather code and time of day
  const getWeatherIcon = (code, isDay) => {
    if (code === 0) {
      return isDay ? '☀️' : '🌙';
    } else if (code >= 1 && code <= 3) {
      return isDay ? '⛅' : '☁️';
    } else if (code >= 45 && code <= 48) {
      return '🌫️';
    } else if (code >= 51 && code <= 65) {
      return '🌧️';
    } else if (code >= 71 && code <= 77) {
      return '🌨️';
    } else if (code >= 80 && code <= 82) {
      return '🌦️';
    } else if (code >= 95 && code <= 99) {
      return '⛈️';
    }
    return '☁️';
  };

  return (
    <div className="container mx-auto px-4 pb-8">
      <TabsBar />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column with search and unit toggle */}
        <div className="md:col-span-1 space-y-6">
          <LocationSearch location={location} setLocation={setLocation} />
          <UnitToggle unit={unit} setUnit={setUnit} />
        </div>
        
        {/* Right column with weather data */}
        <div className="md:col-span-2">
          {!location && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">
                Search for a location to see current weather
              </p>
            </div>
          )}
          
          {loading && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-lg text-gray-600">Loading weather data...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center border-l-4 border-red-500">
              <p className="text-lg text-red-600">{error}</p>
            </div>
          )}
          
          {weatherData && !loading && !error && (
            <div className="space-y-4">
              {/* Current weather card */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-gray-500 uppercase text-sm font-medium">CURRENT WEATHER</h2>
                  <span className="text-xs text-gray-500">{weatherData.timestamp}</span>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="text-6xl">
                      {getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day)}
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-6xl font-bold">
                      {weatherData.current.temp}°
                      <span className="text-lg font-normal">{unit === 'metric' ? 'C' : 'F'}</span>
                    </div>
                    <div className="text-gray-700">
                      Feels like {weatherData.current.feels_like}°
                    </div>
                    <div className="mt-1 text-gray-700">
                      {weatherData.current.weather_condition}
                    </div>
                  </div>
                  
                  <div className="ml-4 space-y-3">
                    <div className="text-right">
                      <div className="text-gray-600 text-sm">Wind</div>
                      <div className="font-medium">
                        {weatherData.current.wind.direction} {weatherData.current.wind.speed} {unit === 'metric' ? 'km/h' : 'mph'}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gray-600 text-sm">Humidity</div>
                      <div className="font-medium">{weatherData.current.humidity}%</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gray-600 text-sm">Pressure</div>
                      <div className="font-medium">{weatherData.current.pressure} hPa</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional weather details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Wind & Precipitation */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-500 uppercase text-sm font-medium mb-3">WIND & PRECIPITATION</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Wind Gusts</span>
                      <span className="font-medium">{weatherData.current.wind_gusts} {unit === 'metric' ? 'km/h' : 'mph'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precipitation</span>
                      <span className="font-medium">{weatherData.current.precipitation} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cloud Cover</span>
                      <span className="font-medium">{weatherData.current.cloud_cover}%</span>
                    </div>
                  </div>
                </div>

                {/* Air Quality */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-gray-500 uppercase text-sm font-medium mb-3">AIR QUALITY</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">AQI</span>
                      <span className={`font-medium ${weatherData.current.air_quality.description.color}`}>
                        {weatherData.current.air_quality.aqi} - {weatherData.current.air_quality.description.text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PM2.5</span>
                      <span className="font-medium">{Math.round(weatherData.current.air_quality.pm2_5)} μg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PM10</span>
                      <span className="font-medium">{Math.round(weatherData.current.air_quality.pm10)} μg/m³</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weather radar card */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-gray-500 uppercase text-sm font-medium mb-4">INTERACTIVE WEATHER MAP</h2>
                <div className="h-80 bg-gray-100 rounded-lg overflow-hidden">
                  <WeatherMap 
                    location={location} 
                    weatherData={weatherData}
                    unit={unit}
                  />
                </div>
                
                <div className="flex justify-center flex-wrap gap-4 mt-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span>Temperature</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                    <span>Wind</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                    <span>Pressure</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-2"></div>
                    <span>Humidity</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}