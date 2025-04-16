// component/WeatherChart.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart } from 'recharts';

export default function WeatherChart({ data, unit }) {
  // Sort data by date chronologically
  console.log("data:", data)
  if (!data || !Array.isArray(data)) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        {!data ? 'Loading data...' : 'No weather data available'}
      </div>
    );
  }
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Format dates for display
  const formattedData = sortedData.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <div className="flex flex-col h-full">
        {/* Temperature Chart */}
        <div className="h-2/3 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis 
                yAxisId="temp" 
                orientation="left" 
                label={{ value: unit === 'metric' ? '°C' : '°F', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="temp" 
                type="monotone" 
                dataKey="temperature_2m_max" 
                name="Max Temp" 
                stroke="#ff4d4d" 
                dot={false} 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="temp" 
                type="monotone" 
                dataKey="temperature_2m_min" 
                name="Min Temp" 
                stroke="#4d79ff" 
                dot={false} 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="temp" 
                type="monotone" 
                dataKey="temperature_2m_mean" 
                name="Mean Temp" 
                stroke="#ff9900" 
                dot={false} 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Precipitation Chart */}
        <div className="h-1/3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis 
                label={{ value: unit === 'metric' ? 'mm' : 'in', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="precipitation_sum" name="Precipitation" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ResponsiveContainer>
  );
}