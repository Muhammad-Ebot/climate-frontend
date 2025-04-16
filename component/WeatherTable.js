// component/WeatherTable.js
export default function WeatherTable({ data, unit }) {
  // Sort data by date chronologically (newest to oldest)

  if (!data || !Array.isArray(data)) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        {!data ? 'Loading data...' : 'No weather data available'}
      </div>
    );
  }
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format temperature based on unit
  const formatTemp = (temp) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${temp.toFixed(1)}${unit === 'metric' ? '°C' : '°F'}`;
  };
  
  // Format precipitation based on unit
  const formatPrecip = (precip) => {
    if (precip === null || precip === undefined) return 'N/A';
    return `${precip.toFixed(1)} ${unit === 'metric' ? 'mm' : 'in'}`;
  };
  
  // Format wind speed based on unit
  const formatWindSpeed = (speed) => {
    if (speed === null || speed === undefined) return 'N/A';
    return `${speed.toFixed(1)} ${unit === 'metric' ? 'km/h' : 'mph'}`;
  };
  
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Temp</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Temp</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean Temp</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precipitation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Wind</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Gusts</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Direction</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Radiation Sum</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evapotranspiration</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedData.map((day, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(day.date)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTemp(day.temperature_2m_max)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTemp(day.temperature_2m_min)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTemp(day.temperature_2m_mean)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrecip(day.precipitation_sum)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWindSpeed(day.wind_speed_10m_max)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatWindSpeed(day.wind_gusts_10m_max)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.wind_direction_10m_dominant || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.shortwave_radiation_sum?.toFixed(1) || 'N/A'}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.et0_fao_evapotranspiration?.toFixed(1) || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}