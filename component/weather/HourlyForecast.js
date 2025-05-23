// components/weather/HourlyForecast.jsx
export default function HourlyForecast({ data, unit }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Hourly Forecast</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Temp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Feels Like</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Precip</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Humidity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Wind</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((hour, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {hour.temperature}{unit === 'metric' ? '°C' : '°F'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {hour.feelsLike}{unit === 'metric' ? '°C' : '°F'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {hour.precipitation}{unit === 'metric' ? 'mm' : 'in'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{hour.humidity}%</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {hour.windSpeed}{unit === 'metric' ? 'km/h' : 'mph'} {hour.windDirection}°
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">{hour.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }