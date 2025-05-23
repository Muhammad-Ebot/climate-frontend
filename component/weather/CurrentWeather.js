// components/weather/CurrentWeather.jsx
export default function CurrentWeather({ data, unit, location }) {
    // Open-Meteo API returns current weather data in current_weather property
    const current = data?.current_weather;
    
    // If no current weather data available
    if (!current) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
          <div className="text-gray-500">Current weather data not available</div>
        </div>
      );
    }
  
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Weather</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-4xl font-bold">
              {current.temperature}{unit === 'metric' ? '°C' : '°F'}
            </div>
            <div className="text-gray-600">Temperature</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {current.windspeed}{unit === 'metric' ? ' km/h' : ' mph'}
            </div>
            <div className="text-gray-600">Wind Speed</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold">
              {current.winddirection}°
            </div>
            <div className="text-gray-600">Wind Direction</div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Last updated: {new Date(current.time).toLocaleString()} • Location: {location?.name || `${location?.lat}, ${location?.lon}`}
        </div>
      </div>
    );
  }