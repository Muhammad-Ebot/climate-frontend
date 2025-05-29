//app/Heavy-Rainfall/page.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { CloudRain, Droplets, Wind, Eye, RefreshCw, ChevronDown, ChevronUp, Info, AlertTriangle, Thermometer, Gauge, Calendar, Clock } from 'lucide-react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';

export default function HeavyRainfall() {
  const [location, setLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rainData, setRainData] = useState(null);
  const [gridInfo, setGridInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isDatePickerFocused, setIsDatePickerFocused] = useState(false);

  const fetchRainData = useCallback(async () => {
    if (!location || !selectedDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('lat', location.lat);
      params.append('lon', location.lon);
      params.append('date', selectedDate.toISOString().split('T')[0]);

      const response = await fetch(
        `https://climate-backend-7hx4.onrender.com/predict/predict-rainfall/?latitude=${location.lat}&longitude=${location.lon}&prediction_date=${selectedDate.toISOString().split('T')[0]}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch rainfall data');
      }

      const data = await response.json();
      
      if (data.status === "success" && data.hourly_predictions) {
        setRainData(data.hourly_predictions);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch rainfall data:', err);
    } finally {
      setLoading(false);
    }
  }, [location, selectedDate]);

  useEffect(() => {
    if (location && selectedDate) {
      fetchRainData();
    }
  }, [location, selectedDate, fetchRainData]);

  // Function to format weather values with units
  const formatValue = (value, unit = '') => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}${unit}`;
  };

  const getRainCategoryColor = (category) => {
    switch(category) {
      case 4: return '#0891b2'; // cyan-600
      case 3: return '#7c3aed'; // violet-600
      case 2: return '#4f46e5'; // indigo-600
      case 1: return '#2563eb'; // blue-600
      default: return '#6b7280'; // gray-500
    }
  };

  const getRainCategoryName = (category) => {
    switch(category) {
      case 4: return 'Torrential Rain';
      case 3: return 'Heavy Rain';
      case 2: return 'Moderate Rain';
      case 1: return 'Light Rain';
      default: return 'No Rain';
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!rainData) return [];
    
    return rainData.map(item => ({
      time: new Date(item.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      fullTime: new Date(item.date).toLocaleString(),
      humidity: item.relative_humidity_2m,
      cloudCover: item.cloud_cover_mid,
      windGusts: item.wind_gusts_10m,
      soilMoisture: item.soil_moisture_0_to_7cm * 100, // Convert to percentage
      rainCategory: item.rain_category,
      confidence: item.prediction_confidence * 100
    }));
  };

  const chartData = prepareChartData();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-800">{data.fullTime}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                <span className="font-medium">{entry.name}:</span> {entry.value}
                {entry.dataKey === 'humidity' || entry.dataKey === 'cloudCover' || entry.dataKey === 'confidence' ? '%' : 
                 entry.dataKey === 'windGusts' ? ' km/h' : 
                 entry.dataKey === 'soilMoisture' ? '%' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get formatted date display
  const getFormattedDate = () => {
    if (!selectedDate) return 'Select a date';
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get max date (7 days from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsBar />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="flex justify-center items-center mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3"
          >
            <CloudRain className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-900">
              Rainfall Forecast
            </h1>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-16 mb-6">
          <div className='lg:col-span-2'>
            <LocationSearch location={location} setLocation={setLocation} />
          </div>

          {/* Enhanced Date Picker */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative"
          >
            <label className="block text-gray-700 font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Forecast Date
            </label>
            
            <motion.div 
              className={`relative transition-all duration-300 ${
                isDatePickerFocused 
                  ? 'transform scale-105 shadow-lg' 
                  : 'shadow-md hover:shadow-lg'
              }`}
              whileHover={{ y: -2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl blur opacity-20"></div>
              
              <div className="relative bg-white rounded-xl border-2 border-transparent overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 transition-opacity duration-300 ${
                  isDatePickerFocused ? 'opacity-100' : 'opacity-0'
                }`} style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-white rounded-lg"></div>
                </div>
                
                <div className="relative p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: isDatePickerFocused ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Clock className="h-4 w-4 text-blue-500" />
                      </motion.div>
                      <span className="text-sm font-medium text-gray-600">
                        {selectedDate ? 'Selected:' : 'Choose date:'}
                      </span>
                    </div>
                    
                    {selectedDate && (
                      <motion.span 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium"
                      >
                        Valid
                      </motion.span>
                    )}
                  </div>
                  
                  <input 
                    type="date"
                    min={getTodayDate()}
                    max={getMaxDate()}
                    className={`w-full px-4 py-3 border-2 rounded-lg text-gray-700 font-medium transition-all duration-300 focus:outline-none focus:ring-0 ${
                      isDatePickerFocused 
                        ? 'border-transparent bg-gradient-to-r from-blue-50 to-purple-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    onFocus={() => setIsDatePickerFocused(true)}
                    onBlur={() => setIsDatePickerFocused(false)}
                  />
                  
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: selectedDate ? 'auto' : 0, 
                      opacity: selectedDate ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-blue-800">
                          {getFormattedDate()}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-xs text-blue-600">
                        {selectedDate && (
                          <>
                            {Math.ceil((selectedDate - new Date()) / (1000 * 60 * 60 * 24))} days from today
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                    <span>📅 7-day forecast available</span>
                    {selectedDate && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(null)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Quick Date Selection Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-4 flex space-x-2"
            >
              {[0, 1, 2].map((days) => {
                const date = new Date();
                date.setDate(date.getDate() + days);
                const label = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`;
                
                return (
                  <motion.button
                    key={days}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                      selectedDate && selectedDate.toDateString() === date.toDateString()
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
                    }`}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <CloudRain className="h-5 w-5 mr-2 text-blue-500" />
                  Prediction Analytics
                </h2>
              </div>
              
              {loading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <span className="ml-3">Loading rainfall data...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p className="font-medium">Error loading data:</p>
                  <p>{error}</p>
                  {location && selectedDate && (
                    <button 
                      onClick={fetchRainData}
                      className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {(!location || !selectedDate) && !loading && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-blue-700">
                    {!location ? 'Enter location coordinates' : 'Select a date'} to view rainfall forecast.
                  </p>
                </div>
              )}

              {rainData && (
                <div className="p-5">
                  {gridInfo && (
                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      {gridInfo}
                    </div>
                  )}
                  
                  {/* Enhanced Data Table */}
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloud Cover (%)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Gusts (km/h)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soil Moisture (m³/m³)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rain Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {rainData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {new Date(row.date).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                                {formatValue(row.relative_humidity_2m)}
                              </div>
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="h-2.5 rounded-full bg-gray-500"
                                    style={{ width: `${row.cloud_cover_mid}%` }}
                                  ></div>
                                </div>
                                {/*formatValue(row.cloud_cover_mid)*/}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <Wind className="h-4 w-4 mr-1 text-green-500" />
                                {formatValue(row.wind_gusts_10m)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatValue(row.soil_moisture_0_to_7cm)}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap text-sm">
                              <span 
                                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: getRainCategoryColor(row.rain_category) }}
                              >
                                {row.rain_category_label || 'No rain'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {row.prediction_confidence ? `${Math.round(row.prediction_confidence * 100)}%` : 'N/A'}
                              </div>
                            </td>
                            {/*<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                  <div 
                                    className="h-2.5 rounded-full bg-green-500"
                                    style={{ width: `${(row.prediction_confidence || 0) * 100}%` }}
                                  ></div>
                                </div>
                                {row.prediction_confidence ? `${Math.round(row.prediction_confidence * 100)}%` : 'N/A'}
                              </div>
                            </td>*/}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cloud and Rainfall Intensity Guide */}
          <div className="lg:col-span-1">
            <div className="mb-6 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CloudRain className="mr-2" size={20} />
                Cloud & Rainfall Intensity Guide
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 border-l-4 border-gray-400 rounded">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-bold text-sm">0</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Clear Sky</div>
                    <div className="text-xs text-gray-600">0-10% clouds</div>
                    <div className="text-xs text-gray-500">No rain</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">Partly Cloudy</div>
                    <div className="text-xs text-blue-600">10-50% clouds</div>
                    <div className="text-xs text-gray-500">Light rain possible</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-indigo-800">Mostly Cloudy</div>
                    <div className="text-xs text-indigo-600">50-80% clouds</div>
                    <div className="text-xs text-gray-500">Moderate rain likely</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-purple-50 border-l-4 border-purple-400 rounded">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-purple-800">Overcast</div>
                    <div className="text-xs text-purple-600">80-100% clouds</div>
                    <div className="text-xs text-gray-500">Heavy rain expected</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-cyan-50 border-l-4 border-cyan-500 rounded">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-cyan-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <div className="font-medium text-cyan-800">Stormy</div>
                    <div className="text-xs text-cyan-600">100% clouds</div>
                    <div className="text-xs text-gray-500">Torrential rainfall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}