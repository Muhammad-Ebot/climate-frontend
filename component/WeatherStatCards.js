// components/WeatherStatCards.jsx
export default function WeatherStatCards({ metrics }) {
    return (
      <div className="flex flex-wrap gap-4 my-6">
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-sm flex-1 min-w-[140px] p-4 flex flex-col items-center justify-center"
          >
            <div className="text-gray-500 text-sm mb-1">{metric.label}</div>
            <div className="text-3xl font-semibold text-gray-700">
              {metric.value}<span className="text-gray-700">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }