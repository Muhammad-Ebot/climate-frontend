// components/weather/LongTermOutlook.jsx
export default function LongTermOutlook({ data, unit }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">14-Day Outlook</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
          {data.map((day, index) => (
            <div key={index} className="border rounded-lg p-2 text-center">
              <div className="font-medium">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div className="my-2">
                <div className="text-xl font-bold">
                  {day.maxTemp}{unit === 'metric' ? '°C' : '°F'}
                </div>
                <div className="text-sm text-gray-500">
                  {day.minTemp}{unit === 'metric' ? '°C' : '°F'}
                </div>
              </div>
              <div className="text-sm text-gray-600">{day.condition}</div>
              <div className="text-xs mt-1">
                <span className="text-blue-500">{day.precipitationChance}%</span> • 
                <span className="text-gray-500"> {day.precipitation}{unit === 'metric' ? 'mm' : 'in'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }