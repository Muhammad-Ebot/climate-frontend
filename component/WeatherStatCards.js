// components/WeatherStatCards.jsx
import { useState, useEffect } from 'react';

export default function WeatherStatCards({ metrics }) {
  const [animatedValues, setAnimatedValues] = useState({});

  // Animate values on mount
  useEffect(() => {
    if (metrics) {
      metrics.forEach((metric, index) => {
        setTimeout(() => {
          setAnimatedValues(prev => ({
            ...prev,
            [index]: metric.value
          }));
        }, index * 200);
      });
    }
  }, [metrics]);

  // Get weather symbol based on label
  const getWeatherSymbol = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('temp')) return '🌡️';
    if (labelLower.includes('humid')) return '💧';
    if (labelLower.includes('wind')) return '💨';
    if (labelLower.includes('rain') || labelLower.includes('precip')) return '🌧️';
    if (labelLower.includes('pressure')) return '🌊';
    if (labelLower.includes('uv')) return '☀️';
    if (labelLower.includes('visibility')) return '👁️';
    return '📊'; // default
  };

  // Get weather type for styling
  const getWeatherType = (label) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('temp')) return 'temperature';
    if (labelLower.includes('humid')) return 'humidity';
    if (labelLower.includes('wind')) return 'wind';
    if (labelLower.includes('rain') || labelLower.includes('precip')) return 'precipitation';
    return 'default';
  };

  const getSymbolAnimation = (type) => {
    switch(type) {
      case 'temperature':
        return 'animate-pulse';
      case 'precipitation':
        return 'animate-bounce';
      case 'wind':
        return 'animate-ping';
      case 'humidity':
        return '';
      default:
        return '';
    }
  };

  const getBackgroundColor = (type) => {
    switch(type) {
      case 'temperature':
        return 'bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100';
      case 'precipitation':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100';
      case 'wind':
        return 'bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100';
      case 'humidity':
        return 'bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100';
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200';
    }
  };

  const getBorderColor = (type) => {
    switch(type) {
      case 'temperature':
        return 'border-orange-200 hover:border-orange-300';
      case 'precipitation':
        return 'border-blue-200 hover:border-blue-300';
      case 'wind':
        return 'border-green-200 hover:border-green-300';
      case 'humidity':
        return 'border-indigo-200 hover:border-indigo-300';
      default:
        return 'border-gray-200 hover:border-gray-300';
    }
  };

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 my-6">
      {metrics.map((metric, index) => {
        const weatherType = getWeatherType(metric.label);
        const symbol = getWeatherSymbol(metric.label);
        
        return (
          <div
            key={index}
            className={`
              ${getBackgroundColor(weatherType)}
              ${getBorderColor(weatherType)}
              rounded-xl border-2 p-4 flex-1 min-w-[140px]
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-lg
              cursor-pointer group
              flex flex-col items-center justify-center
            `}
            style={{
              opacity: animatedValues[index] !== undefined ? 1 : 0.7,
              transform: animatedValues[index] !== undefined ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.5s ease-out'
            }}
          >
            {/* Symbol with animation */}
            <div className="flex items-center justify-between w-full mb-3">
              <div 
                className={`text-2xl ${getSymbolAnimation(weatherType)} group-hover:scale-110 transition-transform duration-300`}
              >
                {symbol}
              </div>
              
              {/* Indicator dot */}
              <div className="w-2 h-2 rounded-full bg-current opacity-30"></div>
            </div>

            {/* Label */}
            <div className="text-gray-600 text-sm mb-2 text-center">
              {metric.label}
            </div>

            {/* Value with counter animation */}
            <div className="flex items-baseline justify-center">
              <span className="text-3xl font-semibold text-gray-700 tabular-nums">
                {animatedValues[index] !== undefined ? 
                  (typeof metric.value === 'number' ? Math.round(animatedValues[index] * 10) / 10 : metric.value) : 
                  metric.value}
              </span>
              <span className="text-gray-700 ml-1">
                {metric.unit}
              </span>
            </div>

            {/* Dynamic visualizations based on weather type */}
            {weatherType === 'humidity' && typeof metric.value === 'number' && (
              <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-indigo-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animatedValues[index] ? `${Math.min(animatedValues[index], 100)}%` : '0%'
                  }}
                ></div>
              </div>
            )}
            
            {weatherType === 'wind' && (
              <div className="mt-2 flex justify-center">
                <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {weatherType === 'temperature' && typeof metric.value === 'number' && (
              <div className="mt-3 flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-500 ${
                      animatedValues[index] && (Math.abs(animatedValues[index]) / 10) >= bar
                        ? 'bg-orange-400 h-3'
                        : 'bg-gray-200 h-2'
                    }`}
                    style={{ transitionDelay: `${bar * 100}ms` }}
                  ></div>
                ))}
              </div>
            )}

            {weatherType === 'precipitation' && animatedValues[index] > 0 && (
              <div className="mt-2 flex justify-center space-x-1">
                {[1, 2, 3].map((drop) => (
                  <div
                    key={drop}
                    className="w-1 h-2 bg-blue-400 rounded-full animate-pulse"
                    style={{ 
                      animationDelay: `${drop * 0.3}s`,
                      animationDuration: '1.5s'
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}