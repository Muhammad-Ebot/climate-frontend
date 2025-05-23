// components/weather/ThreeDayOutlook.jsx
export default function ThreeDayOutlook({ data, unit }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">3-Day Outlook</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((day, index) => (
            <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-lg mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {day.maxTemp}{unit === 'metric' ? '°C' : '°F'}
                </div>
                <div className="text-gray-500">
                  {day.minTemp}{unit === 'metric' ? '°C' : '°F'}
                </div>
              </div>
              <div className="mt-2 text-gray-600">{day.condition}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>Precip: {day.precipitation}{unit === 'metric' ? 'mm' : 'in'}</div>
                <div>Humidity: {day.humidity}%</div>
                <div>Wind: {day.windSpeed}{unit === 'metric' ? 'km/h' : 'mph'}</div>
                <div>UV: {day.uvIndex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }