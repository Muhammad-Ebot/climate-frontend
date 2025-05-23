//app/Heat-wave/page.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, MapPin, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';
import UnitToggle from '@/component/UnitToggle';

export default function HeatWaveForecast() {
  const [location, setLocation] = useState(null);
  const [heatData, setHeatData] = useState(null);
  const [gridInfo, setGridInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('metric'); // 'metric' = °C, 'imperial' = °F
  const [showChartView, setShowChartView] = useState(false);
  const [heatWaveDays, setHeatWaveDays] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const fetchHeatData = useCallback(async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/predict/heatwave/?lat=${location.lat}&lon=${location.lon}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch heat wave data');
      }

      const data = await response.json();
      setHeatData(data.predictions);
      setGridInfo(
        data.grid_info || `Using nearest grid at (${location.lat.toFixed(5)}, ${location.lon.toFixed(5)})`
      );
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch heat wave data:', err);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      fetchHeatData();
    }
  }, [location, unit, fetchHeatData]);

  useEffect(() => {
    if (heatData) {
      const count = heatData.filter(
        day => day.heatwave_prediction === 1 || day.heatwave_prediction === '1'
      ).length;
      setHeatWaveDays(count);
    }
  }, [heatData]);

  const formatTemperature = (tempCelsius) => {
    if (tempCelsius === null || tempCelsius === undefined) return 'N/A';

    const value =
      unit === 'metric' ? tempCelsius : (tempCelsius * 9) / 5 + 32;

    return `${value.toFixed(1)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  const getTemperatureValue = (tempCelsius) => {
    if (tempCelsius === null || tempCelsius === undefined) return null;
    return unit === 'metric' ? tempCelsius : (tempCelsius * 9) / 5 + 32;
  };

  const getChartData = () => {
    if (!heatData) return [];
    
    return heatData.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      temperature: getTemperatureValue(day.temperature_2m_mean),
      heatwave: day.heatwave_prediction === 1 || day.heatwave_prediction === '1' ? 1 : 0,
      fullDate: new Date(day.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }));
  };

  const getSeverityLevel = () => {
    if (!heatData) return 'low';
    const totalDays = heatData.length;
    const percentage = (heatWaveDays / totalDays) * 100;
    
    if (percentage > 50) return 'severe';
    if (percentage > 20) return 'moderate';
    return 'low';
  };

  const severityLevelBackground = {
    low: 'bg-gradient-to-r from-green-100 to-green-50',
    moderate: 'bg-gradient-to-r from-yellow-100 to-yellow-50',
    severe: 'bg-gradient-to-r from-red-100 to-red-50'
  };

  const severityLevelText = {
    low: 'text-green-800',
    moderate: 'text-yellow-800',
    severe: 'text-red-800'
  };

  const severityLevelBorder = {
    low: 'border-green-300',
    moderate: 'border-yellow-300',
    severe: 'border-red-300'
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isHeatwave = payload[1].value === 1;
      return (
        <div className="bg-white p-4 shadow-lg rounded border border-gray-200">
          <p className="font-bold">{payload[0].payload.fullDate}</p>
          <p className={`text-sm ${isHeatwave ? 'text-red-600' : 'text-green-600'}`}>
            Temperature: {payload[0].value.toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p className={`text-sm font-medium ${isHeatwave ? 'text-red-600' : 'text-green-600'}`}>
            {isHeatwave ? 'Heat Wave Expected' : 'Normal Conditions'}
          </p>
        </div>
      );
    }
    return null;
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
            <Thermometer className="text-red-500" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-black">
              Heat Wave Forecast
            </h1>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <motion.div 
              whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <LocationSearch location={location} setLocation={setLocation} />
              {gridInfo && (
                <div className="mt-2 flex items-start space-x-2">
                  <Info size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{gridInfo}</p>
                </div>
              )}
            </motion.div>
          </div>
          
          <div>
            <motion.div 
              whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <UnitToggle unit={unit} setUnit={setUnit} />
            </motion.div>
          </div>
        </div>

        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center h-64"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-16 w-16 border-4 border-t-red-500 border-r-red-300 border-b-red-200 border-l-red-400 rounded-full"
            />
            <span className="mt-4 text-gray-600">Loading heat wave data...</span>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-lg shadow-md"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="flex-shrink-0" />
              <div>
                <p className="font-medium text-lg">Error loading data:</p>
                <p>{error}</p>
                {location && (
                  <button
                    onClick={fetchHeatData}
                    className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg shadow-sm hover:bg-red-200 transition-colors duration-200"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {!location && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 rounded-lg shadow-md"
          >
            <div className="flex items-start space-x-3">
              <MapPin className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-blue-700 font-medium">Location not selected</p>
                <p className="text-blue-600 mt-1">
                  Please enter location coordinates above to view heat wave forecast information.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {heatData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Summary Card */}
            <motion.div 
              whileHover={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
              className={`mb-6 p-6 rounded-xl shadow-md border ${severityLevelBorder[getSeverityLevel()]} ${severityLevelBackground[getSeverityLevel()]}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-2xl font-bold mb-2 ${severityLevelText[getSeverityLevel()]}`}>
                    {heatWaveDays > 0 
                      ? `Heat Wave Alert: ${heatWaveDays} day${heatWaveDays > 1 ? 's' : ''} of extreme heat expected`
                      : 'No Heat Waves Expected'}
                  </h2>
                  <p className="text-gray-700">
                    {heatWaveDays > 0 
                      ? `Our forecast shows ${heatWaveDays} out of ${heatData.length} days with potential heat wave conditions.` 
                      : 'Our forecast shows normal temperature patterns for the upcoming period.'}
                  </p>
                </div>
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="bg-white p-2 rounded-full shadow-sm"
                >
                  {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Toggle between chart and table view */}
            {expanded && (
              <>
                <div className="flex justify-end mb-4">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setShowChartView(false)}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 ${!showChartView ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600'}`}
                    >
                      Table View
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowChartView(true)}
                      className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 ${showChartView ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600'}`}
                    >
                      Chart View
                    </button>
                  </div>
                </div>

                {showChartView ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Temperature Forecast</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={getChartData()}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF9843" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FF9843" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorHeatwave" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF5A5A" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#FF5A5A" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis 
                            label={{ 
                              value: `Temperature (°${unit === 'metric' ? 'C' : 'F'})`, 
                              angle: -90, 
                              position: 'insideLeft',
                              style: { textAnchor: 'middle' }
                            }} 
                          />
                          <Tooltip content={customTooltip} />
                          <Area 
                            type="monotone" 
                            dataKey="temperature" 
                            stroke="#FF9843" 
                            fillOpacity={1} 
                            fill="url(#colorTemp)" 
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="heatwave" 
                            stroke="#FF5A5A" 
                            fillOpacity={0.3} 
                            fill="url(#colorHeatwave)" 
                            isAnimationActive={true}
                            animationDuration={1500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex justify-center space-x-6">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-orange-400 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Temperature</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Heat Wave Days</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200"
                  >
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mean Temperature
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Heat Wave Prediction
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {heatData.map((row, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={
                                row.heatwave_prediction === 1 || row.heatwave_prediction === '1'
                                  ? 'bg-red-50 hover:bg-red-100 transition-colors duration-150'
                                  : 'bg-green-50 hover:bg-green-100 transition-colors duration-150'
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(row.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex items-center">
                                  <Thermometer size={16} className="mr-2 text-orange-500" />
                                  {formatTemperature(row.temperature_2m_mean)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {row.heatwave_prediction === 1 || row.heatwave_prediction === '1' ? (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 inline-flex items-center">
                                    <AlertTriangle size={14} className="mr-1" />  
                                    Heat Wave Expected
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    No Heat Wave
                                  </span>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}