// component/WeatherTable.js
import React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Droplets, Thermometer, Wind, Sun, Waves } from 'lucide-react';

export default function WeatherTable({ data, unit }) {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setIsLoading(false);
      sortData('date', 'desc');
    }
  }, [data]);

  const sortData = (key, initialDirection) => {
    let direction = initialDirection;
    
    if (sortConfig.key === key && !initialDirection) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    const sorted = [...(data || [])].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (a[key] === null || a[key] === undefined) return direction === 'asc' ? -1 : 1;
      if (b[key] === null || b[key] === undefined) return direction === 'asc' ? 1 : -1;
      
      return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
    });
    
    setSortedData(sorted);
    setSortConfig({ key, direction });
  };

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

  // Get color for temperature
  const getTempColor = (temp) => {
    if (temp === null || temp === undefined) return 'text-gray-500';
    if (unit === 'metric') {
      if (temp < 0) return 'text-blue-600';
      if (temp < 10) return 'text-blue-400';
      if (temp < 20) return 'text-green-500';
      if (temp < 30) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      if (temp < 32) return 'text-blue-600';
      if (temp < 50) return 'text-blue-400';
      if (temp < 68) return 'text-green-500';
      if (temp < 86) return 'text-yellow-500';
      return 'text-red-500';
    }
  };

  // Calculate precipitation intensity class
  const getPrecipClass = (precip) => {
    if (precip === null || precip === undefined) return 'text-gray-500';
    const threshold = unit === 'metric' ? 1 : 0.04; // 1mm or 0.04 inches
    
    if (precip === 0) return 'text-gray-500';
    if (precip < threshold) return 'text-blue-300';
    if (precip < threshold * 5) return 'text-blue-500';
    return 'text-blue-700';
  };

  // Get wind intensity class
  const getWindClass = (speed) => {
    if (speed === null || speed === undefined) return 'text-gray-500';
    const threshold = unit === 'metric' ? 20 : 12; // 20km/h or 12mph
    
    if (speed < threshold * 0.5) return 'text-gray-500';
    if (speed < threshold) return 'text-green-500';
    if (speed < threshold * 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="inline w-4 h-4 ml-1" /> 
      : <ChevronDown className="inline w-4 h-4 ml-1" />;
  };

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500 animate-pulse">
        Loading weather data...
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No weather data available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg shadow-lg border border-gray-200 transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => sortData('date')} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                Date <SortIcon columnKey="date" />
              </th>
              <th onClick={() => sortData('temperature_2m_mean')} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-center">
                  <Thermometer className="w-4 h-4 mr-1" />
                  Mean Temp <SortIcon columnKey="temperature_2m_mean" />
                </div>
              </th>
              <th onClick={() => sortData('precipitation_sum')} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 mr-1" />
                  Precipitation <SortIcon columnKey="precipitation_sum" />
                </div>
              </th>
              <th onClick={() => sortData('wind_speed_10m_max')} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                <div className="flex items-center">
                  <Wind className="w-4 h-4 mr-1" />
                  Max Wind <SortIcon columnKey="wind_speed_10m_max" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((day, index) => (
              <>
                <tr key={`row-${index}`} 
                    className={`hover:bg-gray-50 transition-colors duration-200 ${expandedRow === index ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(day.date)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getTempColor(day.temperature_2m_mean)}`}>
                    {formatTemp(day.temperature_2m_mean)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getPrecipClass(day.precipitation_sum)}`}>
                    <div className="flex items-center">
                      {formatPrecip(day.precipitation_sum)}
                      {day.precipitation_sum > 0 && (
                        <div className="ml-2 bg-blue-100 rounded-full p-1 relative overflow-hidden">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-300" 
                            style={{ 
                              height: `${Math.min(100, (day.precipitation_sum / (unit === 'metric' ? 10 : 0.4)) * 100)}%`,
                              opacity: 0.6
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getWindClass(day.wind_speed_10m_max)}`}>
                    {formatWindSpeed(day.wind_speed_10m_max)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={() => toggleRowExpand(index)}
                      className={`px-3 py-1 rounded-full text-xs font-medium 
                        ${expandedRow === index 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} 
                        transition-colors duration-200`}
                    >
                      {expandedRow === index ? 'Hide Details' : 'Show Details'}
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-blue-50 animate-fadeIn">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Wind className="w-4 h-4 mr-1" /> Wind Details
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Wind Gusts:</span>
                              <span className={`text-sm font-medium ${getWindClass(day.wind_gusts_10m_max)}`}>
                                {formatWindSpeed(day.wind_gusts_10m_max)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Direction:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {day.wind_direction_10m_dominant || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Sun className="w-4 h-4 mr-1" /> Radiation & Energy
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Radiation Sum:</span>
                              <span className="text-sm font-medium text-amber-600">
                                {day.shortwave_radiation_sum?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Waves className="w-4 h-4 mr-1" /> Water Metrics
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Evapotranspiration:</span>
                              <span className="text-sm font-medium text-cyan-600">
                                {day.et0_fao_evapotranspiration?.toFixed(1) || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}