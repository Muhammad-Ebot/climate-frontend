// app/weatherforecast/page.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Thermometer, CloudRain, Droplet, AlertTriangle, Info, RefreshCw, ChevronDown, ChevronUp, Wind, Sun, Droplets, Gauge, Calendar, Clock, MapPin } from 'lucide-react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';
import UnitToggle from '@/component/UnitToggle';

export default function WeatherForecast() {
  const [location, setLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    drought: null,
    heatwave: null,
    rainfall: null
  });
  const [loading, setLoading] = useState({
    drought: false,
    heatwave: false,
    rainfall: false
  });
  const [error, setError] = useState({
    drought: null,
    heatwave: null,
    rainfall: null
  });
  const [unit, setUnit] = useState('metric');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState({
    droughtInfo: false,
    heatwaveInfo: false,
    rainfallInfo: false
  });

  // Fetch all weather data
  const fetchWeatherData = useCallback(async () => {
    if (!location) return;

    try {
      // Fetch drought data
      setLoading(prev => ({ ...prev, drought: true }));
      setError(prev => ({ ...prev, drought: null }));
      const droughtRes = await fetch(
        `https://climate-backend-7hx4.onrender.com/predict/drought-forecast/?lat=${location.lat}&lon=${location.lon}`
      );
      if (!droughtRes.ok) throw new Error('Failed to fetch drought data');
      const droughtData = await droughtRes.json();

      // Fetch heatwave data
      setLoading(prev => ({ ...prev, heatwave: true }));
      setError(prev => ({ ...prev, heatwave: null }));
      const heatwaveRes = await fetch(
        `https://climate-backend-7hx4.onrender.com/predict/heatwave/?lat=${location.lat}&lon=${location.lon}`
      );
      if (!heatwaveRes.ok) throw new Error('Failed to fetch heatwave data');
      const heatwaveData = await heatwaveRes.json();

      // Fetch rainfall data
      setLoading(prev => ({ ...prev, rainfall: true }));
      setError(prev => ({ ...prev, rainfall: null }));
      const rainfallRes = await fetch(
        `https://climate-backend-7hx4.onrender.com/predict/predict-rainfall/?latitude=${location.lat}&longitude=${location.lon}&prediction_date=${selectedDate.toISOString().split('T')[0]}`
      );
      if (!rainfallRes.ok) throw new Error('Failed to fetch rainfall data');
      const rainfallData = await rainfallRes.json();

      setWeatherData({
        drought: droughtData.predictions,
        heatwave: heatwaveData.predictions,
        rainfall: rainfallData.hourly_predictions
      });
    } catch (err) {
      setError(prev => {
        const newErrors = { ...prev };
        if (err.message.includes('drought')) newErrors.drought = err.message;
        else if (err.message.includes('heatwave')) newErrors.heatwave = err.message;
        else if (err.message.includes('rainfall')) newErrors.rainfall = err.message;
        return newErrors;
      });
      console.error('Failed to fetch weather data:', err);
    } finally {
      setLoading({
        drought: false,
        heatwave: false,
        rainfall: false
      });
    }
  }, [location, selectedDate]);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location, selectedDate, fetchWeatherData]);

  // Helper functions
  const formatTemperature = (tempCelsius) => {
    if (tempCelsius === null || tempCelsius === undefined) return 'N/A';
    const value = unit === 'metric' ? tempCelsius : (tempCelsius * 9) / 5 + 32;
    return `${value.toFixed(1)}°${unit === 'metric' ? 'C' : 'F'}`;
  };

  const formatWindSpeed = (windSpeed) => {
    if (windSpeed === null || windSpeed === undefined) return 'N/A';
    return unit === 'metric' ? `${windSpeed.toFixed(1)} m/s` : `${(windSpeed * 2.237).toFixed(1)} mph`;
  };

  const getSeverityLevel = (count, total) => {
    const percentage = (count / total) * 100;
    if (percentage > 50) return 'severe';
    if (percentage > 20) return 'moderate';
    return 'low';
  };

  const severityStyles = {
    low: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-300'
    },
    moderate: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-300'
    },
    severe: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-300'
    }
  };

  // Prepare chart data
  const prepareDroughtChartData = () => {
    if (!weatherData.drought) return [];
    return weatherData.drought.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.drought_level_numeric || 3,
      category: item.drought_category
    }));
  };

  const prepareHeatwaveChartData = () => {
    if (!weatherData.heatwave) return [];
    return weatherData.heatwave.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      temperature: unit === 'metric' ? item.temperature_2m_mean : (item.temperature_2m_mean * 9) / 5 + 32,
      heatwave: item.heatwave_prediction === 1 || item.heatwave_prediction === '1' ? 1 : 0
    }));
  };

  const prepareRainfallChartData = () => {
    if (!weatherData.rainfall) return [];
    return weatherData.rainfall.map(item => ({
      time: new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      rainCategory: item.rain_category,
      confidence: item.prediction_confidence * 100
    }));
  };

  // Custom tooltips
  const DroughtTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm">
            Category: <span className="font-medium" style={{ color: getDroughtColor(data.category) }}>
              {data.category}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const HeatwaveTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isHeatwave = payload[1].value === 1;
      return (
        <div className="bg-white p-4 shadow-lg rounded border border-gray-200">
          <p className="font-bold">{label}</p>
          <p className={`text-sm ${isHeatwave ? 'text-red-600' : 'text-green-600'}`}>
            Temperature: {payload[0].value.toFixed(1)}°{unit === 'metric' ? 'C' : 'F'}
          </p>
          <p className={`text-sm font-medium ${isHeatwave ? 'text-red-600' : 'text-green-600'}`}>
            {isHeatwave ? 'Heatwave Expected' : 'Normal Conditions'}
          </p>
        </div>
      );
    }
    return null;
  };

  const RainfallTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-medium text-gray-800">{data.time}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry, index) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                <span className="font-medium">{entry.name}:</span> {entry.value}
                {entry.dataKey === 'confidence' ? '%' : ''}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const getDroughtColor = (category) => {
    if (category.includes("Extreme Drought")) return "#7f1d1d";
    if (category.includes("Severely Dry")) return "#ef4444";
    if (category.includes("Moderately Dry")) return "#f97316";
    if (category.includes("Mild Drought")) return "#eab308";
    if (category.includes("Moderately Wet")) return "#22c55e";
    if (category.includes("Very Wet")) return "#0ea5e9";
    if (category.includes("Extremely Wet")) return "#1e40af";
    return "#22c55e";
  };

  const getRainCategoryColor = (category) => {
    switch(category) {
      case 4: return '#0891b2';
      case 3: return '#7c3aed';
      case 2: return '#4f46e5';
      case 1: return '#2563eb';
      default: return '#6b7280';
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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TabsBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center space-x-3 mb-6 -mt-8">
            <Thermometer className="text-red-500" size={32} />
            <CloudRain className="text-blue-500" size={32} />
            <Droplet className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Weather Forecast</h1>
          </div>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5s">
            <div>
              <LocationSearch location={location} setLocation={setLocation} />
            </div>
            {/* Date Picker */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Select Forecast Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            <div>
              <UnitToggle unit={unit} setUnit={setUnit} />
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Drought Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl shadow-md overflow-hidden border ${severityStyles.low.border}`}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Droplet className="h-5 w-5 mr-2 text-blue-500" />
                Drought Status
              </h2>
              {loading.drought ? (
                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : error.drought ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
            <div className="p-5">
              {!location ? (
                <div className="text-gray-500 text-center py-4">
                  Select a location to view drought data
                </div>
              ) : loading.drought ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error.drought ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error.drought}</p>
                </div>
              ) : weatherData.drought ? (
                <>
                  <div className="h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={prepareDroughtChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 6]} />
                        <Tooltip content={<DroughtTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: (entry) => getDroughtColor(entry.category) }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <button 
                    onClick={() => toggleSection('droughtInfo')}
                    className="w-full flex items-center justify-between p-2 text-sm font-medium text-blue-800"
                  >
                    <span>Drought Information</span>
                    {expandedSections.droughtInfo ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>

          {/* Heatwave Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl shadow-md overflow-hidden border ${severityStyles.moderate.border}`}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-red-500" />
                Heatwave Status
              </h2>
              {loading.heatwave ? (
                <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : error.heatwave ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
            <div className="p-5">
              {!location ? (
                <div className="text-gray-500 text-center py-4">
                  Select a location to view heatwave data
                </div>
              ) : loading.heatwave ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : error.heatwave ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error.heatwave}</p>
                </div>
              ) : weatherData.heatwave ? (
                <>
                  <div className="h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prepareHeatwaveChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<HeatwaveTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#FF9843" 
                          fill="#FF9843" 
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <button 
                    onClick={() => toggleSection('heatwaveInfo')}
                    className="w-full flex items-center justify-between p-2 text-sm font-medium text-red-800"
                  >
                    <span>Heatwave Information</span>
                    {expandedSections.heatwaveInfo ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>

          {/* Rainfall Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className={`bg-white rounded-xl shadow-md overflow-hidden border ${severityStyles.low.border}`}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <CloudRain className="h-5 w-5 mr-2 text-blue-500" />
                Rainfall Forecast
              </h2>
              {loading.rainfall ? (
                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : error.rainfall ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : null}
            </div>
            <div className="p-5">
              {!location ? (
                <div className="text-gray-500 text-center py-4">
                  Select a location to view rainfall data
                </div>
              ) : loading.rainfall ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error.rainfall ? (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg">
                  <p className="font-medium">Error:</p>
                  <p className="text-sm">{error.rainfall}</p>
                </div>
              ) : weatherData.rainfall ? (
                <>
                  <div className="h-40 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prepareRainfallChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 4]} />
                        <Tooltip content={<RainfallTooltip />} />
                        <Bar 
                          dataKey="rainCategory" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <button 
                    onClick={() => toggleSection('rainfallInfo')}
                    className="w-full flex items-center justify-between p-2 text-sm font-medium text-blue-800"
                  >
                    <span>Rainfall Information</span>
                    {expandedSections.rainfallInfo ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Expanded Information Sections */}
        <div className="space-y-6 mb-8">
          {/* Drought Information */}
          {expandedSections.droughtInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4">Drought Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Categories</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-900 mr-2"></span>
                      <span>Extreme Drought - Emergency water measures</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span>Severely Dry - Water restrictions likely</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                      <span>Moderately Dry - Water conservation advised</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span>Mild Drought - Slightly dry conditions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Conservation Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Fix leaking faucets and pipes</li>
                    <li>Use drought-resistant plants</li>
                    <li>Collect rainwater for garden use</li>
                    <li>Take shorter showers</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Heatwave Information */}
          {expandedSections.heatwaveInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-red-800 mb-4">Heatwave Safety</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Severity Levels</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                      <span>Severe - Extreme danger to health</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                      <span>Moderate - Caution needed</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span>Low - Normal conditions</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Prevention Tips</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Stay hydrated and cool</li>
                    <li>Avoid strenuous outdoor activities</li>
                    <li>Check on vulnerable individuals</li>
                    <li>Never leave people or pets in parked vehicles</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rainfall Information */}
          {expandedSections.rainfallInfo && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-4">Rainfall Intensity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Categories</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-cyan-600 mr-2"></span>
                      <span>Torrential Rain - Flooding likely</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-violet-600 mr-2"></span>
                      <span>Heavy Rain - Significant accumulation</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-indigo-600 mr-2"></span>
                      <span>Moderate Rain - Steady rainfall</span>
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                      <span>Light Rain - Minimal accumulation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Preparedness</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Clear drainage systems</li>
                    <li>Secure outdoor items</li>
                    <li>Avoid flooded areas</li>
                    <li>Have emergency supplies ready</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Detailed Data Tables */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Forecast Data</h2>
          
          {/* Tabs for different data views */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('drought')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'drought' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Drought Data
              </button>
              <button
                onClick={() => setActiveTab('heatwave')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'heatwave' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Heatwave Data
              </button>
              <button
                onClick={() => setActiveTab('rainfall')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'rainfall' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Rainfall Data
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'drought' && (
              <div className="overflow-x-auto">
                {weatherData.drought ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weatherData.drought.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium" style={{
                              backgroundColor: `${getDroughtColor(item.drought_category)}20`,
                              color: getDroughtColor(item.drought_category)
                            }}>
                              {item.drought_category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No drought data available
                  </div>
                )}
              </div>
            )}

            {activeTab === 'heatwave' && (
              <div className="overflow-x-auto">
                {weatherData.heatwave ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wind Speed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weatherData.heatwave.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTemperature(item.temperature_2m_mean)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatWindSpeed(item.wind_speed_10m_max)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {(item.heatwave_prediction === 1 || item.heatwave_prediction === '1') ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Heatwave
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No heatwave data available
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rainfall' && (
              <div className="overflow-x-auto">
                {weatherData.rainfall ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cloud Cover</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rainfall</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {weatherData.rainfall.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.relative_humidity_2m ? `${item.relative_humidity_2m}%` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.cloud_cover_mid ? `${item.cloud_cover_mid}%` : 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium text-white" style={{
                              backgroundColor: getRainCategoryColor(item.rain_category)
                            }}>
                              {getRainCategoryName(item.rain_category)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No rainfall data available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}