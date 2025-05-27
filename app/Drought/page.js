//app/Drought/page.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowRight, Droplet, AlertTriangle, Info, RefreshCw, ChevronDown, ChevronUp, TrendingUp, Thermometer } from 'lucide-react';
import LocationSearch from '@/component/LocationSearch';
import TabsBar from '@/component/TabsBar';

export default function DroughtForecast() {
  const [location, setLocation] = useState(null);
  const [droughtData, setDroughtData] = useState(null);
  const [gridInfo, setGridInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('forecast');
  const [showProbabilityChart, setShowProbabilityChart] = useState(false);
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);

  const fetchDroughtData = useCallback(async () => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://climate-backend-7hx4.onrender.com/predict/drought-forecast/?lat=${location.lat}&lon=${location.lon}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch drought data');
      }

      const data = await response.json();
      setDroughtData(data.predictions);
      setGridInfo(data.grid_info || `Using nearest grid at (${location.lat.toFixed(5)}, ${location.lon.toFixed(5)})`);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch drought data:', err);
    } finally {
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      fetchDroughtData();
    }
  }, [location, fetchDroughtData]);

  // Format confidence as percentage
  const formatConfidence = (confidence) => {
    return (confidence * 100).toFixed(1) + '%';
  };

  // Convert drought category to numeric value for chart - FIXED
  const categoryToValue = (category) => {
    // Map based on the correct drought_level_numeric mapping
    if (category.includes("Extreme Drought")) return 0;
    if (category.includes("Severely Dry")) return 1;
    if (category.includes("Moderately Dry")) return 2;
    if (category.includes("Mild Drought")) return 3;
    if (category.includes("Moderately Wet")) return 4;
    if (category.includes("Very Wet")) return 5;
    if (category.includes("Extremely Wet")) return 6;
    return 3; // Default to middle value if category not found
  };

  // Get color based on drought category
  const getCategoryColor = (category) => {
    if (category.includes("Extreme Drought")) return "#7f1d1d"; // red-900
    if (category.includes("Severely Dry")) return "#ef4444"; // red-500
    if (category.includes("Moderately Dry")) return "#f97316"; // orange-500
    if (category.includes("Mild Drought")) return "#eab308"; // yellow-600
    if (category.includes("Moderately Wet")) return "#22c55e"; // green-500
    if (category.includes("Very Wet")) return "#0ea5e9"; // sky-500
    if (category.includes("Extremely Wet")) return "#1e40af"; // blue-700
    return "#22c55e"; // green-500 as default
  };

  // Parse the probability data
  const parseProbabilities = (classProbabilities) => {
    if (!classProbabilities) return {};
    
    // If it's already an object, return it
    if (typeof classProbabilities === 'object' && !Array.isArray(classProbabilities)) {
      return classProbabilities;
    }
    
    // If it's a JSON string, parse it
    try {
      return typeof classProbabilities === 'string' 
        ? JSON.parse(classProbabilities) 
        : {};
    } catch (e) {
      console.error("Error parsing class probabilities:", e);
      return {};
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!droughtData) return [];
    
    return droughtData.map(item => {
      const probabilities = parseProbabilities(item.class_probabilities);
      
      return {
        date: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        }),
        fullDate: new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        value: item.drought_level_numeric !== undefined ? item.drought_level_numeric : categoryToValue(item.drought_category),
        category: item.drought_category,
        confidence: item.confidence,
        grid_id: item.grid_id,
        // Extract all probability categories
        extremeDrought: probabilities["Extreme Drought"] || 0,
        severelyDry: probabilities["Severely Dry"] || 0,
        moderatelyDry: probabilities["Moderately Dry"] || 0,
        mildDrought: probabilities["Mild Drought"] || 0,
        moderatelyWet: probabilities["Moderately Wet"] || 0,
        veryWet: probabilities["Very Wet"] || 0,
        extremelyWet: probabilities["Extremely Wet"] || 0
      };
    });
  };

  const chartData = prepareChartData();

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      // Calculate the probability of each category
      const probCategories = [
        { name: "Extreme Drought", value: data.extremeDrought, color: "#7f1d1d" },
        { name: "Severely Dry", value: data.severelyDry, color: "#ef4444" },
        { name: "Moderately Dry", value: data.moderatelyDry, color: "#f97316" },
        { name: "Mild Drought", value: data.mildDrought, color: "#eab308" },
        { name: "Moderately Wet", value: data.moderatelyWet, color: "#22c55e" },
        { name: "Very Wet", value: data.veryWet, color: "#0ea5e9" },
        { name: "Extremely Wet", value: data.extremelyWet, color: "#1e40af" }
      ].filter(cat => cat.value > 0).sort((a, b) => b.value - a.value);
      
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium">{data.fullDate}</p>
          <p className="text-sm">
            Category: <span className={`font-medium`} style={{ color: getCategoryColor(data.category) }}>
              {data.category}
            </span>
          </p>
          <p className="text-sm mb-2">Confidence: {formatConfidence(data.confidence)}</p>
          
          {probCategories.length > 0 && (
            <div className="mt-2 text-xs">
              <p className="font-medium mb-1">Probability Distribution:</p>
              <div className="space-y-1 max-w-xs">
                {probCategories.slice(0, 4).map((cat, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-20 truncate">{cat.name}:</div>
                    <div className="w-24 bg-gray-200 rounded-full h-1.5 ml-2">
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ width: `${cat.value * 100}%`, backgroundColor: cat.color }}
                      ></div>
                    </div>
                    <div className="ml-2">{(cat.value * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <TabsBar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center space-x-3 mb-6 -mt-8">
            <Droplet className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Drought Forecast</h1>
        </div>
        <div className="flex md:flex-row items-center justify-center mb-6">
          
          <div className="w-full md:w-1/2 lg:w-3/4">
            <LocationSearch location={location} setLocation={setLocation} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                  Drought Prediction Analytics
                </h2>
              </div>
              
              {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
                    <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
                  </div>
                  <span className="mt-4 text-gray-600">Loading drought data...</span>
                </div>
              ) : error ? (
                <div className="p-5 flex flex-col items-center">
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 w-full rounded">
                    <p className="font-medium">Error loading data:</p>
                    <p>{error}</p>
                    {location && (
                      <button 
                        onClick={fetchDroughtData}
                        className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex items-center"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ) : !location ? (
                <div className="p-5 flex flex-col items-center justify-center h-64">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded w-full">
                    <p className="text-blue-700 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Enter location coordinates to view drought forecast.
                    </p>
                  </div>
                </div>
              ) : droughtData ? (
                <div className="p-5">
                  {gridInfo && (
                    <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg flex items-center">
                      <Info className="h-4 w-4 mr-2 text-blue-500" />
                      {gridInfo}
                    </div>
                  )}
                  
                  <div className="h-69 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis className='text-sm'
                          domain={[0, 6]} 
                          ticks={[0, 1, 2, 3, 4, 5, 6]} 
                          tickFormatter={(value) => {
                            const labels = { 
                              0: 'Extreme Drought',
                              1: 'Severely Dry',
                              2: 'Moderately Dry', 
                              3: 'Mild Drought',
                              4: 'Moderately Wet',
                              5: 'Very Wet',
                              6: 'Extremely Wet'
                            };
                            return labels[value] || '';
                          }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          activeDot={{ r: 8, fill: '#1d4ed8' }} 
                          dot={{ r: 4, fill: (entry) => getCategoryColor(entry.category) }}
                          animationDuration={1000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drought Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability Distribution</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {droughtData.map((row, index) => {
                          // Parse probabilities
                          const probabilities = parseProbabilities(row.class_probabilities);
                          
                          // Get top 2 most likely categories
                          const topCategories = Object.entries(probabilities)
                            .map(([key, value]) => ({ category: key, probability: value }))
                            .sort((a, b) => b.probability - a.probability)
                            .slice(0, 2);
                            
                          return (
                            <tr 
                              key={index} 
                              className="transition-colors hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {new Date(row.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium`} style={{
                                  backgroundColor: `${getCategoryColor(row.drought_category)}20`,
                                  color: getCategoryColor(row.drought_category)
                                }}>
                                  {row.drought_category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                                    <div 
                                      className="h-2.5 rounded-full"
                                      style={{ 
                                        width: `${row.confidence * 100}%`,
                                        backgroundColor: getCategoryColor(row.drought_category)
                                      }}
                                    ></div>
                                  </div>
                                  {formatConfidence(row.confidence)}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="flex flex-col space-y-1">
                                  {topCategories.map((item, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{
                                        backgroundColor: getCategoryColor(item.category)
                                      }}></span>
                                      <span className="text-xs w-28 truncate">{item.category}:</span>
                                      <span className="text-xs font-medium">{(item.probability * 100).toFixed(1)}%</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
              <div className="p-5">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center">
                  <Droplet className="h-6 w-6 mr-2 text-yellow-600" />
                  Understanding Drought
                </h2>
                
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isInfoExpanded ? 'max-h-screen' : 'max-h-64'}`}>
                  <p className="text-gray-700 text-base mb-3">
                    A <strong>drought</strong> is a prolonged period of abnormally low rainfall that leads to a shortage of water. It can have severe impacts on agriculture, water supply, and daily life.
                  </p>
                  
                  <div className="flex items-start mb-3">
                    <div className="bg-yellow-200 rounded-full p-1 mr-2 mt-1">
                      <Droplet className="h-4 w-4 text-yellow-700" />
                    </div>
                    <p className="text-gray-700 text-base">
                      Droughts often come silently — with fewer rainy days, hotter temperatures, and dry soil. Over time, crops may fail, rivers may shrink, and water scarcity becomes a real challenge for communities.
                    </p>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <div className="bg-yellow-200 rounded-full p-1 mr-2 mt-1">
                      <AlertTriangle className="h-4 w-4 text-yellow-700" />
                    </div>
                    <p className="text-gray-700 text-base">
                      It&apos;s not just a climate issue — it&apos;s an economic, environmental, and social one. Understanding early signs and tracking weather trends helps reduce the risk and prepare smarter.
                    </p>
                  </div>
                  
                  <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg border border-yellow-200 mb-4">
                    <h3 className="font-semibold mb-2">Drought Categories:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-900 mr-2"></span>
                        <span><strong>Extreme Drought:</strong> Exceptional drought, emergency water measures</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                        <span><strong>Severely Dry:</strong> Critical drought conditions, water restrictions likely</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                        <span><strong>Moderately Dry:</strong> Increasing drought severity, water conservation advised</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                        <span><strong>Mild Drought:</strong> Early-stage drought, slightly dry conditions</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                        <span><strong>Moderately Wet:</strong> Normal to above-normal conditions</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-sky-500 mr-2"></span>
                        <span><strong>Very Wet:</strong> Well above normal moisture</span>
                      </li>
                      <li className="flex items-center">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-700 mr-2"></span>
                        <span><strong>Extremely Wet:</strong> Exceptionally wet conditions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-4 rounded-lg">
                    <h3 className="font-semibold mb-1">Water Conservation Tips:</h3>
                    <ul className="space-y-1 pl-5 list-disc">
                      <li>Fix leaking faucets and pipes</li>
                      <li>Take shorter showers</li>
                      <li>Use drought-resistant plants in landscaping</li>
                      <li>Collect rainwater for garden use</li>
                      <li>Reuse water when possible</li>
                    </ul>
                  </div>
                </div>
                
                <button 
                  className="w-full mt-3 flex items-center justify-center p-2 text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors duration-200"
                  onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                >
                  {isInfoExpanded ? 'Show Less' : 'Learn More'}
                  <ArrowRight className={`h-4 w-4 ml-1 transition-transform duration-200 ${isInfoExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Weather Alerts</h3>
              {location ? (
                <div className="animate-pulse mb-3">
                  <p className="text-sm text-gray-500">Checking for alerts near your location...</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Enter a location to view weather alerts</p>
              )}
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  View National Drought Monitor
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}