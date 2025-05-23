// component/WeatherChart.js
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, Bar, BarChart, Area, AreaChart
} from 'recharts';

export default function WeatherChart({ data, unit }) {
  const [activeTab, setActiveTab] = useState('temperature');
  const [animatedData, setAnimatedData] = useState([]);
  const [showTabsHint, setShowTabsHint] = useState(true);
  
  // Add animation for horizontal bounce
  useEffect(() => {
    // Add animation for x-direction bounce
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-x {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(5px);
        }
      }
      .animate-bounce-x {
        animation: bounce-x 1s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Hide the tabs hint after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTabsHint(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;
    
    // Sort data by date chronologically
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Format dates for display
    const formattedData = sortedData.map(item => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
    
    // Animate data loading
    setAnimatedData([]);
    const timer = setTimeout(() => {
      setAnimatedData(formattedData);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [data]);
  
  if (!data || !Array.isArray(data)) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg shadow-sm">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">{!data ? 'Loading weather data...' : 'No weather data available'}</p>
        </div>
      </div>
    );
  }
  
  // Get min/max values for better chart scaling
  const tempMax = Math.max(...animatedData.map(d => d.temperature_2m_max || 0));
  const tempMin = Math.min(...animatedData.map(d => d.temperature_2m_min || 0));
  const tempBuffer = (tempMax - tempMin) * 0.2;
  
  // Custom tooltip to improve readability
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800">{label}</p>
          <div className="space-y-2 pt-2">
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="flex items-center">
                <span className="w-3 h-3 inline-block mr-2" style={{ backgroundColor: entry.color }}></span>
                <span className="font-medium">{entry.name}:</span>{' '}
                <span className="font-bold ml-1">
                  {entry.value?.toFixed(1) || 'N/A'} 
                  {activeTab === 'temperature' ? (unit === 'metric' ? '°C' : '°F') : 
                   (unit === 'metric' ? 'mm' : 'in')}
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend that's more interactive
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-sm font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
      {/* Tabs for switching between charts - Enhanced with clear visual indicators */}
      <div className="relative">
        {/* Add more prominent indicators to show there are multiple chart options */}
        <div className="absolute -top-6 left-0 w-full flex justify-center">
          <div className="bg-blue-600 text-white px-4 py-1 rounded-t-lg shadow-md text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
            3 Weather Views Available
          </div>
        </div>
        
        <div className="flex bg-gray-50 p-2 rounded-t-lg mt-6">
          <button 
            onClick={() => setActiveTab('temperature')}
            className={`flex-1 py-3 px-2 font-medium text-sm transition-all duration-200 rounded-lg flex items-center justify-center space-x-2
              ${activeTab === 'temperature' 
                ? 'bg-white text-blue-600 shadow-md transform -translate-y-1' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V14M12 22C15.866 22 19 18.866 19 15C19 12.2 16.6 9.8 15 8.5V4C15 2.9 14.1 2 13 2H11C9.9 2 9 2.9 9 4V8.5C7.4 9.8 5 12.2 5 15C5 18.866 8.13401 22 12 22Z" 
                stroke={activeTab === 'temperature' ? '#2563eb' : '#4b5563'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
            </svg>
            <span>Temperature</span>
            {activeTab === 'temperature' && <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Active</span>}
          </button>
          <button 
            onClick={() => setActiveTab('precipitation')}
            className={`flex-1 py-3 px-2 font-medium text-sm transition-all duration-200 rounded-lg flex items-center justify-center space-x-2
              ${activeTab === 'precipitation' 
                ? 'bg-white text-blue-600 shadow-md transform -translate-y-1' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 19C5.79086 19 4 17.2091 4 15C4 12 8 6 8 6C8 6 12 12 12 15C12 17.2091 10.2091 19 8 19Z" 
                stroke={activeTab === 'precipitation' ? '#2563eb' : '#4b5563'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
              <path d="M16 14C14.8954 14 14 13.1046 14 12C14 10.5 16 7 16 7C16 7 18 10.5 18 12C18 13.1046 17.1046 14 16 14Z" 
                stroke={activeTab === 'precipitation' ? '#2563eb' : '#4b5563'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
            </svg>
            <span>Precipitation</span>
            {activeTab === 'precipitation' && <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Active</span>}
          </button>
          <button 
            onClick={() => setActiveTab('evaporation')}
            className={`flex-1 py-3 px-2 font-medium text-sm transition-all duration-200 rounded-lg flex items-center justify-center space-x-2
              ${activeTab === 'evaporation' 
                ? 'bg-white text-blue-600 shadow-md transform -translate-y-1' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 21H17M7 21C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V19C19 20.1046 18.1046 21 17 21M7 21L17 21M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12M14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12M14 12C14 14 11 16 12 18C13 16 10 14 10 12" 
                stroke={activeTab === 'evaporation' ? '#2563eb' : '#4b5563'} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"/>
            </svg>
            <span>Evaporation</span>
            {activeTab === 'evaporation' && <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Active</span>}
          </button>
        </div>
        
        {/* Swipe indicator */}
        {showTabsHint && (
          <div className="flex justify-center items-center py-1 bg-white border-t border-b border-blue-100">
            <div className="flex items-center space-x-1 text-xs text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Swipe or tap tabs to view different weather data</span>
              <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 h-96">
        {/* Temperature Chart */}
        {activeTab === 'temperature' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="tempMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="tempMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4d79ff" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4d79ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                domain={[tempMin - tempBuffer, tempMax + tempBuffer]}
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ 
                  value: unit === 'metric' ? '°C' : '°F', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#6b7280', textAnchor: 'middle' } 
                }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Line 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
                type="monotone" 
                dataKey="temperature_2m_max" 
                name="Max Temp" 
                stroke="#ff4d4d" 
                fill="url(#tempMax)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, stroke: '#ff4d4d', strokeWidth: 2, fill: "white" }}
              />
              <Line 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
                type="monotone" 
                dataKey="temperature_2m_min" 
                name="Min Temp" 
                stroke="#4d79ff" 
                fill="url(#tempMin)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, stroke: '#4d79ff', strokeWidth: 2, fill: "white" }}
              />
              <Line 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
                type="monotone" 
                dataKey="temperature_2m_mean" 
                name="Mean Temp" 
                stroke="#ff9900" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, stroke: '#ff9900', strokeWidth: 2, fill: "white" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {/* Precipitation Chart */}
        {activeTab === 'precipitation' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="precipColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ 
                  value: unit === 'metric' ? 'mm' : 'in', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#6b7280', textAnchor: 'middle' } 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Bar 
                dataKey="precipitation_sum" 
                name="Precipitation" 
                fill="url(#precipColor)" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Evaporation Chart */}
        {activeTab === 'evaporation' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={animatedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="evapColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280' }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ 
                  value: unit === 'metric' ? 'mm' : 'in', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: '#6b7280', textAnchor: 'middle' } 
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Area
                type="monotone"
                dataKey="et0_fao_evapotranspiration"
                name="Evaporation"
                stroke="#8884d8"
                fill="url(#evapColor)"
                strokeWidth={3}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-in-out"
                dot={{ r: 4, strokeWidth: 2, fill: "white" }}
                activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Summary info */}
      {animatedData.length > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-t">
          <div className="flex flex-wrap justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <span className="font-medium mr-2">Period:</span>
              {animatedData[0]?.formattedDate} - {animatedData[animatedData.length-1]?.formattedDate}
            </div>
            {activeTab === 'temperature' && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Average:</span>
                {(animatedData.reduce((sum, item) => sum + (item.temperature_2m_mean || 0), 0) / animatedData.length).toFixed(1)}
                {unit === 'metric' ? '°C' : '°F'}
              </div>
            )}
            {activeTab === 'precipitation' && (
              <div className="flex items-center">
                <span className="font-medium mr-2">Total:</span>
                {animatedData.reduce((sum, item) => sum + (item.precipitation_sum || 0), 0).toFixed(1)}
                {unit === 'metric' ? 'mm' : 'in'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}